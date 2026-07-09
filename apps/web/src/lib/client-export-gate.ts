/** Live authed users need human-reviewed score before client-facing export/package. */
export function clientExportBlocked(live: boolean, humanReviewed: boolean): boolean {
  return live && !humanReviewed;
}

export const CLIENT_EXPORT_BLOCKED_MSG =
  "Bid score pending human review — approve on bid detail before exporting.";
