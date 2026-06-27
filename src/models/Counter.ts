import { getAppwriteDatabases, DATABASE_ID, COLLECTIONS } from "@/src/lib/appwrite";
import { Query, ID } from "node-appwrite";
import { wrapDocument, QueryPromise } from "@/src/lib/modelHelper";

export interface CounterDocument {
  _id: string;
  $id: string;
  name: string;
  value: number;
  toObject: () => any;
  toJSON: () => any;
  save: () => Promise<CounterDocument>;
}

async function updateCounterData(docId: string, payload: any) {
  const databases = getAppwriteDatabases();
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.COUNTERS, docId, payload);
}

export class Counter {
  static find(filter: Record<string, any> = {}) {
    return new QueryPromise<CounterDocument[]>(
      (async () => {
        const databases = getAppwriteDatabases();
        const queries: string[] = [];
        for (const [key, val] of Object.entries(filter)) {
          if (val !== undefined && val !== null && typeof val !== "object") {
            queries.push(Query.equal(key, val));
          }
        }
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COUNTERS, queries);
        return response.documents.map((doc) =>
          wrapDocument<CounterDocument>(doc, (p) => updateCounterData(doc.$id, p))
        );
      })()
    );
  }

  static findOneAndUpdate(
    query: { name: string },
    update: { $inc?: { value: number }; value?: number },
    options?: { new?: boolean; upsert?: boolean }
  ) {
    return new QueryPromise<CounterDocument | null>(
      (async () => {
        const databases = getAppwriteDatabases();
        const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COUNTERS, [
          Query.equal("name", query.name),
          Query.limit(1),
        ]);

        let doc = response.documents[0];
        if (doc) {
          let newValue = doc.value;
          if (update.$inc && typeof update.$inc.value === "number") {
            newValue += update.$inc.value;
          } else if (typeof update.value === "number") {
            newValue = update.value;
          }
          const updatedDoc = await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.COUNTERS,
            doc.$id,
            { value: newValue }
          );
          return wrapDocument<CounterDocument>(updatedDoc, (p) => updateCounterData(updatedDoc.$id, p));
        } else if (options?.upsert) {
          let initialValue = 1;
          if (update.$inc && typeof update.$inc.value === "number") {
            initialValue = update.$inc.value;
          } else if (typeof update.value === "number") {
            initialValue = update.value;
          }
          const createdDoc = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.COUNTERS,
            ID.unique(),
            { name: query.name, value: initialValue }
          );
          return wrapDocument<CounterDocument>(createdDoc, (p) => updateCounterData(createdDoc.$id, p));
        }
        return null;
      })()
    );
  }
}

export default Counter;
