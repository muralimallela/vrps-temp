import { getAppwriteDatabases, DATABASE_ID, COLLECTIONS } from "@/src/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { wrapDocument, QueryPromise } from "@/src/lib/modelHelper";

export interface AuditLogDocument {
  _id: string;
  $id: string;
  entityType: string;
  entityId: string;
  action: string;
  before?: any;
  after?: any;
  actorUserId?: string;
  source: "api" | "webhook" | "admin";
  createdAt?: string;
  updatedAt?: string;
  toObject: () => any;
  toJSON: () => any;
  save: () => Promise<AuditLogDocument>;
}

async function updateAuditLogData(docId: string, payload: any) {
  const databases = getAppwriteDatabases();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.AUDIT_LOGS, docId, payload);
}

export class AuditLog {
  static async create(data: Partial<AuditLogDocument>) {
    const databases = getAppwriteDatabases();
    const payload = {
      entityType: data.entityType,
      entityId: data.entityId,
      action: data.action,
      before: data.before ? JSON.stringify(data.before) : null,
      after: data.after ? JSON.stringify(data.after) : null,
      actorUserId: data.actorUserId || "",
      source: data.source,
    };
    const created = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.AUDIT_LOGS,
      ID.unique(),
      payload
    );
    const doc = {
      ...created,
      before: created.before ? JSON.parse(created.before) : null,
      after: created.after ? JSON.parse(created.after) : null,
    };
    return wrapDocument<AuditLogDocument>(doc, (p) => updateAuditLogData(created.$id, p));
  }

  static find(filter: Record<string, any> = {}, options: { sort?: any; limit?: number } = {}) {
    return new QueryPromise<AuditLogDocument[]>(
      (async () => {
        const databases = getAppwriteDatabases();
        const queries: string[] = [];
        for (const [key, val] of Object.entries(filter)) {
          if (val !== undefined && val !== null && typeof val !== "object") {
            queries.push(Query.equal(key, val));
          }
        }
        if (options.limit) queries.push(Query.limit(options.limit));
        queries.push(Query.orderDesc("$createdAt"));

        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.AUDIT_LOGS, queries);
        return response.documents.map((doc) => {
          const parsed = {
            ...doc,
            before: doc.before ? JSON.parse(doc.before) : null,
            after: doc.after ? JSON.parse(doc.after) : null,
          };
          return wrapDocument<AuditLogDocument>(parsed, (p) => updateAuditLogData(doc.$id, p));
        });
      })()
    );
  }
}

export default AuditLog;
