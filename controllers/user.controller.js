// controllers/user.controller.js
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
// import Company from "../models/Company.js";
// import { sendMail } from "../utils/mailer.js"; // your SendGrid/sendmail wrapper
import mongoose from "mongoose";

const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);

/**
 * POST /users
 * Admin creates a new user for their company.
 * Body: { name, email, role, managerId (optional) }
 */
export async function createUser(req, res) {
  try {
    const creator = req.user; // from auth middleware
    if (!creator) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get the company ID from the user's company field
    const companyId = creator.company?._id || creator.company;
    if (!companyId) {
      return res
        .status(401)
        .json({ message: "User not associated with any company" });
    }

    const { name, email, role = "Employee", managerId = null } = req.body;

    // basic validation
    if (!name || !email)
      return res.status(400).json({ message: "name and email are required" });
    const normalizedEmail = String(email).toLowerCase().trim();

    // Check role allowed values
    const roles = ["Admin", "Manager", "Employee"];
    if (!roles.includes(role))
      return res
        .status(400)
        .json({ message: `role must be one of ${roles.join(", ")}` });

    // Ensure managerId (if provided) is valid and belongs to same company
    if (managerId) {
      if (!mongoose.Types.ObjectId.isValid(managerId))
        return res.status(400).json({ message: "Invalid managerId" });
      const manager = await User.findOne({
        _id: managerId,
        company: companyId,
      });
      if (!manager)
        return res
          .status(400)
          .json({ message: "Manager not found in your company" });
    }

    // Prevent duplicate email in same company
    const existing = await User.findOne({
      email: normalizedEmail,
      company: companyId,
    });
    if (existing)
      return res
        .status(409)
        .json({
          message: "A user with that email already exists in the company",
        });

    // Generate a secure random temporary password (human-friendly)
    // Example: 12 chars base62
    const tempPassword = crypto
      .randomBytes(9)
      .toString("base64")
      .replace(/\+/g, "A")
      .replace(/\//g, "B")
      .slice(0, 12);

    const hashed = await bcrypt.hash(tempPassword, BCRYPT_ROUNDS);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashed,
      role,
      manager: managerId || null,
      company: companyId,
      mustChangePassword: true,
      tempPasswordExpires: new Date(
        Date.now() +
          parseInt(process.env.TEMP_PW_EXPIRES_HOURS || "24", 10) * 3600 * 1000
      ),
    });

    // Send password email (do not log plain password)
    const subject = "Your account on Expense Odoo";
    const text = `Hello ${user.name || ""},

An account has been created for you on Expense Odoo.

Email: ${user.email}
Temporary password: ${tempPassword}

Please log in and change your password immediately.

If you did not expect this email, contact your admin.
`;
    const html = `
      <p>Hello ${user.name || ""},</p>
      <p>An account has been created for you on <strong>Expense Odoo</strong>.</p>
      <p><strong>Email:</strong> ${user.email}<br/>
      <strong>Temporary password:</strong> <code>${tempPassword}</code></p>
      <p>Please log in and change your password immediately.</p>
      <p>If you did not expect this, contact your admin.</p>
    `;

    // For now, we'll just log the temporary password instead of sending email
    console.log(`Temporary password for ${user.email}: ${tempPassword}`);

    // TODO: Implement email service later
    // try {
    //   await sendMail({ to: user.email, subject, text, html });
    // } catch (mailErr) {
    //   console.error("sendMail error:", mailErr);
    //   return res.status(201).json({
    //     message: "User created but failed to send email. Provide temporary password manually.",
    //     user: {
    //       id: user._id,
    //       name: user.name,
    //       email: user.email,
    //       role: user.role,
    //       manager: user.manager,
    //     }
    //   });
    // }

    // Return safe user object (no password)
    return res.status(201).json({
      message:
        "User created successfully. Check server logs for temporary password.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        manager: user.manager,
      },
    });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /users/admin-create
 * Company admin creates a new user for their company.
 * Body: { name, email, role, managerId (optional) }
 */
export async function adminCreateUser(req, res) {
  try {
    const adminId = req.adminId; // from admin auth middleware
    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find the company associated with this admin
    const Company = (await import("../models/Company.js")).default;
    const company = await Company.findOne({ admin: adminId });
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found for this admin" });
    }

    const { name, email, role = "Employee", managerId = null } = req.body;

    // basic validation
    if (!name || !email)
      return res.status(400).json({ message: "name and email are required" });
    const normalizedEmail = String(email).toLowerCase().trim();

    // Check role allowed values
    const roles = ["Admin", "Manager", "Employee"];
    if (!roles.includes(role))
      return res
        .status(400)
        .json({ message: `role must be one of ${roles.join(", ")}` });

    // Ensure managerId (if provided) is valid and belongs to same company
    if (managerId) {
      if (!mongoose.Types.ObjectId.isValid(managerId))
        return res.status(400).json({ message: "Invalid managerId" });
      const manager = await User.findOne({
        _id: managerId,
        company: company._id,
      });
      if (!manager)
        return res
          .status(400)
          .json({ message: "Manager not found in your company" });
    }

    // Prevent duplicate email in same company
    const existing = await User.findOne({
      email: normalizedEmail,
      company: company._id,
    });
    if (existing)
      return res
        .status(409)
        .json({
          message: "A user with that email already exists in the company",
        });

    // Generate a secure random temporary password (human-friendly)
    const tempPassword = crypto
      .randomBytes(9)
      .toString("base64")
      .replace(/\+/g, "A")
      .replace(/\//g, "B")
      .slice(0, 12);

    const hashed = await bcrypt.hash(tempPassword, BCRYPT_ROUNDS);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashed,
      role,
      manager: managerId || null,
      company: company._id,
      mustChangePassword: true,
      tempPasswordExpires: new Date(
        Date.now() +
          parseInt(process.env.TEMP_PW_EXPIRES_HOURS || "24", 10) * 3600 * 1000
      ),
    });

    // Log the temporary password
    console.log(`Temporary password for ${user.email}: ${tempPassword}`);

    // Return safe user object (no password)
    return res.status(201).json({
      message:
        "User created successfully. Check server logs for temporary password.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        manager: user.manager,
      },
    });
  } catch (err) {
    console.error("adminCreateUser error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
