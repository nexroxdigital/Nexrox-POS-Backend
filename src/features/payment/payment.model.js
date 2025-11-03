import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

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

    payment_targets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InventoryLot",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);
