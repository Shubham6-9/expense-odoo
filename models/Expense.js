// models/Expense.js
import mongoose from "mongoose";

const ApprovalRecordSchema = new mongoose.Schema({
  approverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  decision: { type: String, enum: ["approved","rejected"], required: true },
  comment: String,
  step: Number,
  ts: { type: Date, default: Date.now }
}, { _id: false });

const ApprovalStepSchema = new mongoose.Schema({
  stepIndex: Number,
  approvers: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, notified: Boolean }],
  resolved: { type: Boolean, default: false },
  resolvedAt: Date
}, { _id: false });

const ExpenseSchema = new mongoose.Schema({
  submitter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  amountBase: Number,
  category: String,
  description: String,
  date: Date,
  attachments: [String],
  status: { type: String, enum: ["Draft","Submitted","Pending","Approved","Rejected","Paid"], default: "Draft" },
  approvalSteps: [ApprovalStepSchema],
  approvals: [ApprovalRecordSchema]
}, { timestamps: true });

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
