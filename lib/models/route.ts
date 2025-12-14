import mongoose, { Schema, model, models } from "mongoose";

// Delete existing model to prevent schema caching issues
delete models.Route;

const StoppageSchema = new Schema(
  {
    place: {
      type: Schema.Types.ObjectId,
      ref: "Stoppage",
      required: [true, "Stoppage is required"],
    },
    enable: {
      type: Boolean,
      default: true,
    },
    boarding: {
      type: Boolean,
      default: false,
    },
    boardingTime: {
      type: String,
      trim: true,
    },
    dropping: {
      type: Boolean,
      default: false,
    },
    droppingTime: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const RouteSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Route name is required"],
      trim: true,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "Stoppage",
      required: [true, "Start location is required"],
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "Stoppage",
      required: [true, "End location is required"],
    },
    stoppages: {
      type: [StoppageSchema],
      default: [],
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

export const Route = models.Route || model("Route", RouteSchema);
