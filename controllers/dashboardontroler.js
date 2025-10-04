// controllers/dashboardController.js
import User from "../models/User.js";
import CompanyAdmin from "../models/companyAdmin.model.js";
import Company from "../models/Company.js";
import Expense from "../models/Expense.js";
import ApprovalRule from "../models/ApprovalRule.js";

// Dashboard for Company Admin (CompanyAdmin model)
export async function getAdminDashboard(req, res) {
  try {
    const adminId = req.adminId; // from admin auth middleware

    // Get admin details
    const admin = await CompanyAdmin.findById(adminId).select("-passwordHash");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Get company details
    const company = await Company.findOne({ admin: adminId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Get all users created by this admin's company
    const users = await User.find({ company: company._id })
      .select("name email role manager createdAt mustChangePassword")
      .populate("manager", "name")
      .sort({ createdAt: -1 });

    // Get user statistics
    const userStats = {
      total: users.length,
      byRole: {
        Admin: users.filter((u) => u.role === "Admin").length,
        Manager: users.filter((u) => u.role === "Manager").length,
        Employee: users.filter((u) => u.role === "Employee").length,
      },
      newThisMonth: users.filter((u) => {
        const now = new Date();
        const userDate = new Date(u.createdAt);
        return (
          userDate.getMonth() === now.getMonth() &&
          userDate.getFullYear() === now.getFullYear()
        );
      }).length,
      pendingPasswordChange: users.filter((u) => u.mustChangePassword).length,
    };

    // Get recent users (last 5)
    const recentUsers = users.slice(0, 5);

    // Get approval rules if any
    const approvalRules = await ApprovalRule.find({ companyId: company._id });

    // Get expenses if any (for future use)
    const expenses = await Expense.find({ company: company._id })
      .populate("submitter", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    const dashboardData = {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        countryCode: admin.countryCode,
        currencyCode: admin.currencyCode,
        currencySign: admin.currencySign,
        createdAt: admin.createdAt,
      },
      company: {
        id: company._id,
        name: company.name,
        countryCode: company.countryCode,
        currencyCode: company.currencyCode,
        currencySign: company.currencySign,
        isActive: company.isActive,
        createdAt: company.createdAt,
      },
      statistics: {
        users: userStats,
        expenses: {
          total: expenses.length,
          recent: expenses.slice(0, 5),
        },
        approvalRules: approvalRules.length,
      },
      users: {
        all: users,
        recent: recentUsers,
      },
    };

    return res.status(200).json({
      message: "Admin dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (err) {
    console.error("getAdminDashboard error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Dashboard for Regular Users (User model)
export async function getUserDashboard(req, res) {
  try {
    const userId = req.user.id; // from user auth middleware
    const user = await User.findById(userId).populate("company manager");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let dashboardData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
        manager: user.manager,
        mustChangePassword: user.mustChangePassword,
        createdAt: user.createdAt,
      },
    };

    // Role-specific data
    if (user.role === "Employee") {
      const myExpenses = await Expense.find({ submitter: user._id })
        .sort({ createdAt: -1 })
        .limit(10);

      dashboardData.myExpenses = myExpenses;
      dashboardData.statistics = {
        totalExpenses: myExpenses.length,
        pendingExpenses: myExpenses.filter((e) => e.status === "Pending")
          .length,
        approvedExpenses: myExpenses.filter((e) => e.status === "Approved")
          .length,
        rejectedExpenses: myExpenses.filter((e) => e.status === "Rejected")
          .length,
      };
    }

    if (user.role === "Manager") {
      const team = await User.find({ manager: user._id }).select(
        "name email role createdAt"
      );

      const teamIds = team.map((u) => u._id);
      const pendingApprovals = await Expense.find({
        approvers: user._id,
        status: "Pending",
      }).populate("submitter", "name email");

      const teamExpenses = await Expense.find({
        submitter: { $in: teamIds },
      })
        .populate("submitter", "name email")
        .sort({ createdAt: -1 })
        .limit(10);

      dashboardData.team = team;
      dashboardData.pendingApprovals = pendingApprovals;
      dashboardData.teamExpenses = teamExpenses;
      dashboardData.statistics = {
        teamSize: team.length,
        pendingApprovals: pendingApprovals.length,
        teamExpenses: teamExpenses.length,
      };
    }

    if (user.role === "Admin") {
      const companyUsers = await User.find({ company: user.company._id })
        .select("name email role manager createdAt mustChangePassword")
        .populate("manager", "name")
        .sort({ createdAt: -1 });

      const allExpenses = await Expense.find({ company: user.company._id })
        .populate("submitter", "name email")
        .sort({ createdAt: -1 })
        .limit(10);

      const approvalRules = await ApprovalRule.find({
        companyId: user.company._id,
      });

      dashboardData.companyUsers = companyUsers;
      dashboardData.allExpenses = allExpenses;
      dashboardData.approvalRules = approvalRules;
      dashboardData.statistics = {
        totalUsers: companyUsers.length,
        usersByRole: {
          Admin: companyUsers.filter((u) => u.role === "Admin").length,
          Manager: companyUsers.filter((u) => u.role === "Manager").length,
          Employee: companyUsers.filter((u) => u.role === "Employee").length,
        },
        totalExpenses: allExpenses.length,
        approvalRules: approvalRules.length,
      };
    }

    return res.status(200).json({
      message: "User dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (err) {
    console.error("getUserDashboard error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Legacy function for backward compatibility
export async function getDashboard(req, res) {
  try {
    // Check if this is an admin request (has adminId) or user request (has user)
    if (req.adminId) {
      return getAdminDashboard(req, res);
    } else if (req.user) {
      return getUserDashboard(req, res);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.error("getDashboard error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default getDashboard;
