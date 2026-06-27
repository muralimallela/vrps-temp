export function wrapDocument<T extends Record<string, any>>(doc: any, updateFn?: (payload: any) => Promise<any>): T {
  if (!doc) return null as any;
  const wrapped: any = {
    ...doc,
    _id: doc._id || doc.$id,
    id: doc.id || doc._id || doc.$id,
  };

  wrapped.toObject = function () {
    const { save, toObject, toJSON, exec, lean, populate, select, ...plain } = this;
    return plain;
  };

  wrapped.toJSON = function () {
    return wrapped.toObject();
  };

  if (updateFn) {
    wrapped.save = async function () {
      const { _id, id, $id, $databaseId, $collectionId, $createdAt, $updatedAt, $permissions, save, toObject, toJSON, exec, lean, populate, select, ...payload } = this;
      const updated = await updateFn(payload);
      return wrapDocument(updated, updateFn);
    };
  } else {
    wrapped.save = async function () {
      return this;
    };
  }

  return wrapped as T;
}

export class QueryPromise<T> implements PromiseLike<T> {
  private promise: Promise<T>;

  constructor(promise: Promise<T>) {
    this.promise = promise;
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null
  ): Promise<T | TResult> {
    return this.promise.catch(onrejected);
  }

  finally(onfinally?: (() => void) | null): Promise<T> {
    return this.promise.finally(onfinally);
  }

  lean() {
    return new QueryPromise<T>(
      this.promise.then((res: any) => {
        if (Array.isArray(res)) {
          return res.map((item) => (item && typeof item.toObject === "function" ? item.toObject() : item)) as any;
        }
        if (res && typeof res.toObject === "function") {
          return res.toObject();
        }
        return res;
      })
    );
  }

  sort(_arg?: any) { return this; }
  limit(_arg?: number) { return this; }
  skip(_arg?: number) { return this; }
  select(_arg?: any) { return this; }
  populate(_arg?: any) { return this; }
  exec() { return this.promise; }
}

export async function evaluateAggregation(docs: any[], pipeline: any[], getCollectionDocs?: (collectionName: string) => Promise<any[]>): Promise<any[]> {
  let current = docs.map(d => (d && typeof d.toObject === "function" ? d.toObject() : { ...d }));

  for (const stage of pipeline) {
    if (stage.$match) {
      const filter = stage.$match;
      current = current.filter(doc => {
        return Object.entries(filter).every(([key, target]: [string, any]) => {
          const val = doc[key];
          if (target && typeof target === "object" && !Array.isArray(target)) {
            if (target.$gte !== undefined && new Date(val) < new Date(target.$gte)) return false;
            if (target.$lt !== undefined && new Date(val) >= new Date(target.$lt)) return false;
            if (target.$in !== undefined && Array.isArray(target.$in) && !target.$in.includes(val)) return false;
            if (target.$eq !== undefined && val !== target.$eq) return false;
            if (target.$ne !== undefined && val === target.$ne) return false;
            return true;
          }
          return val === target;
        });
      });
    } else if (stage.$group) {
      const groupSpec = stage.$group;
      const groups = new Map<string, any>();
      for (const doc of current) {
        let groupKey = "null";
        if (groupSpec._id) {
          if (typeof groupSpec._id === "string" && groupSpec._id.startsWith("$")) {
            groupKey = String(doc[groupSpec._id.slice(1)] ?? "null");
          } else if (typeof groupSpec._id === "object") {
            const keysObj: any = {};
            for (const [k, v] of Object.entries(groupSpec._id)) {
              if (typeof v === "string" && v.startsWith("$")) {
                if (v === "$year" || v === "$month") {
                  groupKey += "_" + k;
                } else {
                  keysObj[k] = doc[v.slice(1)];
                }
              }
            }
            groupKey = JSON.stringify(keysObj);
          }
        }
        if (!groups.has(groupKey)) {
          groups.set(groupKey, { _id: groupSpec._id === null ? null : groupKey, _docs: [] });
        }
        groups.get(groupKey)._docs.push(doc);
      }
      const groupedResults: any[] = [];
      for (const [_, grp] of groups.entries()) {
        const resultDoc: any = { _id: grp._id };
        for (const [field, expr] of Object.entries(groupSpec)) {
          if (field === "_id") continue;
          if (expr && typeof expr === "object") {
            const e = expr as any;
            if (e.$sum !== undefined) {
              if (typeof e.$sum === "number") {
                resultDoc[field] = grp._docs.length * e.$sum;
              } else if (typeof e.$sum === "string" && e.$sum.startsWith("$")) {
                const fieldName = e.$sum.slice(1);
                resultDoc[field] = grp._docs.reduce((acc: number, d: any) => acc + (Number(d[fieldName]) || 0), 0);
              } else if (e.$sum.$cond) {
                const [condArr, trueVal, falseVal] = e.$sum.$cond;
                resultDoc[field] = grp._docs.reduce((acc: number, d: any) => {
                  const isMatch = d[condArr[0].slice(1)] === condArr[1];
                  return acc + (isMatch ? trueVal : falseVal);
                }, 0);
              }
            }
          }
        }
        groupedResults.push(resultDoc);
      }
      current = groupedResults;
    } else if (stage.$count) {
      const fieldName = stage.$count;
      current = [{ [fieldName]: current.length }];
    } else if (stage.$lookup && getCollectionDocs) {
      const { from, localField, foreignField, as } = stage.$lookup;
      const foreignDocs = await getCollectionDocs(from);
      const foreignMap = new Map();
      foreignDocs.forEach(fd => {
        const key = String(fd[foreignField] || fd._id || fd.$id);
        if (!foreignMap.has(key)) foreignMap.set(key, []);
        foreignMap.get(key).push(fd);
      });
      current = current.map(doc => ({
        ...doc,
        [as]: foreignMap.get(String(doc[localField])) || [],
      }));
    } else if (stage.$unwind) {
      const targetField = typeof stage.$unwind === "string" ? stage.$unwind.slice(1) : stage.$unwind.path.slice(1);
      const preserve = typeof stage.$unwind === "object" && stage.$unwind.preserveNullAndEmptyArrays;
      const unwound: any[] = [];
      for (const doc of current) {
        const arr = doc[targetField];
        if (Array.isArray(arr) && arr.length > 0) {
          arr.forEach(item => unwound.push({ ...doc, [targetField]: item }));
        } else if (preserve) {
          unwound.push({ ...doc, [targetField]: null });
        }
      }
      current = unwound;
    } else if (stage.$project) {
      const proj = stage.$project;
      current = current.map(doc => {
        const pDoc: any = {};
        for (const [k, v] of Object.entries(proj)) {
          if (v === 1 || v === true) {
            pDoc[k] = doc[k];
          } else if (typeof v === "string" && v.startsWith("$")) {
            pDoc[k] = doc[v.slice(1)];
          }
        }
        return pDoc;
      });
    } else if (stage.$skip) {
      current = current.slice(stage.$skip);
    } else if (stage.$limit) {
      current = current.slice(0, stage.$limit);
    }
  }

  return current;
}
