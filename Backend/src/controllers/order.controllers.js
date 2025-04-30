import { Stock } from "../models/stock.models.js";
import { ApiError } from "../utils/apiError.js";

const getTopLevels = (priceMap, isBid = true) => {
    const sorted = Array.from(priceMap.entries())
        .sort((a, b) => isBid ? b[0] - a[0] : a[0] - b[0]);
    return sorted.slice(0, 5).map(([price, size]) => ({ price: parseFloat(price), size }));
};


export const newOrder = async ({ symbol, limitPrice, side, quantity, orderId, exchange, userEmail }) => {
    const stock = await Stock.findOne({ symbol }) || await Stock.create({ symbol });
    
  
    stock.orders.push({ symbol, limitPrice, side, quantity, orderId, userEmail, exchange });
  
    const bookSide = side === "BUY" ? stock.bids : stock.asks;
    const currentSize = bookSide.get(limitPrice.toString()) || 0;
    bookSide.set(limitPrice.toString(), currentSize + quantity);
  
    await stock.save();
  };
  

export const cancelOrder = async (orderId) => {
    // const stock = await Stock.findOne({ "orders.orderId": orderId });
    // if (!stock) throw new ApiError(404, "Order not found");
    // const order = stock.orders.find(o => o.orderId === orderId);
    // const bookSide = order.side === "BUY" ? stock.bids : stock.asks;
    // const currentSize = bookSide.get(order.limitPrice.toString()) || 0;
    // if (currentSize >= order.quantity) {
    //     bookSide.set(order.limitPrice.toString(), currentSize - order.quantity);
    // }
    // stock.orders = stock.orders.filter(o => o.orderId !== orderId);
    // await stock.save();

    const stock = await Stock.findOne({ "orders.orderId": orderId });
    if (!stock) throw new ApiError(404, "Order not found");
  
    const order = stock.orders.find(o => o.orderId === orderId);
    const bookSide = order.side === "BUY" ? stock.bids : stock.asks;
    const priceKey = order.limitPrice.toString();
  
    const currentSize = bookSide.get(priceKey) || 0;
    const updatedSize = currentSize - order.quantity;
  
    if (updatedSize > 0) {
      bookSide.set(priceKey, updatedSize);
    } else {
      bookSide.delete(priceKey); 
    }
  
    // Remove the order from the stock
    stock.orders = stock.orders.filter(o => o.orderId !== orderId);
  
    await stock.save();
};

export const modifyOrder = async ({ orderId, newQuantity }) => {
    const stock = await Stock.findOne({ "orders.orderId": orderId });
    if (!stock) throw new ApiError(404, "Order not found");
    const order = stock.orders.find(o => o.orderId === orderId);
    const bookSide = order.side === "BUY" ? stock.bids : stock.asks;
    const currentSize = bookSide.get(order.limitPrice.toString()) || 0;
    bookSide.set(order.limitPrice.toString(), currentSize - order.quantity + newQuantity);
    order.quantity = newQuantity;
    await stock.save();
};

export const topOfBookUpdate = async ({ symbol, bestBidPrice, bestBidSize, bestOfferPrice, bestOfferSize }) => {
    let stock = await Stock.findOne({ symbol }) || await Stock.create({ symbol });
    stock.bids.set(bestBidPrice.toString(), bestBidSize);
    stock.asks.set(bestOfferPrice.toString(), bestOfferSize);
    await stock.save();
};

export const getConsolidatedBook = async (symbol) => {
    let stock = await Stock.findOne({ symbol });
    if (!stock) {stock = await Stock.create({ symbol });}
    const topBids = getTopLevels(stock.bids, true);
    const topAsks = getTopLevels(stock.asks, false);
    return { symbol: stock.symbol, bids: topBids, asks: topAsks };
};

export const getMyOrders = async (userEmail) => {
    if (!userEmail) throw new ApiError(400, "User email is required");
  
    const stocks = await Stock.find({ "orders.userEmail": userEmail });
  
    const orders = stocks.reduce((allOrders, stock) => {
      const userOrders = stock.orders.filter(order => order.userEmail === userEmail);
      return [...allOrders, ...userOrders];
    }, []);
  
    return orders;
  };
  
