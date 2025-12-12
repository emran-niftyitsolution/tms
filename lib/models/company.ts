import mongoose, { Schema, model, models } from "mongoose";

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["Bus", "Train", "Air", "Ship"],
      required: [true, "Transport type is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    routes: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    // Detailed Address Fields
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String },
    
    // Legacy single string (optional/computed)
    contact: {
      type: String,
      default: "",
    },
    license: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overwriting model during hot reload
const Company = models.Company || model("Company", CompanySchema);

export default Company;
