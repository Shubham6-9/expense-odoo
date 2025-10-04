// controllers/dashboardController.js
import User from "../models/User.js";
import Expense from "../models/Expense.js";
import ApprovalRule from "../models/ApprovalRule.js";

export async function getDashboard(req, res) {
  try {
    const userId = req.user.id; // from JWT
    const user = await User.findById(userId).populate("company");

    if (!user) return res.status(404).json({ message: "User not found" });

    let data = { user: { id: user.id, name: user.name, role: user.role, company: user.company.name } };

    if (user.role === "Employee") {
      data.myExpenses = await Expense.find({ submitter: user._id });
    }

    if (user.role === "Manager") {
      const team = await User.find({ manager: user._id });
      const teamIds = team.map(u => u._id);

      data.pendingApprovals = await Expense.find({ approvers: user._id, status: "Pending" });
      data.teamExpenses = await Expense.find({ submitter: { $in: teamIds } }).populate("submitter", "name");
    }

    if (user.role === "Admin") {
      data.companyUsers = await User.find({ company: user.company._id }).select("id name role");
      data.allExpenses = await Expense.find({ company: user.company._id }).populate("submitter", "name");
      data.approvalRules = await ApprovalRule.findOne({ companyId: user.company._id });
    }

    return res.json(data);
  } catch (err) {
    console.error("getDashboard error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default getDashboard;
