import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Stock } from "../models/stock.models.js";

// Create a new Stock manually
const createStock = asyncHandler(async (req, res) => {
    const { symbol } = req.body;

    if (!symbol) {
        throw new ApiError(400, "Stock symbol is required");
    }

    const existedStock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (existedStock) {
        throw new ApiError(409, "Stock already exists");
    }

    const stock = await Stock.create({ symbol: symbol.toUpperCase() });

    return res.status(201).json(
        new ApiResponse(201, stock, "Stock created successfully")
    );
});

// Get all stocks
const getAllStocks = asyncHandler(async (req, res) => {
    const stocks = await Stock.find({});
    return res.status(200).json(
        new ApiResponse(200, stocks, "All stocks fetched successfully")
    );
});

// Get a specific Stock by symbol
const getStockBySymbol = asyncHandler(async (req, res) => {
    const { symbol } = req.params;

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
        throw new ApiError(404, "Stock not found");
    }

    return res.status(200).json(
        new ApiResponse(200, stock, "Stock fetched successfully")
    );
});

// Delete a stock
const deleteStock = asyncHandler(async (req, res) => {
    const { symbol } = req.params;

    const deletedStock = await Stock.findOneAndDelete({ symbol: symbol.toUpperCase() });

    if (!deletedStock) {
        throw new ApiError(404, "Stock not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Stock deleted successfully")
    );
});

export {
    createStock,
    getAllStocks,
    getStockBySymbol,
    deleteStock
};
