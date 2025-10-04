import CompanyAdmin from "../models/companyAdmin.model.js";
import jwt from "jsonwebtoken";

// Middleware to check if at least one user exists before allowing login
export const checkUserExists = async (req, res, next) => {
  try {
    const userCount = await CompanyAdmin.countDocuments();
    
    if (userCount === 0) {
      return res.status(403).json({ 
        message: "No users registered. Please sign up first.",
        redirectTo: "/signup"
      });
    }
    
    next();
  } catch (error) {
    console.error("Check User Exists Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
// Add to auth.middleware.js
export const verifyToken = async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
      
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.adminId = decoded.id;
      req.adminEmail = decoded.email;
      
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
export default {checkUserExists , verifyToken};