import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyAdmin",
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
    currencyCode: {
      type: String,
      required: true,
    },
    currencySign: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", CompanySchema);
export default Company;
