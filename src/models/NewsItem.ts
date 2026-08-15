import { getAppwriteDatabases, DATABASE_ID, COLLECTIONS } from "@/src/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { wrapDocument, QueryPromise } from "@/src/lib/modelHelper";

export interface NewsItemDocument {
  _id: string;
  $id: string;
  newsId: string;
  title: string;
  category: string;
  date: string;
  src: string;
  fileId?: string;
  createdAt?: string;
  updatedAt?: string;
  toObject: () => any;
  toJSON: () => any;
  save: () => Promise<NewsItemDocument>;
}

async function updateNewsItemData(docId: string, payload: any) {
  const databases = getAppwriteDatabases();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.NEWS_ITEMS, docId, payload);
}

export class NewsItem {
  static findOne(filter: Record<string, any>) {
    return new QueryPromise<NewsItemDocument | null>(
      (async () => {
        const docs = await NewsItem.find(filter, { limit: 1 });
        return docs[0] || null;
      })()
    );
  }

  static findById(id: string) {
    return new QueryPromise<NewsItemDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        try {
          const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.NEWS_ITEMS, id);
          return wrapDocument<NewsItemDocument>(doc, (p) => updateNewsItemData(doc.$id, p));
        } catch (e) {
          return null;
        }
      })()
    );
  }

  static find(filter: Record<string, any> = {}, options: { sort?: any; limit?: number; skip?: number } = {}) {
    return new QueryPromise<NewsItemDocument[]>(
      (async () => {
        const databases = getAppwriteDatabases();
        const queries: string[] = [];

        if (filter.category && filter.category !== "All") {
          queries.push(Query.equal("category", filter.category));
        }
        if (filter.newsId) {
          queries.push(Query.equal("newsId", filter.newsId));
        }

        if (options.sort) {
          const sortKey = Object.keys(options.sort)[0];
          const dir = options.sort[sortKey];
          if (dir < 0) queries.push(Query.orderDesc(sortKey === "_id" ? "$createdAt" : sortKey));
          else queries.push(Query.orderAsc(sortKey === "_id" ? "$createdAt" : sortKey));
        } else {
          queries.push(Query.orderDesc("$createdAt"));
        }

        if (options.limit) queries.push(Query.limit(options.limit));
        if (options.skip) queries.push(Query.offset(options.skip));

        try {
          const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.NEWS_ITEMS, queries);
          return res.documents.map((doc) => wrapDocument<NewsItemDocument>(doc, (p) => updateNewsItemData(doc.$id, p)));
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
        if (filter.category && filter.category !== "All") queries.push(Query.equal("category", filter.category));
        try {
          const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.NEWS_ITEMS, queries);
          return res.total;
        } catch (e) {
          return 0;
        }
      })()
    );
  }

  static create(payload: Partial<NewsItemDocument>) {
    return (async () => {
      const databases = getAppwriteDatabases();
      const now = new Date().toISOString();
      const docData = {
        newsId: payload.newsId || ID.unique(),
        title: payload.title || "",
        category: payload.category || "Events",
        date: payload.date || "",
        src: payload.src || "",
        fileId: payload.fileId || "",
        createdAt: now,
        updatedAt: now,
      };
      const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.NEWS_ITEMS, ID.unique(), docData);
      return wrapDocument<NewsItemDocument>(doc, (p) => updateNewsItemData(doc.$id, p));
    })();
  }

  static findByIdAndUpdate(id: string, update: any, options: { new?: boolean } = {}) {
    return new QueryPromise<NewsItemDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        const payload = update.$set ? { ...update.$set } : { ...update };
        delete payload._id;
        delete payload.$id;
        payload.updatedAt = new Date().toISOString();
        try {
          const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.NEWS_ITEMS, id, payload);
          return wrapDocument<NewsItemDocument>(doc, (p) => updateNewsItemData(doc.$id, p));
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
        const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.NEWS_ITEMS, id);
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.NEWS_ITEMS, id);
        return wrapDocument<NewsItemDocument>(doc, () => Promise.resolve({} as any));
      } catch (e) {
        return null;
      }
    })();
  }
}

export default NewsItem;
