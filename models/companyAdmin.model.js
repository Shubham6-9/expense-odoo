import mongoose from "mongoose";

const companyAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  countryCode: {   // ISO Alpha-2 (e.g., "IN", "US")
    type: String,
    required: true,
  },
  currencyCode: {  // e.g., "INR", "USD"
    type: String,
    required: true,
  },
  currencySign: {  // e.g., "$", "€", "₹"
    type: String,
    required: true,
  },
  role: {
    type: String,
    required : true,
  },
}, { timestamps: true });

const CompanyAdmin = mongoose.model("CompanyAdmin", companyAdminSchema);
export default CompanyAdmin;
