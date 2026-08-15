import { getAppwriteDatabases, DATABASE_ID, COLLECTIONS } from "@/src/lib/appwrite";
import { ID, Query } from "node-appwrite";
import { wrapDocument, QueryPromise } from "@/src/lib/modelHelper";

export interface GalleryItemDocument {
  _id: string;
  $id: string;
  galleryId: string;
  title: string;
  category: string;
  date: string;
  location?: string;
  description?: string;
  src: string;
  fileId?: string;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  toObject: () => any;
  toJSON: () => any;
  save: () => Promise<GalleryItemDocument>;
}

async function updateGalleryItemData(docId: string, payload: any) {
  const databases = getAppwriteDatabases();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.GALLERY_ITEMS, docId, payload);
}

export class GalleryItem {
  static findOne(filter: Record<string, any>) {
    return new QueryPromise<GalleryItemDocument | null>(
      (async () => {
        const docs = await GalleryItem.find(filter, { limit: 1 });
        return docs[0] || null;
      })()
    );
  }

  static findById(id: string) {
    return new QueryPromise<GalleryItemDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        try {
          const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.GALLERY_ITEMS, id);
          return wrapDocument<GalleryItemDocument>(doc, (p) => updateGalleryItemData(doc.$id, p));
        } catch (e) {
          return null;
        }
      })()
    );
  }

  static find(filter: Record<string, any> = {}, options: { sort?: any; limit?: number; skip?: number } = {}) {
    return new QueryPromise<GalleryItemDocument[]>(
      (async () => {
        const databases = getAppwriteDatabases();
        const queries: string[] = [];

        if (filter.category && filter.category !== "All") {
          queries.push(Query.equal("category", filter.category));
        }
        if (filter.galleryId) {
          queries.push(Query.equal("galleryId", filter.galleryId));
        }
        if (typeof filter.featured === "boolean") {
          queries.push(Query.equal("featured", filter.featured));
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
          const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.GALLERY_ITEMS, queries);
          return res.documents.map((doc) =>
            wrapDocument<GalleryItemDocument>(doc, (p) => updateGalleryItemData(doc.$id, p))
          );
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
          const res = await databases.listDocuments(DATABASE_ID, COLLECTIONS.GALLERY_ITEMS, queries);
          return res.total;
        } catch (e) {
          return 0;
        }
      })()
    );
  }

  static create(payload: Partial<GalleryItemDocument>) {
    return (async () => {
      const databases = getAppwriteDatabases();
      const now = new Date().toISOString();
      const docData = {
        galleryId: payload.galleryId || ID.unique(),
        title: payload.title || "",
        category: payload.category || "Conventions",
        date: payload.date || "",
        location: payload.location || "",
        description: payload.description || "",
        src: payload.src || "",
        fileId: payload.fileId || "",
        featured: Boolean(payload.featured),
        createdAt: now,
        updatedAt: now,
      };
      const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.GALLERY_ITEMS, ID.unique(), docData);
      return wrapDocument<GalleryItemDocument>(doc, (p) => updateGalleryItemData(doc.$id, p));
    })();
  }

  static findByIdAndUpdate(id: string, update: any, options: { new?: boolean } = {}) {
    return new QueryPromise<GalleryItemDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        const payload = update.$set ? { ...update.$set } : { ...update };
        delete payload._id;
        delete payload.$id;
        payload.updatedAt = new Date().toISOString();
        try {
          const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.GALLERY_ITEMS, id, payload);
          return wrapDocument<GalleryItemDocument>(doc, (p) => updateGalleryItemData(doc.$id, p));
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
        const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.GALLERY_ITEMS, id);
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.GALLERY_ITEMS, id);
        return wrapDocument<GalleryItemDocument>(doc, () => Promise.resolve({} as any));
      } catch (e) {
        return null;
      }
    })();
  }
}

export default GalleryItem;
