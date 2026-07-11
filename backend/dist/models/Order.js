import mongoose, { Schema, model } from "mongoose";
const OrderItemSchema = new Schema({
    products: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
}, { _id: false });
const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    customerName: {
        type: String,
        default: "",
        trim: true,
    },
    customerEmail: {
        type: String,
        trim: true,
        required: true,
    },
    items: {
        type: [OrderItemSchema],
        default: [],
    },
    totalItems: {
        type: Number,
        required: true,
        min: 1,
    },
    deliveryName: {
        type: String,
        trim: true,
        required: true,
    },
    deliveryAddress: {
        type: String,
        trim: true,
        required: true,
    },
    promocode: {
        type: String,
        uppercase: true,
        trim: true,
        default: "",
    },
    discountAmmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalAmmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
    orderStatus: {
        type: String,
        enum: ["placed", "shipped", "delivered", "returned"],
        default: "placed",
    },
    sslCommercePayOrderId: {
        type: String,
        required: true,
        trim: true,
    },
    paymentId: {
        type: String,
        default: "",
        trim: true,
    },
    paidAt: {
        type: Date,
        default: null,
    },
    deliveryAt: {
        type: Date,
        default: null,
    },
    returnAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true, versionKey: false });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, createdAt: -1 });
export const Order = mongoose.models.Order || model("Order", OrderSchema);
