import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useApproveBidScore,
  useBidScore,
  useComplianceEligibility,
  useComplianceEligibilityByState,
  useComputeBidScore,
  useConfirmSecondReviewer,
  useLockBidScore,
  useOverrideJournal,
  useRecordBidOutcome,
  useRecordScoreOverride,
  type AutopsyReasonCode,
  type BidScoreSnapshot,
  type ComplianceEligibility,
  type ComputeBidScoreBody,
  type OverrideReasonCode,
} from "@/hooks/use-bids";
import { Loader2, ShieldCheck, ShieldAlert, Lock, CheckCircle2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import {
  BIDOS_OPTIONAL_TRADES,
  GENERIC_TRADE_HONESTY_BANNER,
  SCOPE_CLARITY_OPTIONS,
  STARTUP_HONESTY_BANNER,
  SUB_BENCH_DEPTH_OPTIONS,
} from "@/lib/trade-options";

const AI_REVIEW_LABEL = "Powered by AI · Reviewed by humans";

function parseStateFromLocation(location: string): string | null {
  const trimmed = location.trim();
  if (!trimmed) return null;
  const comma = trimmed.match(/,\s*([A-Z]{2})\b/i);
  if (comma) return comma[1].toUpperCase();
  const tail = trimmed.match(/\b([A-Z]{2})\b\s*$/i);
  if (tail) return tail[1].toUpperCase();
  return null;
}

function verdictStyle(verdict: string) {
  if (verdict === "Strong Go") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (verdict === "Conditional Go") return "bg-sky-100 text-sky-800 border-sky-200";
  if (verdict === "Executive Review Required") return "bg-amber-100 text-amber-900 border-amber-200";
  if (verdict === "No-Go") return "bg-rose-100 text-rose-800 border-rose-200";
  return "bg-slate-100 text-slate-800 border-slate-200";
}

function goNoGoLabel(verdict: string): { label: string; action: string } {
  if (verdict === "Strong Go") return { label: "GO", action: "Proceed — score supports bidding" };
  if (verdict === "Conditional Go") return { label: "CONDITIONAL GO", action: "Proceed with documented mitigations" };
  if (verdict === "Executive Review Required") return { label: "HOLD", action: "Executive review before go/no-go" };
  if (verdict === "No-Go") return { label: "NO-GO", action: "Do not bid without material scope change" };
  return { label: "REVIEW", action: "Compute or refresh score before decision" };
}

type ManualFields = {
  trade: string;
  scopeClarity: string;
  escalation: "" | "yes" | "no";
  bondingInfeasible: boolean;
  pursuitHours: string;
  secondReviewerConfirmed: boolean;
  hasScopeDocs: boolean;
  // electrical / mechanical
  gearPreOrdered: "" | "yes" | "no";
  leadDaysOverSchedule: string;
  controlsBmsScope: "" | "yes" | "no";
  // roofing
  occupiedBuilding: "" | "yes" | "no";
  activeLeak: "" | "yes" | "no";
  deckConditionKnown: "" | "yes" | "no";
  // civil
  permitSecured: "" | "yes" | "no";
  utilityConflictsKnown: "" | "yes" | "no";
  earthworkBalanceKnown: "" | "yes" | "no";
  // gc
  keySubCoverage: "" | "yes" | "no";
  selfPerformPct: string;
  subBenchDepth: string;
};

const DEFAULT_MANUAL: ManualFields = {
  trade: "generic",
  scopeClarity: "",
  escalation: "",
  bondingInfeasible: false,
  pursuitHours: "",
  secondReviewerConfirmed: false,
  hasScopeDocs: false,
  gearPreOrdered: "",
  leadDaysOverSchedule: "",
  controlsBmsScope: "",
  occupiedBuilding: "",
  activeLeak: "",
  deckConditionKnown: "",
  permitSecured: "",
  utilityConflictsKnown: "",
  earthworkBalanceKnown: "",
  keySubCoverage: "",
  selfPerformPct: "",
  subBenchDepth: "",
};

function buildScoreBody(m: ManualFields): ComputeBidScoreBody {
  const signals: Record<string, number | null> = {};
  const roseGates: Record<string, boolean | string[] | undefined> = {};

  if (m.scopeClarity) {
    const n = Number(m.scopeClarity);
    if (n >= 1 && n <= 5) signals.scope_clarity = n;
  }
  if (m.escalation === "yes") signals.escalation_protection = 0.9;
  if (m.escalation === "no") signals.escalation_protection = 0.15;

  if (m.bondingInfeasible) roseGates.bondingInfeasible = true;
  if (m.hasScopeDocs) roseGates.hasScopeDocs = true;

  const trade = m.trade || "generic";

  if (trade === "electrical" || trade === "mechanical") {
    const leadOver = Number(m.leadDaysOverSchedule);
    if (m.gearPreOrdered === "no" || (Number.isFinite(leadOver) && leadOver > 0)) {
      if (trade === "electrical") roseGates.electricalGearLeadFail = true;
      else roseGates.mechanicalLeadFail = true;
      signals.schedule_risk = 0.85;
    } else if (m.gearPreOrdered === "yes") {
      signals.schedule_risk = 0.25;
    }
    if (m.controlsBmsScope === "no") signals.scope_clarity = signals.scope_clarity ?? 0.35;
  }

  if (trade === "roofing") {
    if (m.occupiedBuilding === "yes" && m.activeLeak === "yes") {
      roseGates.roofingActiveLeakOccupied = true;
    }
    if (m.deckConditionKnown === "no") signals.scope_clarity = signals.scope_clarity ?? 0.4;
  }

  if (trade === "civil") {
    if (m.permitSecured === "no" || m.utilityConflictsKnown === "no") {
      roseGates.permitUtilityUnresolved = true;
    }
    if (m.earthworkBalanceKnown === "no") signals.scope_clarity = signals.scope_clarity ?? 0.4;
  }

  if (trade === "gc") {
    if (m.keySubCoverage === "no") roseGates.gcSubCoverageFail = true;
    const bench = Number(m.subBenchDepth);
    if (bench >= 1 && bench <= 5) signals.capacity_fit = bench / 5;
    const sp = Number(m.selfPerformPct);
    if (Number.isFinite(sp) && sp >= 0) {
      signals.capacity_fit = Math.min(1, Math.max(signals.capacity_fit ?? 0.5, sp / 100));
    }
  }

  const scopeN = Number(m.scopeClarity);
  const manualHeavy = scopeN >= 4 && !m.hasScopeDocs;
  if (manualHeavy) {
    roseGates.manualHeavy = true;
    if (m.secondReviewerConfirmed) roseGates.secondReviewerConfirmed = true;
  }

  let pursuitHours: number | undefined;
  if (m.pursuitHours.trim()) {
    const h = Number(m.pursuitHours);
    if (Number.isFinite(h) && h >= 0) {
      pursuitHours = h;
      // Higher hours → higher pursuit cost ratio risk (0–1)
      signals.pursuit_cost_ratio = Math.min(1, h / 120);
    }
  }

  return {
    trade,
    mode: "startup",
    signals: Object.keys(signals).length ? signals : undefined,
    roseGates: Object.keys(roseGates).length ? roseGates : undefined,
    pursuitHours,
  };
}

function YnSelect({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: "" | "yes" | "no";
  onChange: (v: "" | "yes" | "no") => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs text-slate-600">
        {label}
      </Label>
      {hint ? <p className="text-[11px] text-slate-500 leading-snug">{hint}</p> : null}
      <Select value={value || undefined} onValueChange={(v) => onChange(v as "yes" | "no")}>
        <SelectTrigger id={id} className="h-9">
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="yes">Yes</SelectItem>
          <SelectItem value="no">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function ComplianceBody({ eligibility, loading }: { eligibility?: ComplianceEligibility; loading?: boolean }) {
  if (loading) {
    return <p className="text-sm text-slate-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading jurisdiction rules…</p>;
  }
  if (!eligibility) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {eligibility.stateCode ?? "No state"}
        </Badge>
        <span className="text-sm font-semibold text-slate-900">
          {eligibility.eligibilityPoints}/{eligibility.maxPoints} compliance pts
        </span>
        {eligibility.researchConnected ? (
          <Badge className="bg-teal-50 text-teal-800 border border-teal-200">Research Hub live</Badge>
        ) : (
          <Badge variant="secondary">Bridge offline</Badge>
        )}
        {eligibility.auditConnected ? (
          <Badge className="bg-indigo-50 text-indigo-800 border border-indigo-200">
            Audit {eligibility.auditCode ?? "linked"}
          </Badge>
        ) : null}
      </div>
      <p className="text-xs text-slate-500">{eligibility.note}</p>
      {eligibility.auditFinalStatus && (
        <p className="text-sm text-slate-700">Audit status: {eligibility.auditFinalStatus}</p>
      )}
      {eligibility.criticalTriggers?.length > 0 && (
        <ul className="space-y-1.5">
          {eligibility.criticalTriggers.filter((t) => !t.cleared).map((t) => (
            <li key={t.key} className="text-sm text-rose-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" /> {t.label}
            </li>
          ))}
        </ul>
      )}
      {eligibility.exportReadyCount > 0 && (
        <p className="text-sm text-slate-700">{eligibility.exportReadyCount} export-ready rule(s) in preview.</p>
      )}
      {eligibility.flags.length > 0 && (
        <ul className="space-y-1.5">
          {eligibility.flags.map((f) => (
            <li key={f} className="text-sm text-amber-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" /> {f}
            </li>
          ))}
        </ul>
      )}
      {eligibility.fixBeforeBidding.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2">Fix before bidding</p>
          <ul className="space-y-1 text-sm text-amber-900">
            {eligibility.fixBeforeBidding.map((f) => (
              <li key={f}>• {f}</li>
            ))}
          </ul>
        </div>
      )}
      {eligibility.sampleRules.length > 0 && (
        <div className="rounded-lg border border-[#E2E8F0] overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-[#F8FAFC] text-slate-500">
              <tr>
                <th className="text-left px-3 py-2 font-semibold">Rule</th>
                <th className="text-left px-3 py-2 font-semibold">Stage</th>
                <th className="text-left px-3 py-2 font-semibold">Approved</th>
              </tr>
            </thead>
            <tbody>
              {eligibility.sampleRules.map((r) => (
                <tr key={r.ccaRfCode} className="border-t border-[#E2E8F0]">
                  <td className="px-3 py-2 font-mono text-slate-800">{r.ccaRfCode}</td>
                  <td className="px-3 py-2 text-slate-600">{r.status}</td>
                  <td className="px-3 py-2">{r.humanApproved ? "Yes" : "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ScoreBody({
  score,
  manual,
  setManual,
  onCompute,
  onApprove,
  onLock,
  onOutcome,
  onOverride,
  onSecondReviewer,
  journal,
  computing,
  approving,
  locking,
  recordingOutcome,
  overriding,
  confirmingReviewer,
  canRun,
  canApprove,
  canOverride,
}: {
  score?: BidScoreSnapshot | null;
  manual: ManualFields;
  setManual: (patch: Partial<ManualFields>) => void;
  onCompute: () => void;
  onApprove: () => void;
  onLock: () => void;
  onOutcome: (payload: {
    outcome: "won" | "lost" | "no-bid";
    reasonCodes?: string[];
    competitorNotes?: string;
  }) => void;
  onOverride?: (payload: { reasonCode: string; reasonText?: string }) => void;
  onSecondReviewer?: () => void;
  journal?: {
    id: string;
    reasonCode: string;
    reasonText?: string;
    userId: string;
    createdAt: string;
    fromVerdict?: string;
    toVerdict?: string;
  }[];
  computing?: boolean;
  approving?: boolean;
  locking?: boolean;
  recordingOutcome?: boolean;
  overriding?: boolean;
  confirmingReviewer?: boolean;
  canRun: boolean;
  canApprove: boolean;
  canOverride: boolean;
}) {
  const [autopsyOutcome, setAutopsyOutcome] = useState<"won" | "lost" | "no-bid" | null>(null);
  const [reasonCode, setReasonCode] = useState("price");
  const [competitorNotes, setCompetitorNotes] = useState("");
  const [overrideCode, setOverrideCode] = useState("verified-exception");
  const [overrideText, setOverrideText] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const trade = manual.trade || "generic";
  const isGeneric = trade === "generic";
  const showElecMech = trade === "electrical" || trade === "mechanical";
  const showRoof = trade === "roofing";
  const showCivil = trade === "civil";
  const showGc = trade === "gc";

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 space-y-1">

        <p className="text-xs font-semibold text-sky-950">How this score works</p>
        <p className="text-xs text-sky-900 leading-relaxed">{STARTUP_HONESTY_BANNER}</p>
      </div>
      {isGeneric && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-950">{GENERIC_TRADE_HONESTY_BANNER}</p>
        </div>
      )}

      <div className="space-y-3 rounded-lg border border-[#E2E8F0] p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">

          About this bid
        </p>
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">Trade</Label>
            <Select value={trade} onValueChange={(v) => setManual({ trade: v })}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BIDOS_OPTIONAL_TRADES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowDetail((v) => !v)}
          className="text-xs font-medium text-[#2563EB] hover:underline"
        >
          {showDetail ? "Hide detail" : "Add detail to sharpen your score (optional)"}
        </button>

        {showDetail && (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">

            <Label className="text-xs text-slate-600">How clear is the scope?</Label>
            <p className="text-[11px] text-slate-500 leading-snug">
              1 = vague drawings; 5 = fully defined and bid-ready.
            </p>
            <Select
              value={manual.scopeClarity || undefined}
              onValueChange={(v) => setManual({ scopeClarity: v })}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Pick 1–5" />
              </SelectTrigger>
              <SelectContent>
                {SCOPE_CLARITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <YnSelect
            id="escalation"

            label="Price escalation clause?"
            hint="Does the contract let you adjust price if materials rise?"
            value={manual.escalation}
            onChange={(v) => setManual({ escalation: v })}
          />
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs text-slate-600">Estimate hours to pursue (optional)</Label>
            <p className="text-[11px] text-slate-500 leading-snug">
              Rough time your team will spend to bid this job.
            </p>
            <Input
              type="number"
              min={0}
              className="h-9 max-w-[12rem]"
              value={manual.pursuitHours}
              onChange={(e) => setManual({ pursuitHours: e.target.value })}
              placeholder="e.g. 40"
            />
          </div>
          <div className="flex items-start gap-2 sm:col-span-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3">
            <Checkbox
              id="bonding"
              className="mt-0.5"
              checked={manual.bondingInfeasible}
              onCheckedChange={(c) => setManual({ bondingInfeasible: c === true })}
            />

            <div className="space-y-0.5">
              <Label htmlFor="bonding" className="text-xs text-slate-800 font-medium">
                We cannot bond this job at the required capacity
              </Label>
              <p className="text-[11px] text-slate-500 leading-snug">
                Check if bonding is not available or too low for this bid amount.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:col-span-2">
            <Checkbox
              id="scopeDocs"
              className="mt-0.5"
              checked={manual.hasScopeDocs}
              onCheckedChange={(c) => setManual({ hasScopeDocs: c === true })}
            />

            <Label htmlFor="scopeDocs" className="text-xs text-slate-700">
              Plans / specs uploaded
            </Label>
          </div>
          {Number(manual.scopeClarity) >= 4 && !manual.hasScopeDocs && (
            <div className="flex items-start gap-2 sm:col-span-2">
              <Checkbox
                id="secondRev"
                className="mt-0.5"
                checked={manual.secondReviewerConfirmed}
                onCheckedChange={(c) => setManual({ secondReviewerConfirmed: c === true })}
              />

              <div className="space-y-0.5">
                <Label htmlFor="secondRev" className="text-xs text-slate-700">
                  A second person reviewed this high scope score
                </Label>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Required before a strong go when documents are not attached.
                </p>
              </div>
            </div>
          )}
        </div>

        {showElecMech && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
            <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {trade === "electrical" ? "Electrical details" : "Mechanical / HVAC details"}
            </p>
            <YnSelect
              id="gear"

              label="Is long-lead equipment already ordered?"
              hint="Switchgear, HVAC units, or other materials with long ship times."
              value={manual.gearPreOrdered}
              onChange={(v) => setManual({ gearPreOrdered: v })}
            />
            <div className="space-y-1">

              <Label className="text-xs text-slate-600">How many days late could materials arrive?</Label>
              <p className="text-[11px] text-slate-500 leading-snug">
                Enter 0 if lead times fit the job schedule.
              </p>
              <Input
                type="number"
                className="h-9"
                value={manual.leadDaysOverSchedule}
                onChange={(e) => setManual({ leadDaysOverSchedule: e.target.value })}
                placeholder="0 if OK"
              />
            </div>
            <YnSelect
              id="bms"

              label="Is controls / BMS scope defined?"
              hint="Building management system or controls work is clear enough to price."
              value={manual.controlsBmsScope}
              onChange={(v) => setManual({ controlsBmsScope: v })}
            />
          </div>
        )}

        {showRoof && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
            <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Roofing details
            </p>
            <YnSelect
              id="occupied"
              label="Is the building occupied during the work?"
              value={manual.occupiedBuilding}
              onChange={(v) => setManual({ occupiedBuilding: v })}
            />
            <YnSelect
              id="leak"
              label="Is there an active leak right now?"
              value={manual.activeLeak}
              onChange={(v) => setManual({ activeLeak: v })}
            />
            <YnSelect
              id="deck"
              label="Do you know the deck condition?"
              hint="Substrate under the roof membrane — sound, wet, or needs repair."
              value={manual.deckConditionKnown}
              onChange={(v) => setManual({ deckConditionKnown: v })}
            />
          </div>
        )}

        {showCivil && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
            <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Civil / site details
            </p>
            <YnSelect
              id="permit"
              label="Is the permit already secured?"
              value={manual.permitSecured}
              onChange={(v) => setManual({ permitSecured: v })}
            />
            <YnSelect
              id="utility"
              label="Are utility conflicts known?"
              hint="Buried or overhead utilities that could clash with the work."
              value={manual.utilityConflictsKnown}
              onChange={(v) => setManual({ utilityConflictsKnown: v })}
            />
            <YnSelect
              id="earth"
              label="Is earthwork cut/fill balance known?"
              value={manual.earthworkBalanceKnown}
              onChange={(v) => setManual({ earthworkBalanceKnown: v })}
            />
          </div>
        )}

        {showGc && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
            <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              General contractor details
            </p>
            <YnSelect
              id="subcov"

              label="Subs lined up for the big trades?"
              hint="Do you have subcontractors lined up for the critical scopes?"
              value={manual.keySubCoverage}
              onChange={(v) => setManual({ keySubCoverage: v })}
            />
            <div className="space-y-1">

              <Label className="text-xs text-slate-600">Self-perform %</Label>
              <p className="text-[11px] text-slate-500 leading-snug">
                Share of work your own crews will do (0–100).
              </p>
              <Input
                type="number"
                min={0}
                max={100}
                className="h-9"
                value={manual.selfPerformPct}
                onChange={(e) => setManual({ selfPerformPct: e.target.value })}
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs text-slate-600">How deep is your subcontractor bench?</Label>
              <p className="text-[11px] text-slate-500 leading-snug">
                1 = few backups; 5 = many qualified alternatives if someone drops out.
              </p>
              <Select
                value={manual.subBenchDepth || undefined}
                onValueChange={(v) => setManual({ subBenchDepth: v })}
              >
                <SelectTrigger className="h-9 max-w-md">
                  <SelectValue placeholder="Pick 1–5" />
                </SelectTrigger>
                <SelectContent>
                  {SUB_BENCH_DEPTH_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        </>
        )}

        {canRun && (
          <Button type="button" onClick={onCompute} disabled={computing} className="bg-[#2563EB] hover:bg-[#1d4ed8] w-full sm:w-auto">
            {computing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {score ? "Re-score this bid" : "Score this bid"}
          </Button>
        )}
      </div>

      {!score ? (

        <p className="text-sm text-slate-600">
          No score yet. Hit “Score this bid” to see where it stands — you can add detail below to sharpen it, but it&apos;s not required.
        </p>
      ) : (
        <>
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Bid Score
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black tracking-widest border ${verdictStyle(score.verdict)}`}>
                {goNoGoLabel(score.verdict).label}
              </span>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold border ${verdictStyle(score.verdict)}`}>
                {score.verdict}
              </span>
              <span className="text-2xl font-bold text-slate-900">{Math.round(score.totalScore)}/100</span>
              {score.manualHeavyVerify && (
                <Badge className="bg-amber-100 text-amber-950 border border-amber-300 gap-1">
                  <ShieldAlert className="w-3 h-3" /> Needs a second person to verify
                </Badge>
              )}
              {score.lockedAt && (
                <Badge variant="outline" className="gap-1 text-slate-700">
                  <Lock className="w-3 h-3" /> Locked {new Date(score.lockedAt).toLocaleDateString()}
                </Badge>
              )}
              {score.humanReviewed ? (
                <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Reviewer approved
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 text-amber-800 border-amber-300">
                  <Lock className="w-3 h-3" /> Pending human review
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-2">{goNoGoLabel(score.verdict).action}</p>
            {(score.honestyLabel || score.explanation?.honestyLabel || score.disclaimer) && (
              <p className="text-xs text-slate-500 mt-2">
                {score.honestyLabel || score.explanation?.honestyLabel || score.disclaimer}
              </p>
            )}
          </div>

          {score.explanation && (
            <div className="space-y-2 rounded-lg border border-[#E2E8F0] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Top drivers</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="font-semibold text-emerald-800 mb-1">Lift</p>
                  <ul className="space-y-1 text-slate-700">
                    {score.explanation.topPositive.map((d) => (
                      <li key={`p-${d.key}`}>
                        {d.label}
                        {d.citation ? (
                          <span className="block text-[10px] text-slate-500 truncate">{d.citation}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-rose-800 mb-1">Drag</p>
                  <ul className="space-y-1 text-slate-700">
                    {score.explanation.topNegative.map((d) => (
                      <li key={`n-${d.key}`}>{d.label}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {score.marketAnchors && (
            <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
              {score.marketAnchors.label}
            </p>
          )}

          {score.pursuitRoi && (
            <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {score.pursuitRoi.roiLabel || "Pursuit ROI"}
              </p>
              <p className="text-sm font-semibold text-slate-900">{score.pursuitRoi.summary}</p>
              <p className="text-xs text-slate-600">
                Recommendation: {score.pursuitRoi.recommendation}
              </p>
              <p className="text-xs text-slate-500">
                {score.pursuitRoi.awardOddsLabel ||
                  (score.pursuitRoi.winLikelihoodBasis === "calibrated-outcomes"
                    ? "Based on past outcomes (separate from the ROI note above) — still not a win percentage"
                    : "Win percentage not available yet — this index is relative bid quality only")}
              </p>
            </div>
          )}

          <div className="space-y-2">
            {score.categories.map((c) => (
              <div key={c.key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 font-medium">{c.label}</span>
                  <span className="text-slate-500">
                    {c.points}/{c.maxPoints}
                  </span>
                </div>
                <Progress value={(c.points / c.maxPoints) * 100} className="h-1.5" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pass / fail gates</p>
            {score.gates.map((g) => (
              <div key={g.id} className={`text-sm flex items-start gap-2 ${g.passed ? "text-emerald-800" : "text-rose-800"}`}>
                {g.passed ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
                {g.message}
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 border-t border-[#E2E8F0] pt-3">
            {AI_REVIEW_LABEL}
            {!score.humanReviewed && " — pending admin approval before client-facing use."}
          </p>

          <div className="flex flex-wrap gap-2">
            {canApprove && !score.humanReviewed && (
              <Button type="button" onClick={onApprove} disabled={approving} className="bg-teal-700 hover:bg-teal-600">
                {approving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                Mark reviewed
              </Button>
            )}
            {canRun && score.humanReviewed && (
              <Button type="button" variant="outline" onClick={onLock} disabled={locking}>
                {locking ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                Lock score for submission
              </Button>
            )}
          </div>
          {canRun && score.humanReviewed && (
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E2E8F0]">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Outcome autopsy</p>
              <div className="flex flex-wrap gap-2">
                {(["won", "lost", "no-bid"] as const).map((o) => (
                  <Button
                    key={o}
                    type="button"
                    size="sm"
                    variant={autopsyOutcome === o ? "default" : "outline"}
                    disabled={recordingOutcome}
                    onClick={() => setAutopsyOutcome(o)}
                  >
                    {o === "no-bid" ? "No-bid" : o === "won" ? "Won" : "Lost"}
                  </Button>
                ))}
              </div>
              {autopsyOutcome && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Reason code (6 locked)</Label>
                    <select
                      className="h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-sm"
                      value={reasonCode}
                      onChange={(e) => setReasonCode(e.target.value)}
                    >
                      <option value="price">Price / margin</option>
                      <option value="schedule">Schedule / timeline</option>
                      <option value="relationship_incumbent">Relationship / incumbent</option>
                      <option value="scope_qualification">Scope / qualification</option>
                      <option value="compliance_eligibility">Compliance / eligibility</option>
                      <option value="other">Other (note required)</option>
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs text-slate-600">
                      {reasonCode === "other" ? "Note (required for Other)" : "Competitor notes (optional)"}
                    </Label>
                    <Input
                      className="h-9"
                      value={competitorNotes}
                      onChange={(e) => setCompetitorNotes(e.target.value)}
                      placeholder={
                        reasonCode === "other"
                          ? "One-line note required for Other"
                          : "Optional — who won / why"
                      }
                      maxLength={500}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="sm:col-span-2 bg-teal-700 hover:bg-teal-600"
                    disabled={
                      recordingOutcome || (reasonCode === "other" && !competitorNotes.trim())
                    }
                    onClick={() =>
                      onOutcome({
                        outcome: autopsyOutcome,
                        reasonCodes: [reasonCode],
                        competitorNotes: competitorNotes || undefined,
                      })
                    }
                  >
                    {recordingOutcome ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save autopsy
                  </Button>
                </div>
              )}
            </div>
          )}

          {canOverride && score && (
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E2E8F0]">

              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Override history</p>
              {journal && journal.length > 0 ? (
                <ul className="text-xs text-slate-600 space-y-1 max-h-28 overflow-auto">
                  {journal.map((j) => (
                    <li key={j.id}>
                      {j.createdAt.slice(0, 10)} · {j.reasonCode}
                      {j.fromVerdict && j.toVerdict ? ` · ${j.fromVerdict}→${j.toVerdict}` : ""}
                      {j.reasonText ? ` — ${j.reasonText}` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">No overrides recorded.</p>
              )}
              <div className="flex flex-wrap gap-2 items-end">
                <select
                  className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm"
                  value={overrideCode}
                  onChange={(e) => setOverrideCode(e.target.value)}
                >
                  <option value="client-relationship">Client relationship</option>
                  <option value="strategic-loss-leader">Strategic loss-leader</option>
                  <option value="verified-exception">Verified exception</option>
                  <option value="data-corrected">Data corrected</option>
                  <option value="other">Other</option>
                </select>
                <Input
                  className="h-9 flex-1 min-w-[140px]"
                  value={overrideText}
                  onChange={(e) => setOverrideText(e.target.value)}
                  placeholder="Optional note"
                  maxLength={500}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={overriding || !onOverride}
                  onClick={() => onOverride?.({ reasonCode: overrideCode, reasonText: overrideText || undefined })}
                >
                  {overriding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Record override"}
                </Button>
              </div>
              {score.manualHeavyVerify && onSecondReviewer && (
                <Button type="button" size="sm" variant="secondary" disabled={confirmingReviewer} onClick={onSecondReviewer}>
                  {confirmingReviewer ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Confirm second reviewer
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

type Props =
  | { mode: "state"; location: string; live?: boolean }
  | { mode: "bid"; bidId: string; location: string; live: boolean };

export function BidIntelligencePanel(props: Props) {
  const { toast } = useToast();
  const { user } = useAuth();
  const canApprove = user?.role === "owner";
  const canOverride = user?.role === "owner" || user?.role === "admin";
  const stateCode = useMemo(
    () => parseStateFromLocation(props.mode === "state" ? props.location : props.location),
    [props.location, props.mode],
  );

  const byState = useComplianceEligibilityByState(stateCode, props.mode === "state" && !!stateCode);
  const byBid = useComplianceEligibility(props.mode === "bid" ? props.bidId : undefined, props.mode === "bid" && props.live);
  const eligibility = props.mode === "bid" ? byBid.data?.eligibility : byState.data?.eligibility;
  const eligibilityLoading = props.mode === "bid" ? byBid.isLoading : byState.isLoading;

  const bidId = props.mode === "bid" ? props.bidId : undefined;
  const live = props.mode === "bid" ? props.live : false;
  const { data: scoreData, isLoading: scoreLoading } = useBidScore(bidId, live);
  const { data: journalData } = useOverrideJournal(bidId, live);
  const computeScore = useComputeBidScore();
  const approveScore = useApproveBidScore();
  const lockScore = useLockBidScore();
  const recordOutcome = useRecordBidOutcome();
  const recordOverride = useRecordScoreOverride();
  const confirmSecond = useConfirmSecondReviewer();

  const [manual, setManualState] = useState<ManualFields>(DEFAULT_MANUAL);
  const setManual = (patch: Partial<ManualFields>) => setManualState((prev) => ({ ...prev, ...patch }));

  const handleCompute = async () => {
    if (!bidId) return;
    try {
      const body = buildScoreBody(manual);
      await computeScore.mutateAsync({ bidId, body });
      toast({
        title: "Bid score ready",

        description: "Score saved — awaiting reviewer approval. This is not a win percentage.",
      });
    } catch (e) {
      toast({
        title: "Scoring failed",
        description: e instanceof Error ? e.message : "Could not compute score",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async () => {
    if (!bidId) return;
    try {
      await approveScore.mutateAsync(bidId);
      toast({ title: "Approved", description: "Score marked human-reviewed for client-facing use." });
    } catch (e) {
      toast({
        title: "Approval failed",
        description: e instanceof Error ? e.message : "Could not approve score",
        variant: "destructive",
      });
    }
  };

  const handleLock = async () => {
    if (!bidId) return;
    try {
      await lockScore.mutateAsync(bidId);
      toast({ title: "Score locked", description: "Snapshot locked for submission / Zoho sync when enabled." });
    } catch (e) {
      toast({
        title: "Lock failed",
        description: e instanceof Error ? e.message : "Could not lock score",
        variant: "destructive",
      });
    }
  };

  const handleOutcome = async (payload: {
    outcome: "won" | "lost" | "no-bid";
    reasonCodes?: string[];
    competitorNotes?: string;
  }) => {
    if (!bidId) return;
    try {
      await recordOutcome.mutateAsync({
        bidId,
        outcome: payload.outcome,
        reasonCodes: payload.reasonCodes as AutopsyReasonCode[] | undefined,
        competitorNotes: payload.competitorNotes,
        trade: manual.trade || undefined,
        scoredSnapshotId: scoreData?.score?.id,
      });
      toast({ title: "Autopsy saved", description: `Bid marked ${payload.outcome}.` });
    } catch (e) {
      toast({
        title: "Outcome failed",
        description: e instanceof Error ? e.message : "Could not record outcome",
        variant: "destructive",
      });
    }
  };

  const handleOverride = async (payload: { reasonCode: string; reasonText?: string }) => {
    if (!bidId) return;
    try {
      await recordOverride.mutateAsync({
        bidId,
        reasonCode: payload.reasonCode as OverrideReasonCode,
        reasonText: payload.reasonText,
        fromVerdict: scoreData?.score?.verdict,
        scoreId: scoreData?.score?.id,
      });
      toast({ title: "Override recorded", description: "Append-only journal updated." });
    } catch (e) {
      toast({
        title: "Override failed",
        description: e instanceof Error ? e.message : "Could not record override",
        variant: "destructive",
      });
    }
  };

  const handleSecondReviewer = async () => {
    if (!bidId) return;
    try {
      await confirmSecond.mutateAsync({ bidId, scoreId: scoreData?.score?.id });
      toast({ title: "Second reviewer confirmed", description: "Timestamp recorded on score snapshot." });
    } catch (e) {
      toast({
        title: "Confirmation failed",
        description: e instanceof Error ? e.message : "Could not confirm second reviewer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-[#E2E8F0] shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            Compliance Eligibility
          </CardTitle>
          <CardDescription>Research Hub export-ready rules for the bid state.</CardDescription>
        </CardHeader>
        <CardContent>
          {!stateCode ? (
            <p className="text-sm text-slate-500">Add location with state (e.g. Birmingham, AL) to load jurisdiction rules.</p>
          ) : (
            <ComplianceBody eligibility={eligibility} loading={eligibilityLoading} />
          )}
        </CardContent>
      </Card>

      {props.mode === "bid" && (
        <Card className="border-[#E2E8F0] shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Bid Score
            </CardTitle>
            <CardDescription className="space-y-2">
              <span className="block">

                Strong Go / Conditional / Executive Review / No-Go — a relative read on this job, not a win percentage. A human reviews every score before client use.
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {AI_REVIEW_LABEL}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!live ? (
              <p className="text-sm text-slate-500">Sign in to compute and persist live bid scores.</p>
            ) : scoreLoading ? (
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading score…
              </p>
            ) : (
              <ScoreBody
                score={scoreData?.score}
                manual={manual}
                setManual={setManual}
                onCompute={handleCompute}
                onApprove={handleApprove}
                onLock={handleLock}
                onOutcome={handleOutcome}
                onOverride={handleOverride}
                onSecondReviewer={handleSecondReviewer}
                journal={journalData?.journal}
                computing={computeScore.isPending}
                approving={approveScore.isPending}
                locking={lockScore.isPending}
                recordingOutcome={recordOutcome.isPending}
                overriding={recordOverride.isPending}
                confirmingReviewer={confirmSecond.isPending}
                canRun={live && !!bidId}
                canApprove={canApprove}
                canOverride={canOverride}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
