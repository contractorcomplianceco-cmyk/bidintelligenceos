import { readResearchHubConfig } from "./research-hub-env.js";

export type ResearchRow = {
  id?: string;
  cca_rf_code?: string;
  state_code?: string;
  risk_factor_number?: string;
  status?: string;
  workflow_stage?: string;
  team_validation_method?: string;
  owner_name?: string;
  human_approved?: boolean;
  updated_at?: string;
};

const PRIORITY_STATES = ["FL", "TX", "CA", "GA", "NC", "TN", "AL", "SC"];

export async function fetchExportReadyForState(state: string, limit = 50) {
  const config = readResearchHubConfig();
  if (!config.configured || !config.supabaseUrl || !config.serviceKey) {
    return { ok: false as const, configured: false, rows: [] as ResearchRow[], total: 0, state: null as string | null };
  }

  const baseUrl = config.supabaseUrl.replace(/\/$/, "");
  const select =
    "id,cca_rf_code,state_code,risk_factor_number,status,workflow_stage,team_validation_method,owner_name,human_approved,updated_at";
  const statesToTry = [...new Set([state.toUpperCase(), ...PRIORITY_STATES])];

  for (const stateCode of statesToTry) {
    const params = new URLSearchParams({
      select,
      state_code: `eq.${stateCode}`,
      limit: String(limit),
    });
    const response = await fetch(`${baseUrl}/rest/v1/compliance_export_ready_rows?${params}`, {
      headers: {
        apikey: config.serviceKey,
        Authorization: `Bearer ${config.serviceKey}`,
      },
    });
    if (!response.ok) continue;
    const rows = (await response.json()) as ResearchRow[];
    if (rows.length > 0) {
      return { ok: true as const, configured: true, rows, total: rows.length, state: stateCode };
    }
  }

  return { ok: true as const, configured: true, rows: [], total: 0, state: state.toUpperCase() };
}
