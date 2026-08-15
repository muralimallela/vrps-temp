import { getAppwriteDatabases, DATABASE_ID, COLLECTIONS } from "@/src/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { wrapDocument, QueryPromise } from "@/src/lib/modelHelper";

export interface ConsentRecordDocument {
  _id: string;
  $id: string;
  consentId: string;
  userId: string;
  purposeKey: string;
  status: "granted" | "withdrawn";
  consentTextVersion: string;
  ipAddress?: string;
  userAgent?: string;
  notes?: string;
  grantedAt?: string | Date | null;
  withdrawnAt?: string | Date | null;
  createdAt?: string;
  updatedAt?: string;
  toObject: () => any;
  toJSON: () => any;
  save: () => Promise<ConsentRecordDocument>;
}

async function updateConsentRecordData(docId: string, payload: any) {
  const databases = getAppwriteDatabases();
  if (payload.grantedAt instanceof Date) payload.grantedAt = payload.grantedAt.toISOString();
  if (payload.withdrawnAt instanceof Date) payload.withdrawnAt = payload.withdrawnAt.toISOString();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.CONSENT_RECORDS, docId, payload);
}

export class ConsentRecord {
  static findOne(filter: Record<string, any>) {
    return new QueryPromise<ConsentRecordDocument | null>(
      (async () => {
        const docs = await ConsentRecord.find(filter, { limit: 1 });
        return docs[0] || null;
      })()
    );
  }

  static findById(id: string) {
    return new QueryPromise<ConsentRecordDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        try {
          const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.CONSENT_RECORDS, id);
          return wrapDocument<ConsentRecordDocument>(doc, (p) => updateConsentRecordData(doc.$id, p));
        } catch {
          return null;
        }
      })()
    );
  }

  static find(filter: Record<string, any> = {}, options: { limit?: number; offset?: number } = {}) {
    return new QueryPromise<ConsentRecordDocument[]>(
      (async () => {
        const databases = getAppwriteDatabases();
        const queries: string[] = [];
        for (const [key, val] of Object.entries(filter)) {
          if (val !== undefined && val !== null && typeof val !== "object") {
            queries.push(Query.equal(key, val));
          }
        }
        if (options.limit) queries.push(Query.limit(options.limit));
        if (options.offset) queries.push(Query.offset(options.offset));
        queries.push(Query.orderDesc("$createdAt"));

        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CONSENT_RECORDS, queries);
        return response.documents.map((doc) =>
          wrapDocument<ConsentRecordDocument>(doc, (p) => updateConsentRecordData(doc.$id, p))
        );
      })()
    );
  }

  static async create(data: Partial<ConsentRecordDocument>) {
    const databases = getAppwriteDatabases();
    const payload: Record<string, any> = {
      consentId: data.consentId || ID.unique(),
      userId: data.userId || "anonymous",
      purposeKey: data.purposeKey,
      status: data.status || "granted",
      consentTextVersion: data.consentTextVersion || "v1.0-2026-08",
      ipAddress: data.ipAddress || "",
      userAgent: data.userAgent || "",
      notes: data.notes || "",
    };
    if (data.grantedAt) {
      payload.grantedAt = data.grantedAt instanceof Date ? data.grantedAt.toISOString() : data.grantedAt;
    } else if (payload.status === "granted") {
      payload.grantedAt = new Date().toISOString();
    }
    if (data.withdrawnAt) {
      payload.withdrawnAt = data.withdrawnAt instanceof Date ? data.withdrawnAt.toISOString() : data.withdrawnAt;
    }

    const created = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.CONSENT_RECORDS,
      ID.unique(),
      payload
    );
    return wrapDocument<ConsentRecordDocument>(created, (p) => updateConsentRecordData(created.$id, p));
  }

  static findOneAndUpdate(filter: Record<string, any>, update: Record<string, any>, options: { new?: boolean; upsert?: boolean } = {}) {
    return new QueryPromise<ConsentRecordDocument | null>(
      (async () => {
        let doc = await ConsentRecord.findOne(filter);
        const databases = getAppwriteDatabases();
        const updatePayload = update.$set ? update.$set : update;
        if (doc) {
          const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.CONSENT_RECORDS, doc.$id, updatePayload);
          return wrapDocument<ConsentRecordDocument>(updated, (p) => updateConsentRecordData(updated.$id, p));
        } else if (options.upsert) {
          const created = await databases.createDocument(DATABASE_ID, COLLECTIONS.CONSENT_RECORDS, ID.unique(), { ...filter, ...updatePayload });
          return wrapDocument<ConsentRecordDocument>(created, (p) => updateConsentRecordData(created.$id, p));
        }
        return null;
      })()
    );
  }
}

export default ConsentRecord;
