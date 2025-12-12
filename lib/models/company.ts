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
    contact: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent overwriting model during hot reload
const Company = models.Company || model("Company", CompanySchema);

export default Company;

