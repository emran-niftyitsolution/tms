import mongoose, { Schema, model, models } from "mongoose";
// Import Company to ensure it's registered before City
import Company from "./company";

const CitySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "City name is required"],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      uppercase: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Force model recreation to avoid schema caching issues
if (models.City) {
  delete models.City;
}

export const City = model("City", CitySchema);

