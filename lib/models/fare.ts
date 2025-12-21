import mongoose, { Schema, model, models } from "mongoose";

const FareSchema = new Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    seatClass: {
      type: Schema.Types.ObjectId,
      ref: "SeatClass",
      required: [true, "Seat class is required"],
    },
    route: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      required: [true, "Route is required"],
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

export const Fare = models.Fare || model("Fare", FareSchema);





