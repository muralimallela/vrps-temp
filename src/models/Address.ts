import { getAppwriteDatabases, DATABASE_ID, COLLECTIONS } from "@/src/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { wrapDocument, QueryPromise } from "@/src/lib/modelHelper";

export interface AddressDocument {
  _id: string;
  $id: string;
  userId: string;
  state?: string;
  district?: string;
  mandal?: string;
  village?: string;
  street?: string;
  pincode?: string;
  createdAt?: string;
  updatedAt?: string;
  toObject: () => any;
  toJSON: () => any;
  save: () => Promise<AddressDocument>;
}

async function updateAddressData(docId: string, payload: any) {
  const databases = getAppwriteDatabases();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.ADDRESSES, docId, payload);
}

function matchFieldValue(val: any, target: any): boolean {
  if (target === undefined) return true;
  if (target && typeof target === "object") {
    if (target.$in !== undefined && Array.isArray(target.$in)) return target.$in.includes(val);
  }
  return val === target;
}

export class Address {
  static findOne(filter: Record<string, any>) {
    return new QueryPromise<AddressDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        if (filter._id) {
          try {
            const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.ADDRESSES, filter._id);
            return wrapDocument<AddressDocument>(doc, (p) => updateAddressData(doc.$id, p));
          } catch (e) {
            return null;
          }
        }
        const docs = await Address.find(filter, { limit: 1 });
        return docs[0] || null;
      })()
    );
  }

  static findById(id: string) {
    return this.findOne({ _id: id });
  }

  static find(filter: Record<string, any> = {}, options: { limit?: number; offset?: number } = {}) {
    return new QueryPromise<AddressDocument[]>(
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

        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ADDRESSES, queries);
        let results = response.documents.map((doc) =>
          wrapDocument<AddressDocument>(doc, (p) => updateAddressData(doc.$id, p))
        );

        for (const [key, val] of Object.entries(filter)) {
          if (val && typeof val === "object" && val.$in) {
            results = results.filter((item: any) => matchFieldValue(item[key], val));
          }
        }

        return results;
      })()
    );
  }

  static async create(data: Partial<AddressDocument>) {
    const databases = getAppwriteDatabases();
    const payload = {
      userId: data.userId,
      state: data.state || "",
      district: data.district || "",
      mandal: data.mandal || "",
      village: data.village || "",
      street: data.street || "",
      pincode: data.pincode || "",
    };
    const created = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.ADDRESSES,
      ID.unique(),
      payload
    );
    return wrapDocument<AddressDocument>(created, (p) => updateAddressData(created.$id, p));
  }

  static findOneAndUpdate(filter: Record<string, any>, update: Record<string, any>, options: { new?: boolean; upsert?: boolean } = {}) {
    return new QueryPromise<AddressDocument | null>(
      (async () => {
        let doc = await Address.findOne(filter);
        const databases = getAppwriteDatabases();
        const updatePayload = update.$set ? update.$set : update;
        if (doc) {
          const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.ADDRESSES, doc.$id, updatePayload);
          return wrapDocument<AddressDocument>(updated, (p) => updateAddressData(updated.$id, p));
        } else if (options.upsert) {
          const created = await databases.createDocument(DATABASE_ID, COLLECTIONS.ADDRESSES, ID.unique(), { ...filter, ...updatePayload });
          return wrapDocument<AddressDocument>(created, (p) => updateAddressData(created.$id, p));
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
        const docs = await Address.find(filter);
        const databases = getAppwriteDatabases();
        const updatePayload = update.$set ? update.$set : update;
        const promises = docs.map((doc: any) =>
          databases.updateDocument(DATABASE_ID, COLLECTIONS.ADDRESSES, doc.$id, updatePayload)
        );
        await Promise.all(promises);
        return { modifiedCount: docs.length };
      })()
    );
  }

  static deleteMany(filter: Record<string, any>) {
    return new QueryPromise<{ deletedCount: number }>(
      (async () => {
        const docs = await Address.find(filter);
        const databases = getAppwriteDatabases();
        const promises = docs.map((doc: any) =>
          databases.deleteDocument(DATABASE_ID, COLLECTIONS.ADDRESSES, doc.$id)
        );
        await Promise.all(promises);
        return { deletedCount: docs.length };
      })()
    );
  }
}

export default Address;
