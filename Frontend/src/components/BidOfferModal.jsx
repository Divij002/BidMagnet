import { useState } from "react";
import axios from "axios";
import { useAuth } from "../store/AuthContext";
import { v4 as uuidv4 } from "uuid";
import socket from "../../socket"; // assumes socket.js exports the socket instance

function BidOfferModal({ closeModal, symbol, type }) {
  const { user } = useAuth();
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to place orders!");
      return;
    }

    const payload = {
      symbol,
      limitPrice: parseFloat(price),
      quantity: parseInt(quantity),
      side: type === "bid" ? "BUY" : "SELL",
      orderId: uuidv4(),
      userEmail: user.email,
      exchange: "LocalExchange", // optional: if you want to mark the source
    };

    console.log("Submitting bid with token:", user?.token);

    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/stocks/order/new`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
        withCredentials: true
      });

      // Optionally emit local socket message (frontend to backend listener)
      socket.emit("orderPlaced", { symbol }); // optional for debug/future UI

      closeModal();
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-surface p-6 rounded-lg w-96 space-y-4 shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-primary">
          {type === "bid" ? "Place a Bid" : "Place an Offer"}
        </h2>

        <input
          type="number"
          placeholder="Enter Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full p-2 rounded bg-background text-textPrimary border border-gray-700 focus:outline-none"
        />

        <input
          type="number"
          placeholder="Enter Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="w-full p-2 rounded bg-background text-textPrimary border border-gray-700 focus:outline-none"
        />

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary text-background py-2 px-4 rounded hover:bg-lime-400"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default BidOfferModal;
