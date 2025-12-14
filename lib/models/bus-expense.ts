import mongoose, { Schema, model, models } from "mongoose";

const BusExpenseSchema = new Schema(
  {
    bus: {
      type: Schema.Types.ObjectId,
      ref: "Bus",
      required: [true, "Bus is required"],
    },
    type: {
      type: String,
      enum: ["Fuel", "Toll", "Parking", "Cleaning", "Other"],
      required: [true, "Expense type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: 0,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
    },
    receiptNumber: {
      type: String,
      trim: true,
    },
    odometerReading: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const BusExpense = models.BusExpense || model("BusExpense", BusExpenseSchema);


