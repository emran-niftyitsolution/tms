import { Schema, model, models } from "mongoose";
import "./city";

const StoppageSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    name: {
      type: String,
      required: [true, "Stoppage name is required"],
      trim: true,
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
      required: [true, "City is required"],
    },
    code: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      uppercase: true,
    },
    boarding: {
      type: Boolean,
      default: true,
      required: false,
    },
    dropping: {
      type: Boolean,
      default: true,
      required: false,
    },
    counter: {
      type: Boolean,
      default: false,
      required: false,
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

// Force model recreation to avoid schema caching issues during development
if (models.Stoppage) {
  delete models.Stoppage;
}

export const Stoppage = model("Stoppage", StoppageSchema);
