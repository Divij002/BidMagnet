import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    symbol: { type: String, required: true },
    limitPrice: { type: Number, required: true },
    side: { type: String, enum: ["BUY", "SELL"], required: true },
    quantity: { type: Number, required: true },
    exchange: { type: String, required: true },
    userEmail: {type: String, required: true},
}, { _id: false });

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true, uppercase: true },
    orders: [orderSchema],
    bids: { type: Map, of: Number, default: {} },
    asks: { type: Map, of: Number, default: {} }
}, { timestamps: true });

export const Stock = mongoose.model("Stock", stockSchema);
