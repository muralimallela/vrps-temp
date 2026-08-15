import { getAppwriteDatabases, DATABASE_ID, COLLECTIONS } from "@/src/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { wrapDocument, QueryPromise, evaluateAggregation } from "@/src/lib/modelHelper";

export const MEMBERSHIP_STATUSES = [
  "pending",
  "active",
  "expired",
  "suspended",
] as const;

export interface MembershipDocument {
  _id: string;
  $id: string;
  membershipId: string;
  userId: string;
  membershipFee: number;
  startDate?: string | Date | null;
  status?: string;
  paymentId?: string;
  createdAt?: string;
  updatedAt?: string;
  toObject: () => any;
  toJSON: () => any;
  save: () => Promise<MembershipDocument>;
}

async function updateMembershipData(docId: string, payload: any) {
  const databases = getAppwriteDatabases();
  if (payload.startDate instanceof Date) payload.startDate = payload.startDate.toISOString();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, docId, payload);
}

export class Membership {
  static findOne(filter: Record<string, any>) {
    return new QueryPromise<MembershipDocument | null>(
      (async () => {
        const docs = await Membership.find(filter, { limit: 1 });
        return docs[0] || null;
      })()
    );
  }

  static findById(id: string) {
    return new QueryPromise<MembershipDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        try {
          const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, id);
          return wrapDocument<MembershipDocument>(doc, (p) => updateMembershipData(doc.$id, p));
        } catch (e) {
          return null;
        }
      })()
    );
  }

  static find(filter: Record<string, any> = {}, options: { limit?: number; offset?: number } = {}) {
    return new QueryPromise<MembershipDocument[]>(
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

        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, queries);
        return response.documents.map((doc) =>
          wrapDocument<MembershipDocument>(doc, (p) => updateMembershipData(doc.$id, p))
        );
      })()
    );
  }

  static countDocuments(filter: Record<string, any> = {}) {
    return new QueryPromise<number>(
      (async () => {
        const docs = await Membership.find(filter);
        return docs.length;
      })()
    );
  }

  static async aggregate(pipeline: any[]) {
    const allMemberships = await Membership.find({});
    return evaluateAggregation(allMemberships, pipeline, async (col) => {
      const databases = getAppwriteDatabases();
      const res = await databases.listDocuments(DATABASE_ID, col);
      return res.documents.map(d => ({ ...d, _id: d.$id }));
    });
  }

  static async create(data: Partial<MembershipDocument>) {
    const databases = getAppwriteDatabases();
    const payload: Record<string, any> = {
      membershipId: data.membershipId,
      userId: data.userId,
      membershipFee: data.membershipFee,
      status: data.status || "pending",
      paymentId: data.paymentId || "",
    };
    if (data.startDate) {
      payload.startDate = data.startDate instanceof Date ? data.startDate.toISOString() : data.startDate;
    }

    const created = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.MEMBERSHIPS,
      ID.unique(),
      payload
    );
    return wrapDocument<MembershipDocument>(created, (p) => updateMembershipData(created.$id, p));
  }

  static findOneAndUpdate(filter: Record<string, any>, update: Record<string, any>, options: { new?: boolean; upsert?: boolean } = {}) {
    return new QueryPromise<MembershipDocument | null>(
      (async () => {
        let doc = await Membership.findOne(filter);
        const databases = getAppwriteDatabases();
        const updatePayload = update.$set ? update.$set : update;
        if (doc) {
          const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, doc.$id, updatePayload);
          return wrapDocument<MembershipDocument>(updated, (p) => updateMembershipData(updated.$id, p));
        } else if (options.upsert) {
          const created = await databases.createDocument(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, ID.unique(), { ...filter, ...updatePayload });
          return wrapDocument<MembershipDocument>(created, (p) => updateMembershipData(created.$id, p));
        }
        return null;
      })()
    );
  }

  static updateOne(filter: Record<string, any>, update: Record<string, any>) {
    return this.findOneAndUpdate(filter, update);
  }

  static updateMany(filter: Record<string, any>, update: Record<string, any>) {
    return new QueryPromise<{ modifiedCount: number }>(
      (async () => {
        const docs = await Membership.find(filter);
        const databases = getAppwriteDatabases();
        const updatePayload = update.$set ? update.$set : update;
        const promises = docs.map((doc: any) =>
          databases.updateDocument(DATABASE_ID, COLLECTIONS.MEMBERSHIPS, doc.$id, updatePayload)
        );
        await Promise.all(promises);
        return { modifiedCount: docs.length };
      })()
    );
  }
}

export default Membership;
