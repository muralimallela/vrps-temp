import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const DONATION_TYPES = ["one_time", "monthly"] as const;
export const PAYMENT_STATUSES = [
  "pending",
  "success",
  "failed",
  "cancelled",
] as const;

const DonationSchema = new Schema(
  {
    donationId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    donationType: {
      type: String,
      enum: DONATION_TYPES,
      required: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "pending",
      index: true,
    },
    transactionId: { type: String, default: "", index: true },
    subscriptionId: { type: String, default: "", index: true },
    // Public visibility preferences
    publicVisibility: {
      type: String,
      enum: ["private", "public", "anonymous"],
      default: "private",
      index: true,
    },
    publicDisplayName: { type: String, default: "" },
    supporterMessage: { type: String, default: "" },
    showDonationPublicly: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

DonationSchema.index({ donationType: 1, paymentStatus: 1, createdAt: -1 });

export type DonationDocument = InferSchemaType<typeof DonationSchema>;

export default mongoose.models.Donation ||
  mongoose.model("Donation", DonationSchema);

