import { getAppwriteDatabases, DATABASE_ID, COLLECTIONS } from "@/src/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { wrapDocument, QueryPromise, evaluateAggregation } from "@/src/lib/modelHelper";

export interface UserDocument {
  _id: string;
  $id: string;
  clerkUserId: string;
  userId: string;
  membershipId?: string | null;
  name: string;
  mobile?: string;
  email?: string;
  photoUrl?: string;
  isMember?: boolean;
  memberSince?: string | Date | null;
  addressId?: string | null;
  publicVisibility?: "private" | "public" | "anonymous";
  publicDisplayName?: string;
  showMembershipPublically?: boolean;
  showDonationPublicly?: boolean;
  isDeleted?: boolean;
  deletedAt?: string | Date | null;
  roles?: string[];
  createdAt?: string;
  updatedAt?: string;
  toObject: () => any;
  toJSON: () => any;
  save: () => Promise<UserDocument>;
}

async function updateUserData(docId: string, payload: any) {
  const databases = getAppwriteDatabases();
  if (payload.memberSince instanceof Date) payload.memberSince = payload.memberSince.toISOString();
  if (payload.deletedAt instanceof Date) payload.deletedAt = payload.deletedAt.toISOString();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, docId, payload);
}

function matchFieldValue(val: any, target: any): boolean {
  if (target === undefined) return true;
  if (target && typeof target === "object") {
    if (target.$ne !== undefined) return val !== target.$ne;
    if (target.$in !== undefined && Array.isArray(target.$in)) return target.$in.includes(val);
    if (target.$regex !== undefined) {
      const reg = new RegExp(target.$regex, target.$options || "i");
      return reg.test(String(val || ""));
    }
  }
  return val === target;
}

export class User {
  static findOne(filter: Record<string, any>) {
    return new QueryPromise<UserDocument | null>(
      (async () => {
        const docs = await User.find(filter, { limit: 1 });
        return docs[0] || null;
      })()
    );
  }

  static findById(id: string) {
    return new QueryPromise<UserDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        try {
          const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.USERS, id);
          return wrapDocument<UserDocument>(doc, (p) => updateUserData(doc.$id, p));
        } catch (e) {
          return null;
        }
      })()
    );
  }

  static find(filter: Record<string, any> = {}, options: { limit?: number; offset?: number } = {}) {
    return new QueryPromise<UserDocument[]>(
      (async () => {
        const databases = getAppwriteDatabases();
        const queries: string[] = [];

        const hasInMemoryFilter = Boolean(filter.$or || filter.isDeleted || filter.userId);

        for (const [key, val] of Object.entries(filter)) {
          if (key === "$or" || key === "$ne" || key === "$in") continue;
          if (val !== undefined && val !== null && typeof val !== "object") {
            queries.push(Query.equal(key, val));
          }
        }

        if (!hasInMemoryFilter && options.limit) {
          queries.push(Query.limit(options.limit));
        } else {
          queries.push(Query.limit(100)); // Fetch enough documents for in-memory filtering
        }

        if (!hasInMemoryFilter && options.offset) {
          queries.push(Query.offset(options.offset));
        }

        queries.push(Query.orderDesc("$createdAt"));

        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.USERS, queries);
        let results = response.documents.map((doc) =>
          wrapDocument<UserDocument>(doc, (p) => updateUserData(doc.$id, p))
        );

        if (filter.userId && typeof filter.userId === "object") {
          results = results.filter((u) => matchFieldValue(u.userId, filter.userId));
        }

        if (filter.isDeleted && typeof filter.isDeleted === "object") {
          results = results.filter((u) => matchFieldValue(u.isDeleted, filter.isDeleted));
        }

        if (filter.$or && Array.isArray(filter.$or)) {
          results = results.filter((u) =>
            filter.$or.some((cond: Record<string, any>) =>
              Object.entries(cond).every(([k, v]) => matchFieldValue((u as any)[k], v))
            )
          );
        }

        if (hasInMemoryFilter) {
          const offset = options.offset || 0;
          const limit = options.limit || results.length;
          results = results.slice(offset, offset + limit);
        }

        return results;
      })()
    );
  }

  static countDocuments(filter: Record<string, any> = {}) {
    return new QueryPromise<number>(
      (async () => {
        const docs = await User.find(filter);
        return docs.length;
      })()
    );
  }

  static async aggregate(pipeline: any[]) {
    const allUsers = await User.find({});
    return evaluateAggregation(allUsers, pipeline, async (col) => {
      const databases = getAppwriteDatabases();
      const res = await databases.listDocuments(DATABASE_ID, col);
      return res.documents.map(d => ({ ...d, _id: d.$id }));
    });
  }

  static async create(data: Partial<UserDocument>) {
    const databases = getAppwriteDatabases();
    const payload: Record<string, any> = {
      clerkUserId: data.clerkUserId,
      userId: data.userId,
      name: data.name,
      mobile: data.mobile || "",
      email: data.email || "",
      photoUrl: data.photoUrl || "",
      isMember: Boolean(data.isMember),
      publicVisibility: data.publicVisibility || "private",
      publicDisplayName: data.publicDisplayName || "",
      showMembershipPublically: Boolean(data.showMembershipPublically),
      isDeleted: Boolean(data.isDeleted),
      roles: Array.isArray(data.roles) ? data.roles : ["user"],
    };
    if (data.membershipId) payload.membershipId = data.membershipId;
    if (data.addressId) payload.addressId = data.addressId;
    if (data.memberSince) payload.memberSince = data.memberSince instanceof Date ? data.memberSince.toISOString() : data.memberSince;
    if (data.deletedAt) payload.deletedAt = data.deletedAt instanceof Date ? data.deletedAt.toISOString() : data.deletedAt;

    const created = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.USERS,
      ID.unique(),
      payload
    );
    return wrapDocument<UserDocument>(created, (p) => updateUserData(created.$id, p));
  }

  static findOneAndUpdate(filter: Record<string, any>, update: Record<string, any>, options: { new?: boolean; upsert?: boolean; runValidators?: boolean } = {}) {
    return new QueryPromise<UserDocument | null>(
      (async () => {
        let doc = await User.findOne(filter);
        const databases = getAppwriteDatabases();
        const updatePayload = update.$set ? update.$set : update;
        if (doc) {
          const updated = await databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, doc.$id, updatePayload);
          return wrapDocument<UserDocument>(updated, (p) => updateUserData(updated.$id, p));
        } else if (options.upsert) {
          const created = await databases.createDocument(DATABASE_ID, COLLECTIONS.USERS, ID.unique(), { ...filter, ...updatePayload });
          return wrapDocument<UserDocument>(created, (p) => updateUserData(created.$id, p));
        }
        return null;
      })()
    );
  }

  static updateOne(filter: Record<string, any>, update: Record<string, any>) {
    return this.findOneAndUpdate(filter, update);
  }
}

export default User;
