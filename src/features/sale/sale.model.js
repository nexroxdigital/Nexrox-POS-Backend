import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    sale_date: {
      type: String,
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    total_custom_commission: {
      type: Number,
      default: 0,
    },

    total_lots_commission: {
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
            discount_Kg: {
              type: Number,
              default: 0,
            },
            unit_price: {
              type: Number,
              required: true,
              default: 0,
            },
            total_price: {
              type: Number,
              default: 0, // totalPrice = kg * unitPrice
            },
            discount_amount: {
              type: Number,
              default: 0, // discountAmount = discountKg * unitPrice
            },
            selling_price: {
              type: Number,
              default: 0, // sellingPrice = totalPrice - discountAmount
            },
            lot_commission_rate: {
              type: Number,
              default: 0,
            },
            lot_commission_amount: {
              type: Number,
              default: 0, // sellingPrice * (lotCommissionRate / 100)
            },
            crate_type1: {
              type: Number,
              default: 0,
            },
            crate_type2: {
              type: Number,
              default: 0,
            },
          },
        ],

        customer_commission_rate: {
          type: Number,
          default: 0,
        },

        customer_commission_amount: {
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
    payment_details: {
      extra_crate_type1_price: {
        type: Number,
        default: 0,
      },

      extra_crate_type2_price: {
        type: Number,
        default: 0,
      },

      payable_amount: {
        type: Number,
        required: true,
        default: 0,
      },

      change_amount: {
        type: Number,
        default: 0,
      },

      due_amount: {
        type: Number,
        default: 0,
      },

      payment_type: {
        type: String,
        enum: ["cash", "bank", "mobile", "balance", "other"],
        default: "cash",
      },

      received_amount: {
        type: Number,
        default: 0,
      },

      received_amount_from_balance: {
        type: Number,
        default: 0,
      },

      vat: {
        type: Number,
        default: 0,
      },

      note: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);
