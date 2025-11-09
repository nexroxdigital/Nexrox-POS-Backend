import mongoose from "mongoose";

const { Schema } = mongoose;

// InventoryCrate Schema
const CrateTransitionSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },

    isUpdated: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["IN", "OUT"],
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },

    crate_type_1_qty: {
      type: Number,
      default: 0,
    },

    crate_type_1_price: {
      type: Number,
      default: 0,
    },

    crate_type_2_qty: {
      type: Number,
      default: 0,
    },

    crate_type_2_price: {
      type: Number,
      default: 0,
    },

    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Separate Total Schema
const crateTotalSchema = new Schema(
  {
    type_1_total: {
      type: Number,
      default: 0,
    },

    remaining_type_1: {
      type: Number,
      default: 0,
    },

    type_2_total: {
      type: Number,
      default: 0,
    },

    remaining_type_2: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Export both models
export const InventoryCrate = mongoose.model(
  "InventoryCrate",
  CrateTransitionSchema
);

export const CrateTotal = mongoose.model("CrateTotal", crateTotalSchema);
