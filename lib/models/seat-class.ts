import mongoose, { Schema, model, models } from "mongoose";

const SeatClassSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    name: {
      type: String,
      required: [true, "Seat class name is required"],
      trim: true,
    },
    fare: {
      type: Number,
      required: [true, "Fare is required"],
      min: [0, "Fare must be a positive number"],
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
if (models.SeatClass) {
  delete models.SeatClass;
}

export const SeatClass = model("SeatClass", SeatClassSchema);

