// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Manager", "Employee"],
      default: "Employee",
    },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mustChangePassword: { type: Boolean, default: false },
    tempPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Add compound index to ensure email is unique within a company
UserSchema.index({ email: 1, company: 1 }, { unique: true });

const User = mongoose.model("User", UserSchema);

// 👇 this makes it compatible with `import User from ".../User.js"`
export default User;
