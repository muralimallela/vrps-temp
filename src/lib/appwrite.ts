import { Client, Databases } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID || "";
const apiKey = process.env.APPWRITE_API_KEY || "";

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "vrps_db";

export const COLLECTIONS = {
  USERS: "users",
  ADDRESSES: "addresses",
  AUDIT_LOGS: "audit_logs",
  COUNTERS: "counters",
  DONATIONS: "donations",
  MEMBERSHIPS: "memberships",
} as const;

export function getAppwriteServerClient() {
  const client = new Client();
  client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  return client;
}

export function getAppwriteDatabases() {
  const client = getAppwriteServerClient();
  return new Databases(client);
}
