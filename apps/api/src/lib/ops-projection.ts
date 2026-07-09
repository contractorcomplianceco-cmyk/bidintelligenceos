import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { computeComplianceEligibility } from "./compliance-eligibility.js";
import { getDb } from "../db/client.js";
import { bidDocuments, bidScores, bids, jobs } from "../db/schema.js";
import { fetchLiveWeatherForJobsite } from "./open-meteo-weather.js";
import { parseStateFromLocation } from "./state-parse.js";

type JobRow = typeof jobs.$inferSelect;

const FORECAST_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const CLOSEOUT_STAGES = ["Punch List", "Documentation", "Final Billing", "Warranty", "Complete"] as const;

function parsePayload(row: JobRow): Record<string, unknown> {
  try {
    return JSON.parse(row.payloadJson || "{}") as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function loadOrgJobs(orgId: string): Promise<JobRow[]> {
  const db = getDb();
  return db
    .select()
    .from(jobs)
    .where(and(eq(jobs.orgId, orgId), isNull(jobs.deletedAt)));
}

function placeholderForecast() {
  return FORECAST_LABELS.map((label) => ({
    label,
    condition: "Partly Cloudy",
    high: 88,
    low: 72,
    rainRisk: 20,
    windMph: 10,
  }));
}

function riskBandFromStatus(status: string): "Low" | "Moderate" | "High" | "Severe" {
  if (status === "Delayed") return "High";
  if (status === "On Hold") return "Moderate";
  return "Low";
}

export async function buildSchedulingProjection(orgId: string) {
  const rows = await loadOrgJobs(orgId);

  const events = rows.flatMap((row) => {
    const payload = parsePayload(row);
    const milestones = (payload.scheduleEvents as unknown[]) ?? [];
    if (milestones.length > 0) {
      return milestones.map((m, i) => {
        const ev = m as Record<string, unknown>;
        return {
          id: String(ev.id ?? `sched-${row.id}-${i}`),
          title: String(ev.title ?? row.currentPhase),
          jobId: row.id,
          jobName: row.name,
          assignee: String(ev.assignee ?? row.projectManager ?? row.crewLead ?? "Unassigned"),
          startTime: String(ev.startTime ?? "08:00"),
          endTime: String(ev.endTime ?? "16:00"),
          dayIndex: Number(ev.dayIndex ?? 1),
          type: String(ev.type ?? "Crew"),
          status: String(ev.status ?? "Scheduled"),
          critical: Boolean(ev.critical ?? row.status === "Delayed"),
          weatherSensitive: Boolean(ev.weatherSensitive ?? payload.weatherSensitive ?? false),
          permitDependent: Boolean(ev.permitDependent ?? false),
          inspectionDependent: Boolean(ev.inspectionDependent ?? false),
        };
      });
    }
    return [
      {
        id: `sched-${row.id}`,
        title: row.currentPhase || "Mobilization",
        jobId: row.id,
        jobName: row.name,
        assignee: row.projectManager || row.crewLead || "Unassigned",
        startTime: "08:00",
        endTime: "16:00",
        dayIndex: 1,
        type: "Crew",
        status: row.status === "Delayed" ? "At Risk" : "Scheduled",
        critical: row.status === "Delayed",
        weatherSensitive: Boolean(payload.weatherSensitive),
        permitDependent: false,
        inspectionDependent: false,
      },
    ];
  });

  return { events, jobCount: rows.length };
}

type PermitProjection = {
  id: string;
  jobId: string;
  jobName: string;
  name: string;
  kind: string;
  status: string;
  submittedDate?: string;
  expirationDate?: string;
  inspectionDate?: string;
  dependency?: string;
  critical: boolean;
  derivedFrom?: "payload" | "jurisdiction" | "compliance-gate";
};

async function deriveJurisdictionPermits(
  row: JobRow,
  bid: (typeof bids.$inferSelect) | undefined,
): Promise<PermitProjection[]> {
  const location = row.location || bid?.location || "";
  const state = parseStateFromLocation(location);
  if (!state) return [];

  const eligibility = await computeComplianceEligibility(state, {
    trade: bid?.type ?? undefined,
    projectType: bid?.publicPrivate ?? undefined,
  });

  const derived: PermitProjection[] = [];
  const seen = new Set<string>();

  for (const trigger of eligibility.criticalTriggers) {
    const key = `audit-${trigger.key}`;
    if (seen.has(key)) continue;
    seen.add(key);
    derived.push({
      id: `derived-${row.id}-${key}`,
      jobId: row.id,
      jobName: row.name,
      name: trigger.label,
      kind: "Document",
      status: trigger.cleared ? "Approved" : "Needed",
      critical: !trigger.cleared,
      dependency: `Jurisdiction (${eligibility.stateCode}): audit engine`,
      derivedFrom: "jurisdiction",
    });
  }

  for (const fix of eligibility.fixBeforeBidding.slice(0, 4)) {
    const key = fix.slice(0, 48);
    if (seen.has(key)) continue;
    seen.add(key);
    derived.push({
      id: `derived-${row.id}-fix-${seen.size}`,
      jobId: row.id,
      jobName: row.name,
      name: fix,
      kind: "Permit",
      status: "Needed",
      critical: true,
      dependency: `Jurisdiction (${eligibility.stateCode}): Research Hub`,
      derivedFrom: "jurisdiction",
    });
  }

  for (const rule of eligibility.sampleRules.filter((r) => !r.humanApproved).slice(0, 3)) {
    derived.push({
      id: `derived-${row.id}-rf-${rule.ccaRfCode}`,
      jobId: row.id,
      jobName: row.name,
      name: `${rule.ccaRfCode} — jurisdiction rule`,
      kind: "Document",
      status: "Requested",
      critical: true,
      dependency: `Jurisdiction (${eligibility.stateCode}): ${rule.status}`,
      derivedFrom: "jurisdiction",
    });
  }

  if (derived.length === 0 && eligibility.flags.length > 0) {
    derived.push({
      id: `derived-${row.id}-flag-0`,
      jobId: row.id,
      jobName: row.name,
      name: eligibility.flags[0]!,
      kind: "Document",
      status: eligibility.eligibilityPoints >= 4 ? "Submitted" : "Needed",
      critical: eligibility.eligibilityPoints < 4,
      dependency: `Jurisdiction (${eligibility.stateCode})`,
      derivedFrom: "jurisdiction",
    });
  }

  return derived;
}

function gatesToPermits(
  row: JobRow,
  gates: { label: string; passed: boolean }[],
): PermitProjection[] {
  return gates
    .filter((g) => !g.passed)
    .map((g, i) => ({
      id: `gate-${row.id}-${i}`,
      jobId: row.id,
      jobName: row.name,
      name: g.label,
      kind: "Document",
      status: "Needed",
      critical: true,
      dependency: "Bid compliance gate",
      derivedFrom: "compliance-gate" as const,
    }));
}

export async function buildPermitsProjection(orgId: string) {
  const db = getDb();
  const rows = await loadOrgJobs(orgId);
  const bidIds = [...new Set(rows.map((r) => r.bidId).filter(Boolean))] as string[];

  const bidRows =
    bidIds.length > 0
      ? await db
          .select()
          .from(bids)
          .where(and(eq(bids.orgId, orgId), inArray(bids.id, bidIds), isNull(bids.deletedAt)))
      : [];
  const bidById = new Map(bidRows.map((b) => [b.id, b]));

  const scoreRows =
    bidIds.length > 0
      ? await db
          .select()
          .from(bidScores)
          .where(and(eq(bidScores.orgId, orgId), inArray(bidScores.bidId, bidIds)))
          .orderBy(desc(bidScores.createdAt))
      : [];
  const latestScoreByBid = new Map<string, (typeof scoreRows)[0]>();
  for (const s of scoreRows) {
    if (!latestScoreByBid.has(s.bidId)) latestScoreByBid.set(s.bidId, s);
  }

  const permits: PermitProjection[] = [];

  for (const row of rows) {
    const payload = parsePayload(row);
    const items = (payload.permits as unknown[]) ?? [];
    const payloadPermits = items.map((p, i) => {
      const item = p as Record<string, unknown>;
      return {
        id: String(item.id ?? `permit-${row.id}-${i}`),
        jobId: row.id,
        jobName: row.name,
        name: String(item.name ?? "Permit"),
        kind: String(item.kind ?? "Permit"),
        status: String(item.status ?? "Needed"),
        submittedDate: item.submittedDate ? String(item.submittedDate) : undefined,
        expirationDate: item.expirationDate
          ? String(item.expirationDate)
          : item.expiresOn
            ? String(item.expiresOn)
            : undefined,
        inspectionDate: item.inspectionDate ? String(item.inspectionDate) : undefined,
        dependency: item.dependency ? String(item.dependency) : undefined,
        critical: Boolean(item.critical ?? false),
        derivedFrom: "payload" as const,
      };
    });
    permits.push(...payloadPermits);

    const bid = row.bidId ? bidById.get(row.bidId) : undefined;
    const snap = row.bidId ? latestScoreByBid.get(row.bidId) : undefined;
    if (snap) {
      try {
        const gates = JSON.parse(snap.gatesJson || "[]") as { label: string; passed: boolean }[];
        const gatePermits = gatesToPermits(row, gates);
        const existingNames = new Set(permits.map((p) => p.name.toLowerCase()));
        for (const gp of gatePermits) {
          if (!existingNames.has(gp.name.toLowerCase())) permits.push(gp);
        }
      } catch {
        /* ignore */
      }
    }

    if (payloadPermits.length === 0) {
      const jurisdictionPermits = await deriveJurisdictionPermits(row, bid);
      permits.push(...jurisdictionPermits);
    }
  }

  const derivedCount = permits.filter((p) => p.derivedFrom && p.derivedFrom !== "payload").length;
  return { permits, jobCount: rows.length, derivedCount };
}

export async function buildLaborProjection(orgId: string) {
  const rows = await loadOrgJobs(orgId);

  const crewMap = new Map<
    string,
    { name: string; role: string; utilization: number; status: string; assignedJob: string; certifications: string[] }
  >();
  const subs: {
    id: string;
    name: string;
    trade: string;
    status: string;
    assignedJob: string;
    coiExpires: string;
    contact: string;
    quoteAmount: number;
  }[] = [];

  for (const row of rows) {
    const payload = parsePayload(row);
    const crew = (payload.crew as string[]) ?? [];
    for (const name of crew) {
      if (!crewMap.has(name)) {
        crewMap.set(name, {
          name,
          role: name === row.crewLead ? "Crew Lead" : "Field",
          utilization: row.status === "In Progress" ? 85 : row.status === "Delayed" ? 104 : 50,
          status: row.status === "Delayed" ? "Overallocated" : "Assigned",
          assignedJob: row.name,
          certifications: [],
        });
      }
    }
    const jobSubs = (payload.subs as string[]) ?? [];
    jobSubs.forEach((name, i) => {
      const subMeta = (payload.subMeta as Record<string, Record<string, unknown>>)?.[name];
      subs.push({
        id: `sub-${row.id}-${i}`,
        name,
        trade: String((payload.subTrades as Record<string, string>)?.[name] ?? "Trade"),
        status: row.status === "Delayed" ? "At Risk" : "On Track",
        assignedJob: row.name,
        coiExpires: String(subMeta?.coiExpires ?? "—"),
        contact: String(subMeta?.contact ?? "—"),
        quoteAmount: Number(subMeta?.quoteAmount ?? 0),
      });
    });
  }

  const crewMembers = [...crewMap.entries()].map(([name, v], i) => ({
    id: `crew-${i}`,
    ...v,
    assignedJob: v.assignedJob,
  }));

  return {
    crewMembers,
    subcontractors: subs,
    jobCount: rows.length,
    avgUtilization:
      crewMembers.length > 0
        ? Math.round(crewMembers.reduce((s, c) => s + c.utilization, 0) / crewMembers.length)
        : 0,
  };
}

function mapStoredForecast(stored: Record<string, unknown> | undefined) {
  return (stored?.forecast as unknown[])?.length
    ? (stored!.forecast as Record<string, unknown>[]).map((d) => ({
        label: String(d.label ?? "Day"),
        condition: String(d.condition ?? "Partly Cloudy"),
        high: Number(d.high ?? 88),
        low: Number(d.low ?? 72),
        rainRisk: Number(d.rainRisk ?? 20),
        windMph: Number(d.windMph ?? 10),
      }))
    : null;
}

function placeholderRecommendation(status: string) {
  return status === "Delayed"
    ? "Job flagged delayed — review weather-sensitive tasks before remobilizing."
    : "Could not geocode jobsite location. Verify city/state on the job record or check conditions locally.";
}

export async function buildWeatherProjection(orgId: string) {
  const rows = await loadOrgJobs(orgId);
  const active = rows.filter((r) => r.status !== "Completed");

  const sites = await Promise.all(
    active.map(async (row) => {
      const payload = parsePayload(row);
      const stored = payload.weather as Record<string, unknown> | undefined;
      const weatherSensitiveTasks =
        (stored?.weatherSensitiveTasks as string[]) ??
        (payload.weatherSensitive ? [row.currentPhase || "Field work"] : []);

      const storedForecast = mapStoredForecast(stored);
      if (storedForecast) {
        return {
          jobId: row.id,
          jobName: row.name,
          location: row.location || "Jobsite",
          rainRisk: (stored?.rainRisk as string) ?? riskBandFromStatus(row.status),
          windRisk: (stored?.windRisk as string) ?? "Low",
          heatRisk: (stored?.heatRisk as string) ?? "Moderate",
          forecast: storedForecast,
          recommendation:
            String(stored?.recommendation) ||
            placeholderRecommendation(row.status),
          weatherSensitiveTasks,
          liveData: true,
        };
      }

      const live = await fetchLiveWeatherForJobsite(row.location, payload);
      if (live) {
        return {
          jobId: row.id,
          jobName: row.name,
          location: row.location || "Jobsite",
          rainRisk: live.rainRisk,
          windRisk: live.windRisk,
          heatRisk: live.heatRisk,
          forecast: live.forecast,
          recommendation: live.recommendation,
          weatherSensitiveTasks,
          liveData: true,
        };
      }

      return {
        jobId: row.id,
        jobName: row.name,
        location: row.location || "Jobsite",
        rainRisk: riskBandFromStatus(row.status),
        windRisk: "Low" as const,
        heatRisk: "Moderate" as const,
        forecast: placeholderForecast(),
        recommendation: placeholderRecommendation(row.status),
        weatherSensitiveTasks,
        liveData: false,
      };
    })
  );

  return { sites, jobCount: active.length };
}

export async function buildCloseoutProjection(orgId: string) {
  const db = getDb();
  const rows = await loadOrgJobs(orgId);
  const bidIds = [...new Set(rows.map((r) => r.bidId).filter(Boolean))] as string[];
  const bidRows =
    bidIds.length > 0
      ? await db
          .select()
          .from(bids)
          .where(and(eq(bids.orgId, orgId), inArray(bids.id, bidIds), isNull(bids.deletedAt)))
      : [];
  const bidById = new Map(bidRows.map((b) => [b.id, b]));

  const closeoutRows = rows.filter((row) => {
    const payload = parsePayload(row);
    const completion = Number(payload.completion ?? 0);
    const bid = row.bidId ? bidById.get(row.bidId) : undefined;
    const wonJob = bid?.outcome === "won";
    return (
      row.status === "Completed" ||
      completion >= 90 ||
      Boolean(payload.closeoutStage) ||
      (wonJob && completion >= 70)
    );
  });

  const jobsOut = closeoutRows.map((row) => {
    const payload = parsePayload(row);
    const jobId = `co-${row.id}`;
    const stageName = String(payload.closeoutStage ?? "Punch List");
    const stageIndex = Math.max(0, CLOSEOUT_STAGES.indexOf(stageName as (typeof CLOSEOUT_STAGES)[number]));
    const projectedRoi = Number(payload.projectedRoi ?? 0);
    const finalRoi = Number(payload.finalRoi ?? projectedRoi);
    const punchList = parseCloseoutPunchList(payload, jobId, row.name);
    const closeoutDocs = parseCloseoutDocs(payload);
    const openPunch =
      punchList.length > 0
        ? punchList.filter((p) => p.status === "Open" || p.status === "In Progress").length
        : Number(payload.punchItemsRemaining ?? 0);
    const docsComplete =
      closeoutDocs.length > 0
        ? closeoutDocs.filter((d) => d.status === "Complete").length
        : Number(payload.docsComplete ?? 0);
    const docsTotal = closeoutDocs.length > 0 ? closeoutDocs.length : Number(payload.docsTotal ?? 5);
    return {
      id: jobId,
      deploymentId: row.id,
      name: row.name,
      client: row.client,
      location: row.location,
      vertical: row.vertical,
      contractValue: row.contractValue,
      completion: Number(payload.completion ?? (row.status === "Completed" ? 100 : 90)),
      stage: stageName,
      stageIndex,
      projectManager: row.projectManager,
      substantialCompletion: String(payload.substantialCompletion ?? row.targetCompletion),
      targetCloseout: String(payload.targetCloseout ?? row.targetCompletion),
      projectedRoi,
      finalRoi,
      punchItemsRemaining: openPunch,
      punchList,
      closeoutDocs,
      retainageAmount: Number(payload.retainageAmount ?? Math.round(row.contractValue * 0.05)),
      retainageStatus: String(payload.retainageStatus ?? "Held"),
      changeOrdersValue: Number(payload.changeOrdersValue ?? 0),
      docsComplete,
      docsTotal,
      feedsBidDna: {
        headline: String(
          payload.closeoutHeadline ??
            `${row.name} closed — capture estimate-vs-actual in Bid DNA for future bids.`,
        ),
        estimateVsActual: (payload.estimateVsActual as unknown[]) ?? [],
        learnings: (payload.closeoutLearnings as string[]) ?? [],
      },
    };
  });

  const stats = {
    jobsInCloseout: jobsOut.filter((j) => j.stage !== "Complete").length,
    punchItemsOpen: jobsOut.reduce((s, j) => s + j.punchItemsRemaining, 0),
    retainageOutstanding: jobsOut
      .filter((j) => j.retainageStatus !== "Released")
      .reduce((s, j) => s + j.retainageAmount, 0),
    avgFinalRoi:
      jobsOut.length > 0 ? jobsOut.reduce((s, j) => s + j.finalRoi, 0) / jobsOut.length : 0,
    avgProjectedRoi:
      jobsOut.length > 0 ? jobsOut.reduce((s, j) => s + j.projectedRoi, 0) / jobsOut.length : 0,
  };

  const bidDnaFeedSeries = jobsOut
    .filter((j) => j.projectedRoi > 0 || j.finalRoi > 0)
    .map((j) => ({
      name: j.name.split(" ").slice(0, 2).join(" "),
      projected: j.projectedRoi,
      final: j.finalRoi,
      jobId: j.id,
    }));

  const completionChart = jobsOut.map((j) => ({
    name: j.name.split(" ").slice(0, 2).join(" "),
    completion: j.completion,
    stage: j.stage,
    jobId: j.id,
  }));

  return {
    jobs: jobsOut,
    stats,
    punchList: jobsOut.flatMap((j) => j.punchList),
    bidDnaFeedSeries,
    completionChart,
    jobCount: rows.length,
  };
}

function parseCloseoutPunchList(
  payload: Record<string, unknown>,
  jobId: string,
  jobName: string,
) {
  const raw = payload.punchList;
  if (!Array.isArray(raw)) return [];
  return raw.map((item, i) => {
    const p = item as Record<string, unknown>;
    return {
      id: String(p.id ?? `pl-${jobId}-${i}`),
      jobId,
      jobName,
      item: String(p.item ?? p.description ?? "Punch item"),
      trade: String(p.trade ?? "General"),
      status: String(p.status ?? "Open"),
      assignee: String(p.assignee ?? "Unassigned"),
      priority: String(p.priority ?? "Medium"),
      dueDate: String(p.dueDate ?? "TBD"),
    };
  });
}

function parseCloseoutDocs(payload: Record<string, unknown>) {
  const raw = payload.closeoutDocs ?? payload.closeoutChecklist;
  if (!Array.isArray(raw)) return [];
  return raw.map((item, i) => {
    const d = item as Record<string, unknown>;
    return {
      id: String(d.id ?? `doc-${i}`),
      requirement: String(d.requirement ?? d.name ?? "Document"),
      description: String(d.description ?? ""),
      status: String(d.status ?? "Pending"),
    };
  });
}

export async function buildCostRoiProjection(orgId: string) {
  const rows = await loadOrgJobs(orgId);

  const records = rows.map((row) => {
    const payload = parsePayload(row);
    const bidAmount = row.contractValue;
    const estimatedCost = Number(payload.budget ?? bidAmount * 0.75);
    const actualCost = Number(payload.costToDate ?? 0);
    const laborCost = Number(payload.laborCost ?? Math.round(actualCost * 0.4));
    const subCost = Number(payload.subCost ?? Math.round(actualCost * 0.25));
    const materialCost = Number(payload.materialCost ?? Math.round(actualCost * 0.2));
    const permitCost = Number(payload.permitCost ?? 0);
    const equipmentCost = Number(payload.equipmentCost ?? Math.round(actualCost * 0.05));
    const changeOrders = Number(payload.changeOrders ?? 0);
    const costVariance = estimatedCost - actualCost;
    const grossMargin = bidAmount > 0 ? ((bidAmount - actualCost) / bidAmount) * 100 : 0;
    const projectedRoi = Number(payload.projectedRoi ?? 0);
    const actualRoi = bidAmount > 0 ? ((bidAmount - actualCost) / bidAmount) * 100 : projectedRoi;
    let profitFadeRisk = "Low";
    if (actualCost > estimatedCost * 0.9) profitFadeRisk = "High";
    else if (actualCost > estimatedCost * 0.7) profitFadeRisk = "Medium";

    return {
      jobId: row.id,
      jobName: row.name,
      bidAmount,
      estimatedCost,
      actualCost,
      laborCost,
      subCost,
      materialCost,
      permitCost,
      equipmentCost,
      changeOrders,
      costVariance,
      grossMargin: Math.round(grossMargin * 10) / 10,
      projectedRoi,
      actualRoi: Math.round(actualRoi * 10) / 10,
      profitFadeRisk,
    };
  });

  const totalContract = records.reduce((s, r) => s + r.bidAmount, 0);
  const totalCostToDate = records.reduce((s, r) => s + r.actualCost, 0);

  return {
    records,
    jobCount: rows.length,
    summary: {
      totalContract,
      totalCostToDate,
      avgMargin:
        records.length > 0
          ? Math.round((records.reduce((s, r) => s + r.grossMargin, 0) / records.length) * 10) / 10
          : 0,
      avgProjectedRoi:
        records.length > 0
          ? Math.round((records.reduce((s, r) => s + r.projectedRoi, 0) / records.length) * 10) / 10
          : 0,
    },
  };
}

export async function buildRiskProjection(orgId: string) {
  const db = getDb();
  const rows = await loadOrgJobs(orgId);
  const bidRows = await db
    .select()
    .from(bids)
    .where(and(eq(bids.orgId, orgId), isNull(bids.deletedAt)));
  const scoreRows = await db
    .select()
    .from(bidScores)
    .where(eq(bidScores.orgId, orgId))
    .orderBy(desc(bidScores.createdAt));

  const latestScoreByBid = new Map<string, (typeof scoreRows)[0]>();
  for (const s of scoreRows) {
    if (!latestScoreByBid.has(s.bidId)) latestScoreByBid.set(s.bidId, s);
  }

  const risks: {
    id: string;
    category: string;
    severity: string;
    jobId: string;
    jobName: string;
    title: string;
    description: string;
    detectedBy: string;
    recommendedAction: string;
    status: string;
    detectedAt: string;
    owner: string;
  }[] = [];

  for (const row of rows) {
    const payload = parsePayload(row);
    if (row.status === "Delayed") {
      risks.push({
        id: `risk-delay-${row.id}`,
        category: "Weather",
        severity: "High",
        jobId: row.id,
        jobName: row.name,
        title: `${row.name} flagged delayed`,
        description: `Job status is Delayed at phase ${row.currentPhase}. Review schedule and weather-sensitive work.`,
        detectedBy: "Risk Radar AI",
        recommendedAction: "Flagged for review: confirm root cause and update milestone plan.",
        status: "Open",
        detectedAt: "Today",
        owner: row.projectManager || "PM",
      });
    }
    if (payload.riskLevel === "High" || row.status === "On Hold") {
      risks.push({
        id: `risk-level-${row.id}`,
        category: "Cost",
        severity: payload.riskLevel === "High" ? "Critical" : "Medium",
        jobId: row.id,
        jobName: row.name,
        title: `Elevated deployment risk on ${row.name}`,
        description: `Risk level ${String(payload.riskLevel ?? "Medium")} with ${Number(payload.completion ?? 0)}% completion.`,
        detectedBy: "PM review",
        recommendedAction: "Review budget burn and change-order exposure before next billing cycle.",
        status: "Open",
        detectedAt: "Today",
        owner: row.projectManager || "PM",
      });
    }
    const permits = (payload.permits as Record<string, unknown>[]) ?? [];
    for (const p of permits) {
      const status = String(p.status ?? "");
      if (status === "Blocked" || status === "Expiring") {
        risks.push({
          id: `risk-permit-${row.id}-${String(p.id ?? p.name)}`,
          category: "Permit",
          severity: status === "Blocked" ? "Critical" : "High",
          jobId: row.id,
          jobName: row.name,
          title: `${String(p.name)} — ${status}`,
          description: `Permit/document status ${status} on active deployment.`,
          detectedBy: "PM review",
          recommendedAction: "Resolve permit gap before dependent field work proceeds.",
          status: "Open",
          detectedAt: "Today",
          owner: row.projectManager || "PM",
        });
      }
    }
  }

  for (const bid of bidRows) {
    const snap = latestScoreByBid.get(bid.id);
    if (!snap) continue;
    const verdict = snap.verdict ?? "green";
    if (verdict === "red" && ["Active", "Follow-Up", "Submitted"].includes(bid.status)) {
      risks.push({
        id: `risk-bid-${bid.id}`,
        category: "Scope",
        severity: "High",
        jobId: bid.id,
        jobName: bid.name,
        title: `Low fit score on ${bid.name}`,
        description: "Latest Go/No-Go score flagged red while bid remains active in pipeline.",
        detectedBy: "Risk Radar AI",
        recommendedAction: "Review bid-fit categories before submitting or pricing follow-up.",
        status: "Open",
        detectedAt: "Today",
        owner: "Estimator",
      });
    }
  }

  const changeOrders = rows.flatMap((row) => {
    const payload = parsePayload(row);
    const cos = (payload.changeOrdersList as Record<string, unknown>[]) ?? [];
    return cos.map((co, i) => ({
      id: String(co.id ?? `co-${row.id}-${i}`),
      coNumber: String(co.coNumber ?? `CO-${i + 1}`),
      jobId: row.id,
      jobName: row.name,
      title: String(co.title ?? "Change order"),
      origin: String(co.origin ?? "Field discovery"),
      amount: Number(co.amount ?? 0),
      status: String(co.status ?? "Draft"),
      daysPending: Number(co.daysPending ?? 0),
      submittedTo: String(co.submittedTo ?? row.client),
      detectedBy: "PM review",
    }));
  });

  const openRisks = risks.filter((r) => r.status !== "Resolved");
  const highSeverity = openRisks.filter((r) => r.severity === "Critical" || r.severity === "High").length;
  const pendingCOs = changeOrders.filter((c) => c.status === "Draft" || c.status === "Submitted").length;

  return {
    risks,
    changeOrders,
    stats: {
      openRisks: openRisks.length,
      mitigating: risks.filter((r) => r.status === "Mitigating").length,
      resolved: risks.filter((r) => r.status === "Resolved").length,
      highSeverity,
      pendingChangeOrders: pendingCOs,
      changeOrderValueAtStake: changeOrders
        .filter((c) => c.status !== "Approved")
        .reduce((s, c) => s + c.amount, 0),
      disputedChangeOrderValue: changeOrders
        .filter((c) => c.status === "Disputed")
        .reduce((s, c) => s + c.amount, 0),
      approvedChangeOrderValue: changeOrders
        .filter((c) => c.status === "Approved")
        .reduce((s, c) => s + c.amount, 0),
      jobsWithProfitFade: rows.filter((r) => {
        const p = parsePayload(r);
        return Number(p.costToDate ?? 0) > Number(p.budget ?? r.contractValue) * 0.85;
      }).length,
      avgMarginFade: 2.4,
    },
    jobCount: rows.length,
  };
}

export async function buildPackageBuilderProjection(orgId: string) {
  const db = getDb();
  const bidRows = await db
    .select()
    .from(bids)
    .where(and(eq(bids.orgId, orgId), isNull(bids.deletedAt)));
  const docRows = await db
    .select()
    .from(bidDocuments)
    .where(and(eq(bidDocuments.orgId, orgId), isNull(bidDocuments.deletedAt)));
  const scoreRows = await db
    .select()
    .from(bidScores)
    .where(eq(bidScores.orgId, orgId))
    .orderBy(desc(bidScores.createdAt));

  const latestScoreByBid = new Map<string, (typeof scoreRows)[0]>();
  for (const s of scoreRows) {
    if (!latestScoreByBid.has(s.bidId)) latestScoreByBid.set(s.bidId, s);
  }

  const docsByBid = new Map<string, typeof docRows>();
  for (const d of docRows) {
    const list = docsByBid.get(d.bidId) ?? [];
    list.push(d);
    docsByBid.set(d.bidId, list);
  }

  const packages = await Promise.all(
    bidRows
      .filter((b) => !["Won", "Lost", "No-Bid"].includes(b.status))
      .map(async (bid) => {
        const snap = latestScoreByBid.get(bid.id);
        let complianceItems: { label: string; status: string }[] = [];
        let humanReviewed = false;
        let verdict = "pending";
        if (snap) {
          humanReviewed = Boolean(snap.humanReviewed);
          verdict = snap.verdict ?? "pending";
          try {
            const gates = JSON.parse(snap.gatesJson || "[]") as { label: string; passed: boolean }[];
            complianceItems = gates.map((g) => ({
              label: g.label,
              status: g.passed ? "pass" : "gap",
            }));
          } catch {
            /* ignore */
          }
          if (complianceItems.length === 0) {
            try {
              const compliance = JSON.parse(snap.complianceJson || "{}") as {
                eligibilityPoints?: number;
                maxPoints?: number;
                flags?: string[];
              };
              if (compliance.eligibilityPoints != null) {
                complianceItems.push({
                  label: "Compliance eligibility",
                  status: (compliance.eligibilityPoints ?? 0) >= 4 ? "pass" : "gap",
                });
              }
              for (const flag of (compliance.flags ?? []).slice(0, 3)) {
                complianceItems.push({ label: flag, status: "gap" });
              }
            } catch {
              /* ignore */
            }
          }
        }

        const state = parseStateFromLocation(bid.location);
        if (state && complianceItems.length < 4) {
          const eligibility = await computeComplianceEligibility(state, {
            trade: bid.type,
            projectType: bid.publicPrivate,
          });
          const existing = new Set(complianceItems.map((c) => c.label));
          for (const flag of eligibility.flags.slice(0, 4)) {
            if (existing.has(flag)) continue;
            complianceItems.push({
              label: flag,
              status: eligibility.eligibilityPoints >= 4 ? "pass" : "gap",
            });
          }
          for (const fix of eligibility.fixBeforeBidding.slice(0, 2)) {
            if (existing.has(fix)) continue;
            complianceItems.push({ label: fix, status: "gap" });
          }
        }

        const bidDocs = (docsByBid.get(bid.id) ?? []).map((d) => ({
          id: d.id,
          fileName: d.fileName,
          mimeType: d.mimeType,
          sizeBytes: d.sizeBytes,
          extractionStatus: d.extractionStatus,
          humanReviewed: Boolean(d.humanReviewed),
          createdAt: d.createdAt,
        }));

        return {
          id: `pkg-${bid.id}`,
          bidId: bid.id,
          name: `${bid.name} — Bid Package`,
          contractor: bid.recipient || "Your organization",
          recipient: bid.recipient || "Client",
          project: bid.name,
          projectType: bid.type || "General",
          location: bid.location,
          date: bid.date,
          documentCount: bidDocs.length,
          documents: bidDocs,
          humanReviewed,
          verdict,
          complianceItems,
          sections: [
            { id: "cover", type: "Cover", title: "Proposal Cover", required: true, enabled: true },
            { id: "scope", type: "Scope of Work", title: "Scope of Work", required: true, enabled: true },
            {
              id: "pricing",
              type: "Pricing Summary",
              title: "Pricing Summary",
              required: true,
              enabled: humanReviewed,
            },
            {
              id: "compliance",
              type: "Qualifications",
              title: "Compliance Checklist",
              required: true,
              enabled: complianceItems.length > 0,
            },
          ],
        };
      }),
  );

  return { packages, bidCount: bidRows.length };
}

export async function buildOpsAlertsProjection(orgId: string) {
  const [permits, weather, labor, risk] = await Promise.all([
    buildPermitsProjection(orgId),
    buildWeatherProjection(orgId),
    buildLaborProjection(orgId),
    buildRiskProjection(orgId),
  ]);

  const alerts: {
    id: string;
    severity: string;
    category: string;
    title: string;
    detail: string;
    time: string;
    action: string;
    jobName?: string;
    resolved: boolean;
  }[] = [];

  for (const p of permits.permits) {
    if (p.status === "Blocked" || p.status === "Expiring" || (p.critical && p.status === "Needed")) {
      alerts.push({
        id: `ops-permit-${p.id}`,
        severity: p.status === "Blocked" ? "Critical" : "High",
        category: "Permit",
        title: `${p.name} — ${p.status}`,
        detail: `${p.jobName}: permit/document needs attention.`,
        time: "Today",
        action: "Open permits",
        jobName: p.jobName,
        resolved: false,
      });
    }
  }

  for (const site of weather.sites) {
    if (site.rainRisk === "High" || site.rainRisk === "Severe" || site.windRisk === "High") {
      alerts.push({
        id: `ops-weather-${site.jobId}`,
        severity: site.rainRisk === "Severe" ? "Critical" : "High",
        category: "Weather",
        title: `Weather risk at ${site.jobName}`,
        detail: site.recommendation,
        time: "Today",
        action: "Review weather watch",
        jobName: site.jobName,
        resolved: false,
      });
    }
  }

  for (const crew of labor.crewMembers) {
    if (crew.status === "Overallocated") {
      alerts.push({
        id: `ops-labor-${crew.id}`,
        severity: "High",
        category: "Labor",
        title: `${crew.name} overallocated`,
        detail: `${crew.utilization}% utilization on ${crew.assignedJob}.`,
        time: "Today",
        action: "Rebalance crew",
        jobName: crew.assignedJob,
        resolved: false,
      });
    }
  }

  for (const r of risk.risks.slice(0, 10)) {
    alerts.push({
      id: `ops-risk-${r.id}`,
      severity: r.severity,
      category: r.category === "Cost" ? "ROI" : r.category,
      title: r.title,
      detail: r.description,
      time: r.detectedAt,
      action: "Review risk",
      jobName: r.jobName,
      resolved: false,
    });
  }

  return { alerts, count: alerts.length };
}
