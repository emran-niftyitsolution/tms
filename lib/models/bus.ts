import { Schema, model, models } from "mongoose";

const BusSchema = new Schema(
  {
    number: {
      type: String,
      required: [true, "Bus number is required"],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["AC", "Non-AC", "Sleeper", "Seater", "Double Decker"],
      required: [true, "Bus type is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: 1,
    },
    rows: {
      type: Number,
      default: 10,
    },
    columns: {
      type: Number,
      default: 5,
    },
    aisleColumns: {
      type: [Number], // Column indices that are aisles (0-based)
      default: [],
    },
    seatPlan: {
      type: Schema.Types.ObjectId,
      ref: "SeatPlan",
    },
    seatPlanLayout: {
      rows: { type: Number },
      columns: { type: Number },
      aisleColumns: { type: [Number], default: [] },
      seats: {
        type: [
          {
            row: { type: Number, required: true },
            column: { type: Number, required: true },
            seatNumber: { type: Number, required: true },
            seatName: { type: String },
            isBroken: { type: Boolean, default: false },
            isAisle: { type: Boolean, default: false }, // If true, this seat is a road (walkway)
          },
        ],
        default: [],
      },
    },
    seats: {
      type: [
        {
          row: { type: Number, required: true },
          column: { type: Number, required: true },
          seatNumber: { type: Number, required: true },
          seatName: { type: String },
          isBroken: { type: Boolean, default: false },
          isAisle: { type: Boolean, default: false }, // If true, this seat is a road (walkway)
        },
      ],
      default: [],
    },
    registrationNumber: {
      type: String,
      trim: true,
    },
    fitnessExpiry: {
      type: Date,
    },
    insuranceExpiry: {
      type: Date,
    },
    taxTokenExpiry: {
      type: Date,
    },
    permitNumber: {
      type: String,
      trim: true,
    },
    facilities: {
      type: [String],
      enum: [
        "WiFi",
        "Water",
        "Blanket",
        "Charging Port",
        "TV",
        "Reading Light",
        "Snacks",
      ],
      default: [],
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },
    status: {
      type: String,
      enum: ["Active", "Maintenance", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);

export const Bus = models.Bus || model("Bus", BusSchema);
