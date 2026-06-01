import mongoose, { Schema, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, unique: true, index: true },
    membershipId: { type: String, default: null, index: true },
    name: { type: String, required: true, trim: true, index: true },
    mobile: { type: String, default: "", index: true },
    email: { type: String, default: "", index: true },
    photoUrl: { type: String, default: "" },
    isMember: { type: Boolean, default: false, index: true },
    memberSince: { type: Date, default: null },
    addressId: { type: Schema.Types.ObjectId, ref: "Address", default: null },
    // Public visibility preferences
    publicVisibility: {
      type: String,
      enum: ["private", "public", "anonymous"],
      default: "private",
      index: true,
    },
    publicDisplayName: { type: String, default: "" },
    showMembershipPublically: { type: Boolean, default: false, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null, index: true },
    roles: {
      type: [String],
      enum: ["user", "admin"],
      default: ["user"],
      index: true,
    },
  },
  { timestamps: true }
);

UserSchema.index({ name: 1, mobile: 1, userId: 1 });

export type UserDocument = InferSchemaType<typeof UserSchema>;

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
