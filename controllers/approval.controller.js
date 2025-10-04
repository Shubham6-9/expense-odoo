// controllers/approvalRule.controller.js
import ApprovalRule from "../models/ApprovalRule.js";
// import User from "../models/User.js";

/**
 * Create a new approval rule (Admin only)
 * POST /approval-rules
 */
export async function createApprovalRule(req, res) {
  try {
    const { companyId } = req.user; // assume auth middleware attaches companyId
    const payload = {
      companyId,
      name: req.body.name,
      description: req.body.description,
      isManagerApprover: !!req.body.isManagerApprover,
      sequential: !!req.body.sequential,
      approvers: req.body.approvers || [],
      minApprovalPercentage: typeof req.body.minApprovalPercentage === "number" ? req.body.minApprovalPercentage : 0,
      specialApproverId: req.body.specialApproverId || null,
      createdBy: req.user.id
    };

    const rule = await ApprovalRule.create(payload);
    return res.status(201).json({ message: "Approval rule created", rule });
  } catch (err) {
    console.error("createApprovalRule error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET /approval-rules
 * List all rules for the user's company
 */
export async function listApprovalRules(req, res) {
  try {
    const { companyId } = req.user;
    const rules = await ApprovalRule.find({ companyId }).populate("approvers.user", "name email role").populate("specialApproverId", "name email");
    return res.json({ rules });
  } catch (err) {
    console.error("listApprovalRules error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET /approval-rules/:id
 */
export async function getApprovalRule(req, res) {
  try {
    const { companyId } = req.user;
    const { id } = req.params;
    const rule = await ApprovalRule.findOne({ _id: id, companyId }).populate("approvers.user", "name email");
    if (!rule) return res.status(404).json({ message: "Not found" });
    return res.json({ rule });
  } catch (err) {
    console.error("getApprovalRule error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * PATCH /approval-rules/:id
 */
export async function updateApprovalRule(req, res) {
  try {
    const { companyId } = req.user;
    const { id } = req.params;
    const updates = req.body;
    updates.updatedBy = req.user.id;

    const rule = await ApprovalRule.findOneAndUpdate({ _id: id, companyId }, updates, { new: true });
    if (!rule) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Updated", rule });
  } catch (err) {
    console.error("updateApprovalRule error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * DELETE /approval-rules/:id
 */
export async function deleteApprovalRule(req, res) {
  try {
    const { companyId } = req.user;
    const { id } = req.params;
    const rule = await ApprovalRule.findOneAndDelete({ _id: id, companyId });
    if (!rule) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteApprovalRule error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
