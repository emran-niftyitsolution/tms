import mongoose, { Schema, model, models } from "mongoose";

const BusAssignmentSchema = new Schema(
  {
    bus: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: [true, "Bus is required"],
    },
    driver: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: [true, "Driver is required"],
    },
    helper: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
    },
    route: {
      type: Schema.Types.ObjectId,
      ref: "Route",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Active", "Completed", "Cancelled"],
      default: "Active",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BusAssignment = models.BusAssignment || model("BusAssignment", BusAssignmentSchema);


