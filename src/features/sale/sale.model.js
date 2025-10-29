import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    sellDate: {
      type: String,
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    total_Custom_Commission: {
      type: Number,
      default: 0,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        selected_lots: [
          {
            lotId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "InventoryLot",
              required: true,
            },
            kg: {
              type: Number,
              required: true,
              default: 0,
            },
            discountKg: {
              type: Number,
              default: 0,
            },
            unitPrice: {
              type: Number,
              required: true,
              default: 0,
            },
            totalPrice: {
              type: Number,
              default: 0, // totalPrice = kg * unitPrice
            },
            discountAmount: {
              type: Number,
              default: 0, // discountAmount = discountKg * unitPrice
            },
            sellingPrice: {
              type: Number,
              default: 0, // sellingPrice = totalPrice - discountAmount
            },
            lotCommissionRate: {
              type: Number,
              default: 0,
            },
            lotCommissionAmount: {
              type: Number,
              default: 0, // sellingPrice * (lotCommissionRate / 100)
            },
            crateType1: {
              type: Number,
              default: 0,
            },
            crateType2: {
              type: Number,
              default: 0,
            },
          },
        ],

        customer_commission_Rate: {
          type: Number,
          default: 0,
        },

        customer_commission_Amount: {
          type: Number,
          default: 0,
        },

        profit: {
          type: Number,
          default: 0,
        },
      },
    ],

    // payments details
    payment_Details: {
      payable_Amount: {
        type: Number,
        required: true,
        default: 0,
      },

      change_Amount: {
        type: Number,
        default: 0,
      },

      due_Amount: {
        type: Number,
        default: 0,
      },

      payment_Type: {
        type: String,
        enum: ["cash", "bank", "mobile", "other"],
        default: "cash",
      },

      received_Amount: {
        type: Number,
        default: 0,
      },

      Vat: {
        type: Number,
        default: 0,
      },

      Note: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
