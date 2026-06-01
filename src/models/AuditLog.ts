import mongoose, { Schema, type InferSchemaType } from "mongoose";

const AuditLogSchema = new Schema(
  {
    entityType: { type: String, required: true, index: true },
    entityId: { type: String, required: true, index: true },
    action: { type: String, required: true },
    before: { type: Schema.Types.Mixed, default: null },
    after: { type: Schema.Types.Mixed, default: null },
    actorUserId: { type: String, default: "" },
    source: { type: String, enum: ["api", "webhook", "admin"], required: true },
  },
  { timestamps: true }
);

AuditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export type AuditLogDocument = InferSchemaType<typeof AuditLogSchema>;

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", AuditLogSchema);

