import { getAppwriteDatabases, DATABASE_ID, COLLECTIONS } from "@/src/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { wrapDocument, QueryPromise } from "@/src/lib/modelHelper";

export interface CommitteeMemberDocument {
  _id: string;
  $id: string;
  memberId: string;
  name: string;
  designation: string;
  role: string;
  image: string;
  fileId?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  toObject: () => any;
  toJSON: () => any;
  save: () => Promise<CommitteeMemberDocument>;
}

async function updateCommitteeMemberData(docId: string, payload: any) {
  const databases = getAppwriteDatabases();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.COMMITTEE_MEMBERS, docId, payload);
}

export class CommitteeMember {
  static findOne(filter: Record<string, any>) {
    return new QueryPromise<CommitteeMemberDocument | null>(
      (async () => {
        const docs = await CommitteeMember.find(filter, { limit: 1 });
        return docs[0] || null;
      })()
    );
  }

  static findById(id: string) {
    return new QueryPromise<CommitteeMemberDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        try {
          const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.COMMITTEE_MEMBERS, id);
          return wrapDocument<CommitteeMemberDocument>(doc, (p) => updateCommitteeMemberData(doc.$id, p));
        } catch (e) {
          return null;
        }
      })()
    );
  }

  static find(filter: Record<string, any> = {}, options: { sort?: any; limit?: number; skip?: number } = {}) {
    return new QueryPromise<CommitteeMemberDocument[]>(
      (async () => {
        const databases = getAppwriteDatabases();
        const queries: string[] = [];

        if (filter.memberId) {
          queries.push(Query.equal("memberId", filter.memberId));
        }

        if (options.sort) {
          const sortKey = Object.keys(options.sort)[0];
          const dir = options.sort[sortKey];
          if (dir < 0) queries.push(Query.orderDesc(sortKey === "_id" ? "$createdAt" : sortKey));
          else queries.push(Query.orderAsc(sortKey === "_id" ? "$createdAt" : sortKey));
        } else {
          queries.push(Query.orderAsc("order"));
        }

        if (options.limit) queries.push(Query.limit(options.limit));
        if (options.skip) queries.push(Query.offset(options.skip));

        try {
          const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COMMITTEE_MEMBERS, queries);
          return res.documents.map((doc) => wrapDocument<CommitteeMemberDocument>(doc, (p) => updateCommitteeMemberData(doc.$id, p)));
        } catch (e) {
          return [];
        }
      })()
    );
  }

  static countDocuments(filter: Record<string, any> = {}) {
    return new QueryPromise<number>(
      (async () => {
        const databases = getAppwriteDatabases();
        const queries: string[] = [Query.limit(1)];
        try {
          const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COMMITTEE_MEMBERS, queries);
          return res.total;
        } catch (e) {
          return 0;
        }
      })()
    );
  }

  static create(payload: Partial<CommitteeMemberDocument>) {
    return (async () => {
      const databases = getAppwriteDatabases();
      const now = new Date().toISOString();
      const docData = {
        memberId: payload.memberId || ID.unique(),
        name: payload.name || "",
        designation: payload.designation || "Executive Member",
        role: payload.role || "Executive Committee",
        image: payload.image || "",
        fileId: payload.fileId || "",
        order: typeof payload.order === "number" ? payload.order : 1,
        createdAt: now,
        updatedAt: now,
      };
      const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.COMMITTEE_MEMBERS, ID.unique(), docData);
      return wrapDocument<CommitteeMemberDocument>(doc, (p) => updateCommitteeMemberData(doc.$id, p));
    })();
  }

  static findByIdAndUpdate(id: string, update: any, options: { new?: boolean } = {}) {
    return new QueryPromise<CommitteeMemberDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        const payload = update.$set ? { ...update.$set } : { ...update };
        delete payload._id;
        delete payload.$id;
        payload.updatedAt = new Date().toISOString();
        try {
          const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.COMMITTEE_MEMBERS, id, payload);
          return wrapDocument<CommitteeMemberDocument>(doc, (p) => updateCommitteeMemberData(doc.$id, p));
        } catch (e) {
          return null;
        }
      })()
    );
  }

  static findByIdAndDelete(id: string) {
    return (async () => {
      const databases = getAppwriteDatabases();
      try {
        const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.COMMITTEE_MEMBERS, id);
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.COMMITTEE_MEMBERS, id);
        return wrapDocument<CommitteeMemberDocument>(doc, () => Promise.resolve({} as any));
      } catch (e) {
        return null;
      }
    })();
  }
}

export default CommitteeMember;
