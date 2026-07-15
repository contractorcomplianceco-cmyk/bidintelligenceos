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
  useLockBidScore,
  useRecordBidOutcome,
  type BidScoreSnapshot,
  type ComplianceEligibility,
  type ComputeBidScoreBody,
} from "@/hooks/use-bids";
import { Loader2, ShieldCheck, ShieldAlert, Lock, CheckCircle2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import {
  BIDOS_OPTIONAL_TRADES,
  GENERIC_TRADE_HONESTY_BANNER,
  STARTUP_HONESTY_BANNER,
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
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: "" | "yes" | "no";
  onChange: (v: "" | "yes" | "no") => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs text-slate-600">
        {label}
      </Label>
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
  computing,
  approving,
  locking,
  recordingOutcome,
  canRun,
  canApprove,
}: {
  score?: BidScoreSnapshot | null;
  manual: ManualFields;
  setManual: (patch: Partial<ManualFields>) => void;
  onCompute: () => void;
  onApprove: () => void;
  onLock: () => void;
  onOutcome: (outcome: "won" | "lost" | "no-bid") => void;
  computing?: boolean;
  approving?: boolean;
  locking?: boolean;
  recordingOutcome?: boolean;
  canRun: boolean;
  canApprove: boolean;
}) {
  const trade = manual.trade || "generic";
  const isGeneric = trade === "generic";
  const showElecMech = trade === "electrical" || trade === "mechanical";
  const showRoof = trade === "roofing";
  const showCivil = trade === "civil";
  const showGc = trade === "gc";

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-sky-200 bg-sky-50 p-3 space-y-1">
        <p className="text-xs font-semibold text-sky-950">Startup mode</p>
        <p className="text-xs text-sky-900">{STARTUP_HONESTY_BANNER}</p>
      </div>
      {isGeneric && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-950">{GENERIC_TRADE_HONESTY_BANNER}</p>
        </div>
      )}

      <div className="space-y-3 rounded-lg border border-[#E2E8F0] p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Pursuit inputs (G5)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-xs text-slate-600">Trade</Label>
            <Select value={trade} onValueChange={(v) => setManual({ trade: v })}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BIDOS_OPTIONAL_TRADES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label}
                    {t.status === "fallback" ? " (fallback)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">Scope clarity (1–5, subjective)</Label>
            <Select
              value={manual.scopeClarity || undefined}
              onValueChange={(v) => setManual({ scopeClarity: v })}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Required for best score" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <YnSelect
            id="escalation"
            label="Escalation clause"
            value={manual.escalation}
            onChange={(v) => setManual({ escalation: v })}
          />
          <div className="space-y-1">
            <Label className="text-xs text-slate-600">Pursuit hours (optional)</Label>
            <Input
              type="number"
              min={0}
              className="h-9"
              value={manual.pursuitHours}
              onChange={(e) => setManual({ pursuitHours: e.target.value })}
              placeholder="e.g. 40"
            />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <Checkbox
              id="bonding"
              checked={manual.bondingInfeasible}
              onCheckedChange={(c) => setManual({ bondingInfeasible: c === true })}
            />
            <Label htmlFor="bonding" className="text-xs text-slate-700">
              Bonding capacity infeasible for this bid
            </Label>
          </div>
          <div className="flex items-center gap-2 pt-5">
            <Checkbox
              id="scopeDocs"
              checked={manual.hasScopeDocs}
              onCheckedChange={(c) => setManual({ hasScopeDocs: c === true })}
            />
            <Label htmlFor="scopeDocs" className="text-xs text-slate-700">
              Scope docs / checklist attached
            </Label>
          </div>
          {Number(manual.scopeClarity) >= 4 && !manual.hasScopeDocs && (
            <div className="flex items-center gap-2 sm:col-span-2">
              <Checkbox
                id="secondRev"
                checked={manual.secondReviewerConfirmed}
                onCheckedChange={(c) => setManual({ secondReviewerConfirmed: c === true })}
              />
              <Label htmlFor="secondRev" className="text-xs text-slate-700">
                Second reviewer confirmed (required for manual-heavy Strong Go)
              </Label>
            </div>
          )}
        </div>

        {showElecMech && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
            <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {trade === "electrical" ? "Electrical" : "Mechanical"} extras
            </p>
            <YnSelect
              id="gear"
              label="Gear / equipment pre-ordered"
              value={manual.gearPreOrdered}
              onChange={(v) => setManual({ gearPreOrdered: v })}
            />
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Lead-time vs schedule (days over)</Label>
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
              label="Controls / BMS scope known"
              value={manual.controlsBmsScope}
              onChange={(v) => setManual({ controlsBmsScope: v })}
            />
          </div>
        )}

        {showRoof && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
            <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Roofing extras
            </p>
            <YnSelect
              id="occupied"
              label="Occupied building"
              value={manual.occupiedBuilding}
              onChange={(v) => setManual({ occupiedBuilding: v })}
            />
            <YnSelect
              id="leak"
              label="Active leak"
              value={manual.activeLeak}
              onChange={(v) => setManual({ activeLeak: v })}
            />
            <YnSelect
              id="deck"
              label="Deck condition known"
              value={manual.deckConditionKnown}
              onChange={(v) => setManual({ deckConditionKnown: v })}
            />
          </div>
        )}

        {showCivil && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
            <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Civil extras
            </p>
            <YnSelect
              id="permit"
              label="Permit secured"
              value={manual.permitSecured}
              onChange={(v) => setManual({ permitSecured: v })}
            />
            <YnSelect
              id="utility"
              label="Utility conflicts known"
              value={manual.utilityConflictsKnown}
              onChange={(v) => setManual({ utilityConflictsKnown: v })}
            />
            <YnSelect
              id="earth"
              label="Earthwork balance known"
              value={manual.earthworkBalanceKnown}
              onChange={(v) => setManual({ earthworkBalanceKnown: v })}
            />
          </div>
        )}

        {showGc && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E2E8F0]">
            <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              GC extras
            </p>
            <YnSelect
              id="subcov"
              label="Key-sub coverage"
              value={manual.keySubCoverage}
              onChange={(v) => setManual({ keySubCoverage: v })}
            />
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Self-perform %</Label>
              <Input
                type="number"
                min={0}
                max={100}
                className="h-9"
                value={manual.selfPerformPct}
                onChange={(e) => setManual({ selfPerformPct: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-600">Sub-bench depth (1–5)</Label>
              <Select
                value={manual.subBenchDepth || undefined}
                onValueChange={(v) => setManual({ subBenchDepth: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {canRun && (
          <Button type="button" onClick={onCompute} disabled={computing} className="bg-[#2563EB] hover:bg-[#1d4ed8] w-full sm:w-auto">
            {computing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {score ? "Recompute Pursuit Confidence Index" : "Compute Pursuit Confidence Index"}
          </Button>
        )}
      </div>

      {!score ? (
        <p className="text-sm text-slate-600">No score snapshot yet. Set trade + scope clarity, then compute.</p>
      ) : (
        <>
          <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Pursuit Confidence Index
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
                  <ShieldAlert className="w-3 h-3" /> Manual-heavy — verify / second reviewer
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

          {score.pursuitRoi && (
            <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pursuit ROI (stub)</p>
              <p className="text-sm font-semibold text-slate-900">{score.pursuitRoi.summary}</p>
              <p className="text-xs text-slate-600">
                Recommendation: {score.pursuitRoi.recommendation} · basis: {score.pursuitRoi.winLikelihoodBasis}
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
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E2E8F0]">
              <p className="w-full text-xs font-bold uppercase tracking-wider text-slate-500">Record outcome (Bid DNA)</p>
              <Button type="button" size="sm" variant="outline" disabled={recordingOutcome} onClick={() => onOutcome("won")}>
                Won
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={recordingOutcome} onClick={() => onOutcome("lost")}>
                Lost
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={recordingOutcome} onClick={() => onOutcome("no-bid")}>
                No-bid
              </Button>
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
  const computeScore = useComputeBidScore();
  const approveScore = useApproveBidScore();
  const lockScore = useLockBidScore();
  const recordOutcome = useRecordBidOutcome();

  const [manual, setManualState] = useState<ManualFields>(DEFAULT_MANUAL);
  const setManual = (patch: Partial<ManualFields>) => setManualState((prev) => ({ ...prev, ...patch }));

  const handleCompute = async () => {
    if (!bidId) return;
    try {
      const body = buildScoreBody(manual);
      await computeScore.mutateAsync({ bidId, body });
      toast({
        title: "Pursuit Confidence Index computed",
        description: "Snapshot locked — awaiting reviewer approval. Not a win probability.",
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

  const handleOutcome = async (outcome: "won" | "lost" | "no-bid") => {
    if (!bidId) return;
    try {
      await recordOutcome.mutateAsync({ bidId, outcome });
      toast({ title: "Outcome recorded", description: `Bid marked ${outcome}.` });
    } catch (e) {
      toast({
        title: "Outcome failed",
        description: e instanceof Error ? e.message : "Could not record outcome",
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
              Pursuit Confidence Index
            </CardTitle>
            <CardDescription className="space-y-2">
              <span className="block">
                Rose trade-conditional model — Strong Go / Conditional / Executive Review / No-Go. Not win probability.
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
                computing={computeScore.isPending}
                approving={approveScore.isPending}
                locking={lockScore.isPending}
                recordingOutcome={recordOutcome.isPending}
                canRun={live && !!bidId}
                canApprove={canApprove}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
