import mongoose, { Schema } from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    supplierId: {
      type: Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    inventory_lot_ids: [
      {
        type: Schema.Types.ObjectId,
        ref: "InventoryLot",
      },
    ],

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    transactionId: {
      type: String,
      unique: true,
      trim: true,
    },

    proof_img: {
      type: String,
    },

    note: {
      type: String,
      trim: true,
    },

    payment_method: {
      type: String,
      enum: ["MFS", "bank", "cash"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);
