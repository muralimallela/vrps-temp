import { getAppwriteDatabases, DATABASE_ID, COLLECTIONS } from "@/src/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { wrapDocument, QueryPromise } from "@/src/lib/modelHelper";

export type DataRightsRequestType =
  | "access"
  | "correction"
  | "erasure"
  | "withdrawal"
  | "nomination"
  | "grievance";

export type DataRightsRequestStatus =
  | "submitted"
  | "in_review"
  | "fulfilled"
  | "rejected";

export interface DataRightsRequestDocument {
  _id: string;
  $id: string;
  requestId: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  membershipId?: string;
  requestType: DataRightsRequestType;
  status: DataRightsRequestStatus;
  details: string;
  correctionData?: string;
  nomineeDetails?: string;
  resolutionNotes?: string;
  ipAddress?: string;
  userAgent?: string;
  requestedAt: string | Date;
  resolvedAt?: string | Date | null;
  createdAt?: string;
  updatedAt?: string;
  toObject: () => any;
  toJSON: () => any;
  save: () => Promise<DataRightsRequestDocument>;
}

async function updateDataRightsRequestData(docId: string, payload: any) {
  const databases = getAppwriteDatabases();
  if (payload.resolvedAt instanceof Date) payload.resolvedAt = payload.resolvedAt.toISOString();
  if (payload.requestedAt instanceof Date) payload.requestedAt = payload.requestedAt.toISOString();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.DATA_RIGHTS_REQUESTS, docId, payload);
}

export class DataRightsRequest {
  static findOne(filter: Record<string, any>) {
    return new QueryPromise<DataRightsRequestDocument | null>(
      (async () => {
        const docs = await DataRightsRequest.find(filter, { limit: 1 });
        return docs[0] || null;
      })()
    );
  }

  static findById(id: string) {
    return new QueryPromise<DataRightsRequestDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        try {
          const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.DATA_RIGHTS_REQUESTS, id);
          return wrapDocument<DataRightsRequestDocument>(doc, (p) => updateDataRightsRequestData(doc.$id, p));
        } catch {
          return null;
        }
      })()
    );
  }

  static find(filter: Record<string, any> = {}, options: { limit?: number; offset?: number } = {}) {
    return new QueryPromise<DataRightsRequestDocument[]>(
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

        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.DATA_RIGHTS_REQUESTS, queries);
        return response.documents.map((doc) =>
          wrapDocument<DataRightsRequestDocument>(doc, (p) => updateDataRightsRequestData(doc.$id, p))
        );
      })()
    );
  }

  static async create(data: Partial<DataRightsRequestDocument>) {
    const databases = getAppwriteDatabases();
    const payload: Record<string, any> = {
      requestId: data.requestId || `DRR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      userId: data.userId || "anonymous",
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      membershipId: data.membershipId || "",
      requestType: data.requestType || "access",
      status: data.status || "submitted",
      details: data.details || "",
      correctionData: data.correctionData || "",
      nomineeDetails: data.nomineeDetails || "",
      resolutionNotes: data.resolutionNotes || "",
      ipAddress: data.ipAddress || "",
      userAgent: data.userAgent || "",
      requestedAt: data.requestedAt ? (data.requestedAt instanceof Date ? data.requestedAt.toISOString() : data.requestedAt) : new Date().toISOString(),
    };

    if (data.resolvedAt) {
      payload.resolvedAt = data.resolvedAt instanceof Date ? data.resolvedAt.toISOString() : data.resolvedAt;
    }

    const created = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.DATA_RIGHTS_REQUESTS,
      ID.unique(),
      payload
    );
    return wrapDocument<DataRightsRequestDocument>(created, (p) => updateDataRightsRequestData(created.$id, p));
  }

  static findOneAndUpdate(filter: Record<string, any>, update: Record<string, any>, options: { new?: boolean; upsert?: boolean } = {}) {
    return new QueryPromise<DataRightsRequestDocument | null>(
      (async () => {
        let doc = await DataRightsRequest.findOne(filter);
        const databases = getAppwriteDatabases();
        const updatePayload = update.$set ? update.$set : update;
        if (doc) {
          const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.DATA_RIGHTS_REQUESTS, doc.$id, updatePayload);
          return wrapDocument<DataRightsRequestDocument>(updated, (p) => updateDataRightsRequestData(updated.$id, p));
        } else if (options.upsert) {
          const created = await databases.createDocument(DATABASE_ID, COLLECTIONS.DATA_RIGHTS_REQUESTS, ID.unique(), { ...filter, ...updatePayload });
          return wrapDocument<DataRightsRequestDocument>(created, (p) => updateDataRightsRequestData(created.$id, p));
        }
        return null;
      })()
    );
  }
}

export default DataRightsRequest;
