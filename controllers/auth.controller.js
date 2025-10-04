import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CompanyAdmin from "../models/companyAdmin.model.js";

// ===== Signup Controller =====
export const signupAdmin = async (req, res) => {
  try {
    const { name, email, password, countryCode, currencyCode, currencySign } = req.body;

    if (!name || !email || !password || !countryCode || !currencyCode || !currencySign) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingAdmin = await CompanyAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new CompanyAdmin({
      name,
      email,
      passwordHash,
      countryCode,
      currencyCode,
      currencySign,
      role: "admin",
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== Login Controller =====
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password required" });
    }

    const admin = await CompanyAdmin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        countryCode: admin.countryCode,
        currencyCode: admin.currencyCode,
        currencySign: admin.currencySign,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== Get Profile Controller (Protected Route) =====
export const getProfile = async (req, res) => {
  try {
    // req.adminId is set by verifyToken middleware
    const admin = await CompanyAdmin.findById(req.adminId).select("-passwordHash");
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Profile retrieved successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        countryCode: admin.countryCode,
        currencyCode: admin.currencyCode,
        currencySign: admin.currencySign,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
