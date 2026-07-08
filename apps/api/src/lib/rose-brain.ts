/** Rose Brain — optional OpenAI narrative layer (server-only). Rules engine always runs first. */

export type RoseBrainInput = {
  context: string;
  system?: string;
  maxTokens?: number;
};

export function isRoseBrainEnabled(): boolean {
  return Boolean(process.env.BIOS_OPENAI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim());
}

export function roseBrainModel(): string {
  return process.env.BIOS_OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

export async function roseBrainComplete(input: RoseBrainInput): Promise<string | null> {
  const apiKey = process.env.BIOS_OPENAI_API_KEY?.trim() || process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: roseBrainModel(),
        temperature: 0.35,
        max_tokens: input.maxTokens ?? 600,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              input.system ??
              "You are ROSE Brain for CCA BidIntelligenceOS. Decision-support only. No guarantees. JSON only.",
          },
          { role: "user", content: input.context },
        ],
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content ?? null;
  } catch {
    return null;
  }
}

export type RoseExecutiveBrief = {
  headline: string;
  narrative: string;
  priorities: string[];
  engine: "rose-rules" | "rose-brain";
};

export async function generateRoseExecutiveBrief(stats: {
  activeBids: number;
  overdueFollowUps: number;
  pendingHumanReview: number;
  topInsights: { title: string; verdict: string; rationale: string }[];
}): Promise<RoseExecutiveBrief | null> {
  const rulesBrief: RoseExecutiveBrief = {
    headline:
      stats.overdueFollowUps > 0
        ? `${stats.overdueFollowUps} overdue follow-up(s) need attention`
        : `${stats.activeBids} active bid(s) in pipeline`,
    narrative: `ROSEOS sees ${stats.activeBids} active opportunities, ${stats.pendingHumanReview} item(s) awaiting human approval, and ${stats.overdueFollowUps} overdue follow-ups. Review flagged bids before client-facing decisions.`,
    priorities: stats.topInsights.slice(0, 4).map((i) => i.title),
    engine: "rose-rules",
  };

  const raw = await roseBrainComplete({
    context: `Rewrite as JSON {"headline":"...","narrative":"...","priorities":["..."]}
Stats: ${JSON.stringify(stats)}
Insights: ${JSON.stringify(stats.topInsights)}
Keep under 100 words in narrative. Executive construction tone.`,
    maxTokens: 450,
  });
  if (!raw) return rulesBrief;

  try {
    const parsed = JSON.parse(raw) as Partial<RoseExecutiveBrief>;
    return {
      headline: parsed.headline ?? rulesBrief.headline,
      narrative: parsed.narrative ?? rulesBrief.narrative,
      priorities: parsed.priorities?.length ? parsed.priorities : rulesBrief.priorities,
      engine: "rose-brain",
    };
  } catch {
    return rulesBrief;
  }
}
