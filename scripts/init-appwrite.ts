import fs from "fs";
import path from "path";

try {
  const dotenv = require("dotenv");
  dotenv.config({ path: ".env.local" });
  dotenv.config();
} catch {
  [".env.local", ".env"].forEach((file) => {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      content.split("\n").forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2]?.trim().replace(/^['"]|['"]$/g, "") || "";
        }
      });
    }
  });
}

import { Client, Databases, Storage, Permission, Role } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.APPWRITE_PROJECT_ID || "";
const apiKey = process.env.APPWRITE_API_KEY || "";
const databaseId = process.env.APPWRITE_DATABASE_ID || "vrps_db";
const bucketId = process.env.APPWRITE_STORAGE_BUCKET_ID || "news_media";

if (!projectId || !apiKey) {
  console.error("❌ APPWRITE_PROJECT_ID and APPWRITE_API_KEY environment variables are required.");
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);
const storage = new Storage(client);

const COLLECTIONS = {
  USERS: "users",
  ADDRESSES: "addresses",
  AUDIT_LOGS: "audit_logs",
  COUNTERS: "counters",
  DONATIONS: "donations",
  MEMBERSHIPS: "memberships",
  NEWS_ITEMS: "news_items",
  COMMITTEE_MEMBERS: "committee_members",
} as const;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ensureDatabase() {
  try {
    await databases.get(databaseId);
    console.log(`✅ Appwrite Database '${databaseId}' already exists.`);
  } catch (error: any) {
    if (error?.code === 404) {
      console.log(`⚙️ Creating Appwrite Database '${databaseId}'...`);
      await databases.create(databaseId, databaseId);
      console.log(`✅ Appwrite Database '${databaseId}' created successfully.`);
    } else {
      throw error;
    }
  }
}

async function prepareCollection(collectionId: string, name: string, recreate: boolean = false) {
  try {
    if (recreate) {
      try {
        await databases.deleteCollection(databaseId, collectionId);
        console.log(`  └─ Reset existing collection '${collectionId}'...`);
        await sleep(1500);
      } catch {}
    } else {
      await databases.getCollection(databaseId, collectionId);
      console.log(`  └─ Collection '${collectionId}' exists.`);
      return;
    }
  } catch (error: any) {}

  console.log(`  └─ Creating Collection '${collectionId}'...`);
  await databases.createCollection(databaseId, collectionId, name);
  console.log(`  └─ Collection '${collectionId}' created.`);
}

async function ensureAttribute(
  collectionId: string,
  key: string,
  createFn: () => Promise<any>
) {
  try {
    await databases.getAttribute(databaseId, collectionId, key);
  } catch (error: any) {
    if (error?.code === 404) {
      console.log(`     ├─ Creating attribute '${key}' in '${collectionId}'...`);
      await createFn();
      await sleep(1000);
    } else {
      throw error;
    }
  }
}

async function ensureIndex(
  collectionId: string,
  key: string,
  type: "key" | "unique" | "fulltext",
  attributes: string[],
  orders?: string[]
) {
  try {
    await databases.getIndex(databaseId, collectionId, key);
  } catch (error: any) {
    if (error?.code === 404) {
      console.log(`     ├─ Creating index '${key}' in '${collectionId}'...`);
      try {
        await databases.createIndex(databaseId, collectionId, key, type as any, attributes, orders as any);
      } catch (err: any) {
        console.warn(`     ⚠️ Warning creating index '${key}': ${err.message}`);
      }
    } else {
      throw error;
    }
  }
}

