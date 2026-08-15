import { getAppwriteDatabases, DATABASE_ID, COLLECTIONS } from "@/src/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { wrapDocument, QueryPromise, evaluateAggregation } from "@/src/lib/modelHelper";

export const DONATION_TYPES = ["one_time", "monthly"] as const;
export const PAYMENT_STATUSES = [
  "pending",
  "success",
  "failed",
  "cancelled",
] as const;

export interface DonationDocument {
  _id: string;
  $id: string;
  donationId: string;
  userId: string;
  amount: number;
  donationType: string;
  paymentStatus?: string;
  transactionId?: string;
  subscriptionId?: string;
  publicVisibility?: string;
  publicDisplayName?: string;
  supporterMessage?: string;
  showDonationPublicly?: boolean;
  createdAt?: string;
  updatedAt?: string;
  toObject: () => any;
  toJSON: () => any;
  save: () => Promise<DonationDocument>;
}

async function updateDonationData(docId: string, payload: any) {
  const databases = getAppwriteDatabases();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.DONATIONS, docId, payload);
}

export class Donation {
  static findOne(filter: Record<string, any>) {
    return new QueryPromise<DonationDocument | null>(
      (async () => {
        const docs = await Donation.find(filter, { limit: 1 });
        return docs[0] || null;
      })()
    );
  }

  static findById(id: string) {
    return new QueryPromise<DonationDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        try {
          const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.DONATIONS, id);
          return wrapDocument<DonationDocument>(doc, (p) => updateDonationData(doc.$id, p));
        } catch (e) {
          return null;
        }
      })()
    );
  }

  static find(filter: Record<string, any> = {}, options: { limit?: number; offset?: number } = {}) {
    return new QueryPromise<DonationDocument[]>(
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

        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.DONATIONS, queries);
        return response.documents.map((doc) =>
          wrapDocument<DonationDocument>(doc, (p) => updateDonationData(doc.$id, p))
        );
      })()
    );
  }

  static countDocuments(filter: Record<string, any> = {}) {
    return new QueryPromise<number>(
      (async () => {
        const docs = await Donation.find(filter);
        return docs.length;
      })()
    );
  }

  static async aggregate(pipeline: any[]) {
    const allDonations = await Donation.find({});
    return evaluateAggregation(allDonations, pipeline, async (col) => {
      const databases = getAppwriteDatabases();
      const res = await databases.listDocuments(DATABASE_ID, col);
      return res.documents.map(d => ({ ...d, _id: d.$id }));
    });
  }

  static async create(data: Partial<DonationDocument>) {
    const databases = getAppwriteDatabases();
    const payload = {
      donationId: data.donationId,
      userId: data.userId,
      amount: data.amount,
      donationType: data.donationType,
      paymentStatus: data.paymentStatus || "pending",
      transactionId: data.transactionId || "",
      subscriptionId: data.subscriptionId || "",
      publicVisibility: data.publicVisibility || "private",
      publicDisplayName: data.publicDisplayName || "",
      supporterMessage: data.supporterMessage || "",
      showDonationPublicly: Boolean(data.showDonationPublicly),
    };

    const created = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.DONATIONS,
      ID.unique(),
      payload
    );
    return wrapDocument<DonationDocument>(created, (p) => updateDonationData(created.$id, p));
  }

  static findOneAndUpdate(filter: Record<string, any>, update: Record<string, any>, options: { new?: boolean; upsert?: boolean; runValidators?: boolean } = {}) {
    return new QueryPromise<DonationDocument | null>(
      (async () => {
        let doc = await Donation.findOne(filter);
        const databases = getAppwriteDatabases();
        const updatePayload = update.$set ? update.$set : update;
        if (doc) {
          const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.DONATIONS, doc.$id, updatePayload);
          return wrapDocument<DonationDocument>(updated, (p) => updateDonationData(updated.$id, p));
        } else if (options.upsert) {
          const created = await databases.createDocument(DATABASE_ID, COLLECTIONS.DONATIONS, ID.unique(), { ...filter, ...updatePayload });
          return wrapDocument<DonationDocument>(created, (p) => updateDonationData(created.$id, p));
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
        const docs = await Donation.find(filter);
        const databases = getAppwriteDatabases();
        const updatePayload = update.$set ? update.$set : update;
        const promises = docs.map((doc: any) =>
          databases.updateDocument(DATABASE_ID, COLLECTIONS.DONATIONS, doc.$id, updatePayload)
        );
        await Promise.all(promises);
        return { modifiedCount: docs.length };
      })()
    );
  }
}

export default Donation;
