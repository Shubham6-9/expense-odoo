// models/ApprovalRule.js
import mongoose from "mongoose";

const ApproverSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  required: { type: Boolean, default: false },     // required approver (e.g., CFO)
  sequence: { type: Number, default: 0 }            // sequence order (1,2,3...) if sequential flow
}, { _id: false });

const ApprovalRuleSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  name: { type: String, required: true },           // e.g., "Miscellaneous expenses"
  description: { type: String, default: "" },

  // If true: first send to employee's manager (if manager relationship present)
  isManagerApprover: { type: Boolean, default: false },

  // If true then sequence matters (approvers with sequence 1 then 2...)
  sequential: { type: Boolean, default: false },

  // List of approvers (if not using manager-first)
  approvers: { type: [ApproverSchema], default: [] },

  // Percentage threshold: number between 0 and 1 (e.g. 0.6 => 60%)
  minApprovalPercentage: { type: Number, default: 0.0 },

  // If present: the special approver user id (e.g. CFO) whose approval forces auto-approve
  specialApproverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  // Behavior flags / metadata
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const ApprovalRule = mongoose.model("ApprovalRule", ApprovalRuleSchema);
export default ApprovalRule;