async function setupSchema() {
  console.log("\n🚀 Initializing Appwrite MariaDB database schema...");
  await ensureDatabase();

  const RESET_COLLECTIONS = process.env.RESET_DB === "true"; // Safe non-destructive schema initialization

  // 1. Users Schema
  console.log("\n📋 Provisioning Users collection...");
  await prepareCollection(COLLECTIONS.USERS, "Users", RESET_COLLECTIONS);
  await ensureAttribute(COLLECTIONS.USERS, "clerkUserId", () => databases.createStringAttribute(databaseId, COLLECTIONS.USERS, "clerkUserId", 128, true));
  await ensureAttribute(COLLECTIONS.USERS, "userId", () => databases.createStringAttribute(databaseId, COLLECTIONS.USERS, "userId", 128, true));
  await ensureAttribute(COLLECTIONS.USERS, "membershipId", () => databases.createStringAttribute(databaseId, COLLECTIONS.USERS, "membershipId", 128, false));
  await ensureAttribute(COLLECTIONS.USERS, "name", () => databases.createStringAttribute(databaseId, COLLECTIONS.USERS, "name", 128, true));
  await ensureAttribute(COLLECTIONS.USERS, "mobile", () => databases.createStringAttribute(databaseId, COLLECTIONS.USERS, "mobile", 32, false, ""));
  await ensureAttribute(COLLECTIONS.USERS, "email", () => databases.createStringAttribute(databaseId, COLLECTIONS.USERS, "email", 128, false, ""));
  await ensureAttribute(COLLECTIONS.USERS, "photoUrl", () => databases.createStringAttribute(databaseId, COLLECTIONS.USERS, "photoUrl", 512, false, ""));
  await ensureAttribute(COLLECTIONS.USERS, "isMember", () => databases.createBooleanAttribute(databaseId, COLLECTIONS.USERS, "isMember", false, false));
  await ensureAttribute(COLLECTIONS.USERS, "memberSince", () => databases.createDatetimeAttribute(databaseId, COLLECTIONS.USERS, "memberSince", false));
  await ensureAttribute(COLLECTIONS.USERS, "addressId", () => databases.createStringAttribute(databaseId, COLLECTIONS.USERS, "addressId", 128, false));
  await ensureAttribute(COLLECTIONS.USERS, "publicVisibility", () => databases.createStringAttribute(databaseId, COLLECTIONS.USERS, "publicVisibility", 32, false, "private"));
  await ensureAttribute(COLLECTIONS.USERS, "publicDisplayName", () => databases.createStringAttribute(databaseId, COLLECTIONS.USERS, "publicDisplayName", 128, false, ""));
  await ensureAttribute(COLLECTIONS.USERS, "showMembershipPublically", () => databases.createBooleanAttribute(databaseId, COLLECTIONS.USERS, "showMembershipPublically", false, false));
  await ensureAttribute(COLLECTIONS.USERS, "isDeleted", () => databases.createBooleanAttribute(databaseId, COLLECTIONS.USERS, "isDeleted", false, false));
  await ensureAttribute(COLLECTIONS.USERS, "deletedAt", () => databases.createDatetimeAttribute(databaseId, COLLECTIONS.USERS, "deletedAt", false));
  await ensureAttribute(COLLECTIONS.USERS, "roles", () => databases.createStringAttribute(databaseId, COLLECTIONS.USERS, "roles", 32, false, undefined, true));

  // 2. Addresses Schema
  console.log("\n📋 Provisioning Addresses collection...");
  await prepareCollection(COLLECTIONS.ADDRESSES, "Addresses", RESET_COLLECTIONS);
  await ensureAttribute(COLLECTIONS.ADDRESSES, "userId", () => databases.createStringAttribute(databaseId, COLLECTIONS.ADDRESSES, "userId", 128, true));
  await ensureAttribute(COLLECTIONS.ADDRESSES, "state", () => databases.createStringAttribute(databaseId, COLLECTIONS.ADDRESSES, "state", 128, false, ""));
  await ensureAttribute(COLLECTIONS.ADDRESSES, "district", () => databases.createStringAttribute(databaseId, COLLECTIONS.ADDRESSES, "district", 128, false, ""));
  await ensureAttribute(COLLECTIONS.ADDRESSES, "mandal", () => databases.createStringAttribute(databaseId, COLLECTIONS.ADDRESSES, "mandal", 128, false, ""));
  await ensureAttribute(COLLECTIONS.ADDRESSES, "village", () => databases.createStringAttribute(databaseId, COLLECTIONS.ADDRESSES, "village", 128, false, ""));
  await ensureAttribute(COLLECTIONS.ADDRESSES, "street", () => databases.createStringAttribute(databaseId, COLLECTIONS.ADDRESSES, "street", 255, false, ""));
  await ensureAttribute(COLLECTIONS.ADDRESSES, "pincode", () => databases.createStringAttribute(databaseId, COLLECTIONS.ADDRESSES, "pincode", 16, false, ""));

  // 3. Audit Logs Schema
  console.log("\n📋 Provisioning AuditLogs collection...");
  await prepareCollection(COLLECTIONS.AUDIT_LOGS, "AuditLogs", RESET_COLLECTIONS);
  await ensureAttribute(COLLECTIONS.AUDIT_LOGS, "entityType", () => databases.createStringAttribute(databaseId, COLLECTIONS.AUDIT_LOGS, "entityType", 128, true));
  await ensureAttribute(COLLECTIONS.AUDIT_LOGS, "entityId", () => databases.createStringAttribute(databaseId, COLLECTIONS.AUDIT_LOGS, "entityId", 128, true));
  await ensureAttribute(COLLECTIONS.AUDIT_LOGS, "action", () => databases.createStringAttribute(databaseId, COLLECTIONS.AUDIT_LOGS, "action", 128, true));
  await ensureAttribute(COLLECTIONS.AUDIT_LOGS, "before", () => databases.createStringAttribute(databaseId, COLLECTIONS.AUDIT_LOGS, "before", 1500, false));
  await ensureAttribute(COLLECTIONS.AUDIT_LOGS, "after", () => databases.createStringAttribute(databaseId, COLLECTIONS.AUDIT_LOGS, "after", 1500, false));
  await ensureAttribute(COLLECTIONS.AUDIT_LOGS, "actorUserId", () => databases.createStringAttribute(databaseId, COLLECTIONS.AUDIT_LOGS, "actorUserId", 128, false, ""));
  await ensureAttribute(COLLECTIONS.AUDIT_LOGS, "source", () => databases.createStringAttribute(databaseId, COLLECTIONS.AUDIT_LOGS, "source", 32, true));

  // 4. Counters Schema
  console.log("\n📋 Provisioning Counters collection...");
  await prepareCollection(COLLECTIONS.COUNTERS, "Counters", RESET_COLLECTIONS);
  await ensureAttribute(COLLECTIONS.COUNTERS, "name", () => databases.createStringAttribute(databaseId, COLLECTIONS.COUNTERS, "name", 128, true));
  await ensureAttribute(COLLECTIONS.COUNTERS, "value", () => databases.createIntegerAttribute(databaseId, COLLECTIONS.COUNTERS, "value", true));

  // 5. Donations Schema
  console.log("\n📋 Provisioning Donations collection...");
  await prepareCollection(COLLECTIONS.DONATIONS, "Donations", RESET_COLLECTIONS);
  await ensureAttribute(COLLECTIONS.DONATIONS, "donationId", () => databases.createStringAttribute(databaseId, COLLECTIONS.DONATIONS, "donationId", 128, true));
  await ensureAttribute(COLLECTIONS.DONATIONS, "userId", () => databases.createStringAttribute(databaseId, COLLECTIONS.DONATIONS, "userId", 128, true));
  await ensureAttribute(COLLECTIONS.DONATIONS, "amount", () => databases.createFloatAttribute(databaseId, COLLECTIONS.DONATIONS, "amount", true));
  await ensureAttribute(COLLECTIONS.DONATIONS, "donationType", () => databases.createStringAttribute(databaseId, COLLECTIONS.DONATIONS, "donationType", 32, true));
  await ensureAttribute(COLLECTIONS.DONATIONS, "paymentStatus", () => databases.createStringAttribute(databaseId, COLLECTIONS.DONATIONS, "paymentStatus", 32, false, "pending"));
  await ensureAttribute(COLLECTIONS.DONATIONS, "transactionId", () => databases.createStringAttribute(databaseId, COLLECTIONS.DONATIONS, "transactionId", 128, false, ""));
  await ensureAttribute(COLLECTIONS.DONATIONS, "subscriptionId", () => databases.createStringAttribute(databaseId, COLLECTIONS.DONATIONS, "subscriptionId", 128, false, ""));
  await ensureAttribute(COLLECTIONS.DONATIONS, "publicVisibility", () => databases.createStringAttribute(databaseId, COLLECTIONS.DONATIONS, "publicVisibility", 32, false, "private"));
  await ensureAttribute(COLLECTIONS.DONATIONS, "publicDisplayName", () => databases.createStringAttribute(databaseId, COLLECTIONS.DONATIONS, "publicDisplayName", 128, false, ""));
  await ensureAttribute(COLLECTIONS.DONATIONS, "supporterMessage", () => databases.createStringAttribute(databaseId, COLLECTIONS.DONATIONS, "supporterMessage", 512, false, ""));
  await ensureAttribute(COLLECTIONS.DONATIONS, "showDonationPublicly", () => databases.createBooleanAttribute(databaseId, COLLECTIONS.DONATIONS, "showDonationPublicly", false, false));

  // 6. Memberships Schema
  console.log("\n📋 Provisioning Memberships collection...");
  await prepareCollection(COLLECTIONS.MEMBERSHIPS, "Memberships", RESET_COLLECTIONS);
  await ensureAttribute(COLLECTIONS.MEMBERSHIPS, "membershipId", () => databases.createStringAttribute(databaseId, COLLECTIONS.MEMBERSHIPS, "membershipId", 128, true));
  await ensureAttribute(COLLECTIONS.MEMBERSHIPS, "userId", () => databases.createStringAttribute(databaseId, COLLECTIONS.MEMBERSHIPS, "userId", 128, true));
  await ensureAttribute(COLLECTIONS.MEMBERSHIPS, "membershipFee", () => databases.createFloatAttribute(databaseId, COLLECTIONS.MEMBERSHIPS, "membershipFee", true));
  await ensureAttribute(COLLECTIONS.MEMBERSHIPS, "startDate", () => databases.createDatetimeAttribute(databaseId, COLLECTIONS.MEMBERSHIPS, "startDate", false));
  await ensureAttribute(COLLECTIONS.MEMBERSHIPS, "status", () => databases.createStringAttribute(databaseId, COLLECTIONS.MEMBERSHIPS, "status", 32, false, "pending"));
  await ensureAttribute(COLLECTIONS.MEMBERSHIPS, "paymentId", () => databases.createStringAttribute(databaseId, COLLECTIONS.MEMBERSHIPS, "paymentId", 128, false, ""));

  // 7. News Items Schema
  console.log("\n📋 Provisioning News Items collection...");
  await prepareCollection(COLLECTIONS.NEWS_ITEMS, "NewsItems", RESET_COLLECTIONS);
  await ensureAttribute(COLLECTIONS.NEWS_ITEMS, "newsId", () => databases.createStringAttribute(databaseId, COLLECTIONS.NEWS_ITEMS, "newsId", 128, true));
  await ensureAttribute(COLLECTIONS.NEWS_ITEMS, "title", () => databases.createStringAttribute(databaseId, COLLECTIONS.NEWS_ITEMS, "title", 256, true));
  await ensureAttribute(COLLECTIONS.NEWS_ITEMS, "category", () => databases.createStringAttribute(databaseId, COLLECTIONS.NEWS_ITEMS, "category", 64, true));
  await ensureAttribute(COLLECTIONS.NEWS_ITEMS, "date", () => databases.createStringAttribute(databaseId, COLLECTIONS.NEWS_ITEMS, "date", 64, true));
  await ensureAttribute(COLLECTIONS.NEWS_ITEMS, "src", () => databases.createStringAttribute(databaseId, COLLECTIONS.NEWS_ITEMS, "src", 512, true));
  await ensureAttribute(COLLECTIONS.NEWS_ITEMS, "fileId", () => databases.createStringAttribute(databaseId, COLLECTIONS.NEWS_ITEMS, "fileId", 128, false, ""));
  await ensureAttribute(COLLECTIONS.NEWS_ITEMS, "createdAt", () => databases.createDatetimeAttribute(databaseId, COLLECTIONS.NEWS_ITEMS, "createdAt", false));
  await ensureAttribute(COLLECTIONS.NEWS_ITEMS, "updatedAt", () => databases.createDatetimeAttribute(databaseId, COLLECTIONS.NEWS_ITEMS, "updatedAt", false));

  // 8. Committee Members Schema
  console.log("\n📋 Provisioning Committee Members collection...");
  await prepareCollection(COLLECTIONS.COMMITTEE_MEMBERS, "CommitteeMembers", RESET_COLLECTIONS);
  await ensureAttribute(COLLECTIONS.COMMITTEE_MEMBERS, "memberId", () => databases.createStringAttribute(databaseId, COLLECTIONS.COMMITTEE_MEMBERS, "memberId", 128, true));
  await ensureAttribute(COLLECTIONS.COMMITTEE_MEMBERS, "name", () => databases.createStringAttribute(databaseId, COLLECTIONS.COMMITTEE_MEMBERS, "name", 128, true));
  await ensureAttribute(COLLECTIONS.COMMITTEE_MEMBERS, "designation", () => databases.createStringAttribute(databaseId, COLLECTIONS.COMMITTEE_MEMBERS, "designation", 128, true));
  await ensureAttribute(COLLECTIONS.COMMITTEE_MEMBERS, "role", () => databases.createStringAttribute(databaseId, COLLECTIONS.COMMITTEE_MEMBERS, "role", 128, true));
  await ensureAttribute(COLLECTIONS.COMMITTEE_MEMBERS, "image", () => databases.createStringAttribute(databaseId, COLLECTIONS.COMMITTEE_MEMBERS, "image", 512, true));
  await ensureAttribute(COLLECTIONS.COMMITTEE_MEMBERS, "fileId", () => databases.createStringAttribute(databaseId, COLLECTIONS.COMMITTEE_MEMBERS, "fileId", 128, false, ""));
  await ensureAttribute(COLLECTIONS.COMMITTEE_MEMBERS, "order", () => databases.createIntegerAttribute(databaseId, COLLECTIONS.COMMITTEE_MEMBERS, "order", true));
  await ensureAttribute(COLLECTIONS.COMMITTEE_MEMBERS, "createdAt", () => databases.createDatetimeAttribute(databaseId, COLLECTIONS.COMMITTEE_MEMBERS, "createdAt", false));
  await ensureAttribute(COLLECTIONS.COMMITTEE_MEMBERS, "updatedAt", () => databases.createDatetimeAttribute(databaseId, COLLECTIONS.COMMITTEE_MEMBERS, "updatedAt", false));

  // Storage bucket provisioning
  console.log("\n📁 Provisioning Appwrite Storage bucket for News Media...");
  try {
    await storage.getBucket(bucketId);
    console.log(`  └─ Bucket '${bucketId}' exists.`);
  } catch (err: any) {
    if (err?.code === 404) {
      console.log(`  └─ Creating Storage Bucket '${bucketId}'...`);
      try {
        await storage.createBucket(bucketId, "News Media", [Permission.read(Role.any())], false, true);
        console.log(`  └─ Bucket '${bucketId}' created.`);
      } catch (e: any) {
        console.warn(`  ⚠️ Warning creating bucket: ${e.message}`);
      }
    }
  }

  const committeeBucketId = process.env.APPWRITE_COMMITTEE_BUCKET_ID || "committee_media";
  console.log("\n📁 Provisioning Appwrite Storage bucket for Committee Media...");
  try {
    await storage.getBucket(committeeBucketId);
    console.log(`  └─ Bucket '${committeeBucketId}' exists.`);
  } catch (err: any) {
    if (err?.code === 404) {
      console.log(`  └─ Creating Storage Bucket '${committeeBucketId}'...`);
      try {
        await storage.createBucket(committeeBucketId, "Committee Media", [Permission.read(Role.any())], false, true);
        console.log(`  └─ Bucket '${committeeBucketId}' created.`);
      } catch (e: any) {
        console.warn(`  ⚠️ Warning creating bucket: ${e.message}`);
      }
    }
  }

  console.log("\n⏳ Waiting for Appwrite indexes and attributes initialization...");
  await sleep(4000);

  // Indexes setup
  console.log("\n🔑 Setting up collection indexes...");
  await ensureIndex(COLLECTIONS.USERS, "idx_clerkUserId", "unique", ["clerkUserId"]);
  await ensureIndex(COLLECTIONS.USERS, "idx_userId", "unique", ["userId"]);
  await ensureIndex(COLLECTIONS.COUNTERS, "idx_counter_name", "unique", ["name"]);
  await ensureIndex(COLLECTIONS.DONATIONS, "idx_donationId", "unique", ["donationId"]);
  await ensureIndex(COLLECTIONS.MEMBERSHIPS, "idx_membershipId", "unique", ["membershipId"]);
  await ensureIndex(COLLECTIONS.NEWS_ITEMS, "idx_newsId", "unique", ["newsId"]);
  await ensureIndex(COLLECTIONS.COMMITTEE_MEMBERS, "idx_memberId", "unique", ["memberId"]);

  console.log("\n🎉 Appwrite Database schema successfully created and configured!");
}

setupSchema().catch((err) => {
  console.error("❌ Schema setup failed:", err);
  process.exit(1);
});
