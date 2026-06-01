import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const MEMBERSHIP_STATUSES = [
  "pending",
  "active",
  "expired",
  "suspended",
] as const;

const MembershipSchema = new Schema(
  {
    membershipId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    membershipFee: { type: Number, required: true },
    startDate: { type: Date, default: null },
    status: {
      type: String,
      enum: MEMBERSHIP_STATUSES,
      default: "pending",
      index: true,
    },
    paymentId: { type: String, default: "", index: true },
  },
  { timestamps: true }
);

MembershipSchema.index({ status: 1, createdAt: -1 });

export type MembershipDocument = InferSchemaType<typeof MembershipSchema>;

export default mongoose.models.Membership ||
  mongoose.model("Membership", MembershipSchema);

