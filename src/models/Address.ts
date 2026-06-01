import mongoose, { Schema, type InferSchemaType } from "mongoose";

const AddressSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    state: { type: String, default: "", index: true },
    district: { type: String, default: "", index: true },
    mandal: { type: String, default: "", index: true },
    village: { type: String, default: "", index: true },
    street: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  { timestamps: true }
);

AddressSchema.index({ state: 1, district: 1, mandal: 1, village: 1 });

export type AddressDocument = InferSchemaType<typeof AddressSchema>;

export default mongoose.models.Address ||
  mongoose.model("Address", AddressSchema);

