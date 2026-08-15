import { Client, Databases, Storage } from "node-appwrite";

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
  NEWS_ITEMS: "news_items",
  COMMITTEE_MEMBERS: "committee_members",
  CONSENT_RECORDS: "consent_records",
  DATA_RIGHTS_REQUESTS: "data_rights_requests",
  GALLERY_ITEMS: "gallery_items",
} as const;

export const STORAGE_BUCKETS = {
  NEWS_MEDIA: process.env.APPWRITE_STORAGE_BUCKET_ID || "news_media",
  COMMITTEE_MEDIA: process.env.APPWRITE_COMMITTEE_BUCKET_ID || "committee_media",
  GALLERY_MEDIA: process.env.APPWRITE_GALLERY_BUCKET_ID || "gallery_media",
} as const;

export function getAppwriteServerClient() {
  const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_PROJECT_ID || "";
  const apiKey = process.env.APPWRITE_API_KEY || "";

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

export function getAppwriteStorage() {
  const client = getAppwriteServerClient();
  return new Storage(client);
}
