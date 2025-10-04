// services/rulesEngine.js
/**
 * Evaluate whether a given approval step is considered approved based on rule.
 *
 * Parameters:
 * - rule: ApprovalRule mongoose doc
 * - stepApprovers: array of userIds participating in current step
 * - approvalsForStep: array of approval records for this step: [{ approverId, decision }] (decision = 'approved'|'rejected')
 *
 * Returns:
 *  { stepApproved: boolean, stepRejected: boolean, reason: string }
 */
export function evaluateStep(rule, stepApprovers = [], approvalsForStep = []) {
  // Normalize
  const total = stepApprovers.length;
  const approvals = approvalsForStep.filter(a => a.decision === "approved").length;
  const rejects = approvalsForStep.filter(a => a.decision === "rejected").length;

  // 1) Special approver rule: if any approval by specialApproverId -> auto approve
  if (rule.specialApproverId) {
    const specialApproved = approvalsForStep.some(a => String(a.approverId) === String(rule.specialApproverId) && a.decision === "approved");
    if (specialApproved) return { stepApproved: true, stepRejected: false, reason: "special approver approved" };
  }

  // 2) If an approver marked required and they rejected -> immediate reject
  const requiredApproverIds = (rule.approvers || []).filter(p => p.required).map(p => String(p.user));
  const requiredRejected = approvalsForStep.some(a => requiredApproverIds.includes(String(a.approverId)) && a.decision === "rejected");
  if (requiredRejected) return { stepApproved: false, stepRejected: true, reason: "required approver rejected" };

  // 3) Percentage rule
  if (rule.minApprovalPercentage && rule.minApprovalPercentage > 0) {
    // If total === 0 use approvals 0 -> cannot approve
    const pct = total > 0 ? approvals / total : 0;
    if (pct >= rule.minApprovalPercentage) {
      return { stepApproved: true, stepRejected: false, reason: `threshold ${rule.minApprovalPercentage} met (${pct})` };
    }
    // If rejects exceed allowed (optional) we might reject early - not implemented here
  }

  // 4) If sequential and all approvers acted and all approved -> approve
  if (rule.sequential) {
    // check if every approver for the step who responded approved and no rejects
    const actedCount = approvalsForStep.length;
    const hasReject = approvalsForStep.some(a => a.decision === "rejected");
    if (!hasReject && actedCount === total && approvals === total) {
      return { stepApproved: true, stepRejected: false, reason: "all approvers approved in sequential step" };
    }
  } else {
    // Not sequential: if all approvers approved -> approve
    const hasReject = approvalsForStep.some(a => a.decision === "rejected");
    if (!hasReject && approvals === total && total > 0) {
      return { stepApproved: true, stepRejected: false, reason: "all approvers approved (parallel)" };
    }
  }

  return { stepApproved: false, stepRejected: false, reason: "no condition met yet" };
}
