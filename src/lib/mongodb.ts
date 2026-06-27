// lib/mongodb.ts (Appwrite Compatibility Wrapper)
export const connectDB = async () => {
  // Appwrite connection is handled via HTTP REST API client; no persistent connection state needed.
  return Promise.resolve();
};
