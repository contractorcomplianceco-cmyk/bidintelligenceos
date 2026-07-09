/** Env-gated platform feed configuration — honest status for UI stubs. */

export type PlatformFeedStatus = {
  configured: boolean;
  message: string;
};

export function getSamGovFeedStatus(): PlatformFeedStatus {
  const key = process.env.SAM_GOV_API_KEY?.trim();
  if (key) {
    return {
      configured: true,
      message: "SAM.gov API key is configured. Live federal opportunity feed is not wired yet — Phase 5 stub.",
    };
  }
  return {
    configured: false,
    message:
      "SAM.gov feed is not configured. Set SAM_GOV_API_KEY on the server to enable federal opportunity integration.",
  };
}

export function getBlsFeedStatus(): PlatformFeedStatus {
  const key = process.env.BLS_API_KEY?.trim();
  if (key) {
    return {
      configured: true,
      message: "BLS API key is configured. Live labor/market index feed is not wired yet — Phase 5 stub.",
    };
  }
  return {
    configured: false,
    message:
      "BLS feed is not configured. Set BLS_API_KEY on the server to enable Bureau of Labor Statistics market signals.",
  };
}

export function getZohoSyncStatus(): PlatformFeedStatus {
  const clientId = process.env.ZOHO_CLIENT_ID?.trim();
  const clientSecret = process.env.ZOHO_CLIENT_SECRET?.trim();
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN?.trim();
  const configured = Boolean(clientId && clientSecret && refreshToken);
  if (configured) {
    return {
      configured: true,
      message: "Zoho credentials are configured. CRM sync route is stubbed — full sync deferred.",
    };
  }
  return {
    configured: false,
    message:
      "Zoho sync is not configured. Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN to enable integration status.",
  };
}
