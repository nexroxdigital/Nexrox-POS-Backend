import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transaction_Id: {
      type: String,
      required: true,
      unique: true,
    },
    slip_img: {
      type: String,
      default: null,
    },
    note: {
      type: String,
      default: "",
    },
    payment_method: {
      type: String,
      enum: ["MFS", "bank", "cash"],
      required: true,
    },
    balance_for: {
      type: String,
      required: true,
    },
    
    collection: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Balance", balanceSchema);
