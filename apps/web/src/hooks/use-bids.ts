import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Bid } from "@core/data";
import { seedBids } from "@core/data";
import { apiFetch } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { useLiveData } from "@/lib/data-mode";

export function useBids() {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);

  return useQuery({
    queryKey: ["bids", live ? "live" : "demo"],
    queryFn: async (): Promise<Bid[]> => {
      if (!live) return seedBids;
      const data = await apiFetch<{ bids: Bid[] }>("/api/v1/bids");
      return data.bids as Bid[];
    },
  });
}

export function useBid(id: string | undefined) {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);

  return useQuery({
    queryKey: ["bid", id, live ? "live" : "demo"],
    enabled: !!id,
    queryFn: async (): Promise<Bid | undefined> => {
      if (!id) return undefined;
      if (!live) return seedBids.find((b) => b.id === id);
      const data = await apiFetch<{ bid: Bid }>(`/api/v1/bids/${id}`);
      return data.bid as Bid;
    },
  });
}

export function useCreateBid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiFetch<{ bid: Bid }>("/api/v1/bids", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bids"] }),
  });
}

export function useUpdateBid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Record<string, unknown>) =>
      apiFetch<{ bid: Bid }>(`/api/v1/bids/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["bids"] });
      qc.invalidateQueries({ queryKey: ["bid", vars.id] });
    },
  });
}

export function useRequestScopeAnalysis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { bidId: string; scopeSummary?: string }) =>
      apiFetch("/api/v1/intelligence/scope-analysis", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["bid", vars.bidId] });
      qc.invalidateQueries({ queryKey: ["bids"] });
    },
  });
}

export function useVoiceHandoff() {
  return useMutation({
    mutationFn: (body: { transcript: string; bidId?: string; createBid?: boolean }) =>
      apiFetch("/api/v1/intelligence/voice-connect/handoff", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  });
}

export function useRoseOsSummary() {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);

  return useQuery({
    queryKey: ["roseos-summary", live ? "live" : "demo"],
    queryFn: async () => {
      if (!live) return null;
      return apiFetch<{
        verdict: string;
        roseBrain?: boolean;
        executiveBrief?: { headline: string; narrative: string; priorities: string[]; engine: string };
        stats: { activeBids: number; overdueFollowUps: number; totalBids: number; pendingHumanReview?: number };
        insights: {
          id: string;
          section?: string;
          title: string;
          verdict: string;
          subject?: string;
          rationale?: string;
          summary?: string;
          recommendation?: string;
          sourceModule?: string;
          sourceSignal?: string;
          confidence?: string;
          detectedAgo?: string;
          href?: string;
          humanReviewed?: boolean;
        }[];
      }>("/api/v1/intelligence/roseos/summary");
    },
    enabled: live,
  });
}

export type ResearchExportReadyRow = {
  id?: string;
  ccaRfCode?: string;
  stateCode?: string;
  riskFactorNumber?: string;
  status?: string;
  workflowStage?: string;
  teamValidationMethod?: string;
  ownerName?: string;
  humanApproved?: boolean;
  updatedAt?: string;
};

export type ResearchExportReadyPreview = {
  ok: boolean;
  configured: boolean;
  source?: string;
  state?: string | null;
  total: number;
  count: number;
  note?: string;
  byState?: Record<string, number>;
  rows: ResearchExportReadyRow[];
  reason?: string;
};

export function useResearchExportReadyPreview(state = "FL", limit = 8, enabled = true) {
  return useQuery({
    queryKey: ["research-export-ready", state, limit],
    enabled,
    queryFn: () =>
      apiFetch<ResearchExportReadyPreview>(
        `/api/v1/research/export-ready?state=${encodeURIComponent(state)}&limit=${limit}`,
      ),
    staleTime: 60_000,
  });
}

export type ComplianceEligibility = {
  stateCode: string | null;
  exportReadyCount: number;
  eligibilityPoints: number;
  maxPoints: number;
  flags: string[];
  fixBeforeBidding: string[];
  sampleRules: { ccaRfCode: string; status: string; humanApproved: boolean }[];
  researchConnected: boolean;
  auditConnected: boolean;
  auditId?: number;
  auditCode?: string;
  auditFinalStatus?: string;
  criticalTriggers: { key: string; label: string; cleared: boolean }[];
  note: string;
};

export type BidScoreCategory = {
  key: string;
  label: string;
  points: number;
  maxPoints: number;
  source: string;
};

export type BidScoreExplanation = {
  headline: string;
  rationale: string;
  honestyLabel: string;
  totalScore: number;
  verdict: string;
  topPositive: { key: string; label: string; contribution: number; citation?: string }[];
  topNegative: { key: string; label: string; contribution: number; citation?: string }[];
  levers: { signal: string; action: string; projectedGain: number; flipsBand: boolean }[];
};

export type BidScoreSnapshot = {
  id?: string;
  bidId?: string;
  totalScore: number;
  maxScore?: number;
  verdict: string;
  categories: BidScoreCategory[];
  gates: { id: string; passed: boolean; message: string }[];
  compliance?: ComplianceEligibility;
  aiGenerated: boolean;
  humanReviewed: boolean;
  disclaimer?: string;
  lockedAt?: string;
  createdAt?: string;
  honestyLabel?: string;
  explanation?: BidScoreExplanation;
  pursuitRoi?: {
    recommendation: string;
    roiRatio: number;
    winLikelihoodBasis: string;
    assumptions: string[];
    summary: string;
  };
  evidenceCitations?: string[];
  manualHeavyVerify?: boolean;
};

export type ComputeBidScoreBody = {
  trade?: string;
  mode?: "startup" | "learning";
  signals?: Record<string, number | null>;
  roseGates?: Record<string, boolean | string[] | undefined>;
  pursuitHours?: number;
};

export function useComplianceEligibilityByState(state: string | null, enabled = true) {
  return useQuery({
    queryKey: ["compliance-eligibility", state],
    enabled: enabled && !!state,
    queryFn: () =>
      apiFetch<{ eligibility: ComplianceEligibility }>(
        `/api/v1/research/compliance-eligibility?state=${encodeURIComponent(state!)}`,
      ),
    staleTime: 60_000,
  });
}

export function useComplianceEligibility(bidId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["bid-compliance", bidId],
    enabled: enabled && !!bidId,
    queryFn: () =>
      apiFetch<{ eligibility: ComplianceEligibility }>(`/api/v1/bids/${bidId}/compliance-eligibility`),
    staleTime: 60_000,
  });
}

export function useBidScore(bidId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["bid-score", bidId],
    enabled: enabled && !!bidId,
    queryFn: () => apiFetch<{ score: BidScoreSnapshot | null }>(`/api/v1/bids/${bidId}/score`),
  });
}

export function useComputeBidScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bidId, body }: { bidId: string; body?: ComputeBidScoreBody }) =>
      apiFetch<{ score: BidScoreSnapshot }>(`/api/v1/bids/${bidId}/score`, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
      }),
    onSuccess: (_d, { bidId }) => {
      qc.invalidateQueries({ queryKey: ["bid-score", bidId] });
      qc.invalidateQueries({ queryKey: ["bid", bidId] });
      qc.invalidateQueries({ queryKey: ["bids"] });
      qc.invalidateQueries({ queryKey: ["win-loss-analytics"] });
    },
  });
}

export function useApproveBidScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) =>
      apiFetch<{ ok: boolean; humanReviewed: boolean }>(`/api/v1/bids/${bidId}/score/approve`, {
        method: "POST",
      }),
    onSuccess: (_d, bidId) => {
      qc.invalidateQueries({ queryKey: ["bid-score", bidId] });
      qc.invalidateQueries({ queryKey: ["bid", bidId] });
    },
  });
}

export function useLockBidScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) =>
      apiFetch<{ ok: boolean; lockedAt: string }>(`/api/v1/bids/${bidId}/score/lock`, {
        method: "PUT",
      }),
    onSuccess: (_d, bidId) => {
      qc.invalidateQueries({ queryKey: ["bid-score", bidId] });
      qc.invalidateQueries({ queryKey: ["bid", bidId] });
    },
  });
}

export type AutopsyReasonCode =
  | "price"
  | "relationship"
  | "capacity"
  | "scope"
  | "schedule"
  | "competitor-strength"
  | "compliance"
  | "strategic-no-bid"
  | "other";

export type RecordOutcomeBody = {
  bidId: string;
  outcome: "won" | "lost" | "no-bid";
  reason?: string;
  reasonCodes?: AutopsyReasonCode[];
  competitorNotes?: string;
  trade?: string;
  scoredSnapshotId?: string;
};

export type TradeOutcomeStats = {
  trade: string;
  outcomeCount: number;
  won: number;
  lost: number;
  noBid: number;
  pastPerfWinrate: number | null;
  learningEligible: boolean;
};

export type OverrideReasonCode =
  | "client-relationship"
  | "strategic-loss-leader"
  | "verified-exception"
  | "data-corrected"
  | "other";

export type OverrideJournalEntry = {
  id: string;
  bidId: string;
  reasonCode: string;
  reasonText?: string;
  fromVerdict?: string;
  toVerdict?: string;
  gateId?: string;
  userId: string;
  overrideRole: string;
  createdAt: string;
};

export function useRecordBidOutcome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bidId, ...body }: RecordOutcomeBody) =>
      apiFetch<{ bid: Bid; autopsy: unknown; tradeStats: TradeOutcomeStats }>(
        `/api/v1/bids/${bidId}/outcome`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      ),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["bids"] });
      qc.invalidateQueries({ queryKey: ["bid", vars.bidId] });
      qc.invalidateQueries({ queryKey: ["roseos-summary"] });
      qc.invalidateQueries({ queryKey: ["win-loss-analytics"] });
      qc.invalidateQueries({ queryKey: ["bid-autopsy", vars.bidId] });
      qc.invalidateQueries({ queryKey: ["learning-status", vars.bidId] });
    },
  });
}

export function useOverrideJournal(bidId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["score-overrides", bidId],
    enabled: enabled && !!bidId,
    queryFn: () =>
      apiFetch<{ journal: OverrideJournalEntry[] }>(`/api/v1/bids/${bidId}/score/overrides`),
  });
}

export function useRecordScoreOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      bidId,
      ...body
    }: {
      bidId: string;
      reasonCode: OverrideReasonCode;
      reasonText?: string;
      fromVerdict?: string;
      toVerdict?: string;
      gateId?: string;
      scoreId?: string;
    }) =>
      apiFetch<{ entry: OverrideJournalEntry }>(`/api/v1/bids/${bidId}/score/override`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["score-overrides", vars.bidId] });
    },
  });
}

export function useConfirmSecondReviewer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bidId, scoreId }: { bidId: string; scoreId?: string }) =>
      apiFetch<{ ok: boolean; secondReviewerUserId: string; secondReviewerAt: string }>(
        `/api/v1/bids/${bidId}/score/second-reviewer`,
        {
          method: "POST",
          body: JSON.stringify(scoreId ? { scoreId } : {}),
        },
      ),
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["bid-score", vars.bidId] });
    },
  });
}

export type WinLossOutcomeBucket = {
  outcome: "won" | "lost" | "no-bid" | "pending";
  count: number;
  totalValue: number;
  avgTotalScore: number | null;
  verdictBreakdown: Record<string, number>;
  avgCategoryScores: { key: string; label: string; points: number; maxPoints: number }[];
};

export type WinLossAnalytics = {
  summary: {
    totalBids: number;
    decided: number;
    winRate: number | null;
    scoredBids: number;
  };
  byOutcome: WinLossOutcomeBucket[];
};

export function useWinLossAnalytics() {
  const { isAuthenticated } = useAuth();
  const live = useLiveData(isAuthenticated);

  return useQuery({
    queryKey: ["win-loss-analytics", live ? "live" : "demo"],
    enabled: live,
    queryFn: () => apiFetch<WinLossAnalytics>("/api/v1/bids/analytics/win-loss"),
    staleTime: 60_000,
  });
}

export type ScopeAnalysisPayload = {
  projectName: string;
  deliverables: string;
  timeline: string;
  complexityIndicator: { title: string; detail: string };
  rfis: { title: string; detail: string; severity: string }[];
  risks: { label: string; level: string; score: number; detail: string }[];
  scopeItems: string[];
  roseVerdict: "green" | "yellow" | "red";
  roseNarrative: string;
  recommendedActions: string[];
  requiredForms: string[];
  engine: string;
  disclaimer: string;
};

export type ScopeAnalysisRecord = {
  id: string;
  bidId: string;
  status: string;
  summary?: string;
  payload: ScopeAnalysisPayload;
  aiGenerated: boolean;
  humanReviewed: boolean;
  createdAt: string;
};

export function useScopeAnalysis(bidId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["scope-analysis", bidId],
    enabled: enabled && !!bidId,
    queryFn: () =>
      apiFetch<{ analysis: ScopeAnalysisRecord | null }>(`/api/v1/intelligence/scope-analysis/${bidId}`),
  });
}

export function useApproveScopeAnalysis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) =>
      apiFetch<{ ok: boolean }>(`/api/v1/intelligence/scope-analysis/${bidId}/approve`, { method: "POST" }),
    onSuccess: (_d, bidId) => {
      qc.invalidateQueries({ queryKey: ["scope-analysis", bidId] });
      qc.invalidateQueries({ queryKey: ["bid", bidId] });
      qc.invalidateQueries({ queryKey: ["roseos-summary"] });
    },
  });
}
