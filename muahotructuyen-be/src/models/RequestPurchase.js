const mongoose = require("mongoose");

const RequestPurchaseSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    senderPhone: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, 
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const RequestPurchase = mongoose.model("RequestPurchase", RequestPurchaseSchema);
module.exports = RequestPurchase;