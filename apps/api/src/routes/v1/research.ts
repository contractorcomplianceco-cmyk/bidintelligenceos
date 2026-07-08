import { Router } from "express";
import { computeComplianceEligibility } from "../../lib/compliance-eligibility.js";
import { readResearchHubConfig } from "../../lib/research-hub-env.js";

const router = Router();

type ResearchExportRow = Record<string, unknown>;

function readString(row: ResearchExportRow, key: string): string | undefined {
  const value = row[key];
  return typeof value === "string" ? value : undefined;
}

function readBoolean(row: ResearchExportRow, key: string): boolean | undefined {
  const value = row[key];
  return typeof value === "boolean" ? value : undefined;
}

function sanitizeRow(row: ResearchExportRow) {
  return {
    id: readString(row, "id"),
    ccaRfCode: readString(row, "cca_rf_code"),
    stateCode: readString(row, "state_code"),
    riskFactorNumber: readString(row, "risk_factor_number"),
    status: readString(row, "status"),
    workflowStage: readString(row, "workflow_stage"),
    teamValidationMethod: readString(row, "team_validation_method"),
    ownerName: readString(row, "owner_name"),
    humanApproved: readBoolean(row, "human_approved"),
    updatedAt: readString(row, "updated_at"),
  };
}

router.get("/compliance-eligibility", async (req, res) => {
  const state = String(req.query.state || "").trim().toUpperCase() || null;
  const eligibility = await computeComplianceEligibility(state);
  res.json({ eligibility });
});

router.get("/export-ready", async (req, res) => {
  const config = readResearchHubConfig();
  const state = String(req.query.state || "").trim().toUpperCase();
  const limitRaw = Number(req.query.limit || 10);
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 10;

  if (!config.configured || !config.supabaseUrl || !config.serviceKey) {
    res.status(503).json({
      ok: false,
      configured: false,
      reason: "research_hub_credentials_not_configured",
      rows: [],
      total: 0,
      count: 0,
    });
    return;
  }

  try {
    const baseUrl = config.supabaseUrl.replace(/\/$/, "");
    const select =
      "id,cca_rf_code,state_code,risk_factor_number,status,workflow_stage,team_validation_method,owner_name,human_approved,updated_at";
    const statesToTry = state ? [state, "FL", "TX", "CA", "GA", "NC", "TN", "AL", "SC"] : ["FL", "TX", "CA", "GA", "NC", "TN", "AL", "SC"];
    const uniqueStates = [...new Set(statesToTry)];

    let selectedState: string | null = state || null;
    let rowsPayload: ResearchExportRow[] = [];
    let total = 0;
    let lastStatus = 200;
    let lastMessage = "";

    for (const stateCode of uniqueStates) {
      const params = new URLSearchParams({
        select,
        state_code: `eq.${stateCode}`,
        limit: String(limit),
      });
      const response = await fetch(`${baseUrl}/rest/v1/compliance_export_ready_rows?${params.toString()}`, {
      headers: {
        apikey: config.serviceKey,
        Authorization: `Bearer ${config.serviceKey}`,
        Prefer: "count=exact",
      },
      });

      lastStatus = response.status;
      const text = await response.text();
      if (!response.ok) {
        lastMessage = text;
        continue;
      }

      const rows = JSON.parse(text) as ResearchExportRow[];
      const contentRange = response.headers.get("content-range");
      const parsedTotal = contentRange?.match(/\/(\d+)$/)?.[1];
      total = parsedTotal ? Number(parsedTotal) : rows.length;
      if (rows.length > 0 || stateCode === uniqueStates[uniqueStates.length - 1]) {
        selectedState = stateCode;
        rowsPayload = rows;
        break;
      }
    }

    if (lastStatus >= 400 && rowsPayload.length === 0) {
      res.status(lastStatus).json({
        ok: false,
        configured: true,
        reason: lastMessage || "research_hub_view_failed",
        rows: [],
        total: 0,
        count: 0,
      });
      return;
    }

    const rows = rowsPayload.map(sanitizeRow);
    const byState = rows.reduce<Record<string, number>>((acc, row) => {
      const key = row.stateCode || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    res.json({
      ok: true,
      configured: true,
      source: "research_hub_export_ready",
      state: selectedState,
      requestedState: state || null,
      total,
      count: rows.length,
      note:
        state && selectedState !== state
          ? `No ${state} export-ready rows yet; showing ${selectedState} as first available preview.`
          : "Read-only sanitized export-ready preview from Research Hub.",
      byState,
      rows,
    });
  } catch (error) {
    res.status(502).json({
      ok: false,
      configured: true,
      reason: error instanceof Error ? error.message : "research_hub_unreachable",
      rows: [],
      total: 0,
      count: 0,
    });
  }
});

export default router;
