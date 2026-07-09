import * as sqlite from "./schema-sqlite.js";
import * as pg from "./schema-pg.js";

const usePg = Boolean(process.env.DATABASE_URL?.trim());
const active = usePg ? pg : sqlite;

export const users = active.users;
export const organizations = active.organizations;
export const organizationMembers = active.organizationMembers;
export const orgInvites = active.orgInvites;
export const bids = active.bids;
export const jobs = active.jobs;
export const bidAnalyses = active.bidAnalyses;
export const voiceConnectDrafts = active.voiceConnectDrafts;
export const bidScores = active.bidScores;
export const bidDocuments = active.bidDocuments;

export type ActiveBidsRow = typeof bids.$inferSelect;
