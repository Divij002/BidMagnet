import express from "express";
import {
    createStock,
    getAllStocks,
    getStockBySymbol,
    deleteStock
} from "../controllers/stock.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

import {
    newOrder,
    cancelOrder,
    modifyOrder,
    topOfBookUpdate,
    getConsolidatedBook,
    getMyOrders 
} from "../controllers/order.controllers.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// --------- Stock Management Routes ---------
// URL: /api/v1/order/  (for create and get all stocks)
router.route("/")
    .post(asyncHandler(createStock))   // Create new Stock
    .get(asyncHandler(getAllStocks));  // List all Stocks

// URL: /api/v1/order/:symbol (get/delete a stock by symbol)
router.route("/:symbol")
    .get(asyncHandler(getStockBySymbol))  // Get stock details
    .delete(asyncHandler(deleteStock));   // Delete stock

// --------- Order Book Management Routes ---------
// URL: /api/v1/order/order/new
router.post("/order/new", verifyJWT, asyncHandler(async (req, res) => {
    const { symbol, limitPrice, side, quantity, orderId, exchange } = req.body;
    console.log("userEmail", req.user);
    await newOrder({ ...req.body, userEmail: req.user.email });

    const io = req.app.get("io");
    io.to(req.body.symbol).emit("orderBookUpdated");
  
    res.status(201).json({ message: "Order added" });
  })); //changed

// URL: /api/v1/order/order/cancel
router.post("/order/cancel", asyncHandler(async (req, res) => {
    const { orderId, symbol } = req.body;

    await cancelOrder(orderId);

    const io = req.app.get("io");
    io.to(symbol).emit("orderBookUpdated");

    res.status(200).json({ message: "Order canceled" });
})); //changed

// URL: /api/v1/order/modify
router.post("/order/modify", asyncHandler(async (req, res) => {
    const { symbol } = req.body;

    await modifyOrder(req.body);

    const io = req.app.get("io");
    io.to(symbol).emit("orderBookUpdated");

    res.status(200).json({ message: "Order modified" });
})); //changed

// URL: /api/v1/order/topOfBook
router.post("/order/topOfBook", asyncHandler(async (req, res) => {
    await topOfBookUpdate(req.body);
    res.status(201).json({ message: "Top of book updated" });
}));

// URL: /api/v1/stocks/getMyOrders
router.get("/order/getMyOrders", verifyJWT, asyncHandler(async (req, res) => {
    console.log("In my order", req.user);
    const userOrders = await getMyOrders(req.user.email);
    
    // const stocks = await Stock.find({ "orders": { $exists: true, $ne: [] } });
  
    // let userOrders = [];
    // for (const stock of stocks) {
    //   const matched = stock.orders.filter((o) => o.userEmail === req.user.email);
    //   userOrders.push(...matched);
    // }
  
    res.status(200).json({ orders: userOrders });
  }));

// URL: /api/v1/order/:symbol
router.get("/order/:symbol", asyncHandler(async (req, res) => {
    const book = await getConsolidatedBook(req.params.symbol);
    res.status(200).json(book);
}));


  
  

export default router;
