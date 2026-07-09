import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
} from "@/hooks/use-bids";
import { Loader2, ShieldCheck, ShieldAlert, Lock, CheckCircle2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";

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
  if (!score) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">No score snapshot yet. Run scoring after location and bid fields are set.</p>
        {canRun && (
          <Button type="button" onClick={onCompute} disabled={computing} className="bg-[#2563EB] hover:bg-[#1d4ed8]">
            {computing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Compute bid score
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Go / No-Go decision</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black tracking-widest border ${verdictStyle(score.verdict)}`}>
            {goNoGoLabel(score.verdict).label}
          </span>
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold border ${verdictStyle(score.verdict)}`}>
            {score.verdict}
          </span>
          <span className="text-2xl font-bold text-slate-900">{Math.round(score.totalScore)}/100</span>
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
      </div>

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
        {canRun && (
          <Button type="button" variant="outline" onClick={onCompute} disabled={computing}>
            {computing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Recompute score
          </Button>
        )}
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

  const handleCompute = async () => {
    if (!bidId) return;
    try {
      await computeScore.mutateAsync(bidId);
      toast({ title: "Score computed", description: "Snapshot locked — awaiting reviewer approval." });
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
              Bid Intelligence Score
            </CardTitle>
            <CardDescription className="space-y-2">
              <span className="block">12-category model — Strong Go / Conditional Go / Executive Review / No-Go.</span>
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
