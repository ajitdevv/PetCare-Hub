import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" }
  },
  { timestamps: true }
);

export const Complaint =
  mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);
