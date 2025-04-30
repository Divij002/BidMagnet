import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import BidOfferModal from "../components/BidOfferModal";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}`);

function OrderBookPage() {
  const { symbol } = useParams();
  const [orderBook, setOrderBook] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    fetchOrderBook();
    socket.emit("joinSymbolRoom", symbol);
    socket.on("orderBookUpdated", () => {
      fetchOrderBook();
    });

    return () => {
      socket.emit("leaveSymbolRoom", symbol);
      socket.off("orderBookUpdated");
    };
  }, [symbol]);

  const fetchOrderBook = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/stocks/order/${symbol}`);
      const data = response.data;

      const topLevels = [];
      for (let i = 0; i < 5; i++) {
        topLevels.push({
          bestBidPrice: data.bids[i]?.price || "-",
          bestBidSize: data.bids[i]?.size || "-",
          bestOfferPrice: data.asks[i]?.price || "-",
          bestOfferSize: data.asks[i]?.size || "-"
        });
      }

      setOrderBook(topLevels);
    } catch (error) {
      console.error("Error fetching order book:", error);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-heading2 text-[#fff6e2] mb-6 tracking-tight">
        {symbol} Order Book
      </h1>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-700">
        <table className="min-w-full text-sm text-textPrimary bg-surface">
          <thead className="bg-background border-b border-gray-700 text-secondary uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Best Bid Price</th>
              <th className="px-6 py-3 text-left">Bid Size</th>
              <th className="px-6 py-3 text-left">Best Offer Price</th>
              <th className="px-6 py-3 text-left">Offer Size</th>
            </tr>
          </thead>
          <tbody>
            {orderBook.length > 0 ? (
              orderBook.map((level, idx) => (
                <tr key={idx} className="border-t border-gray-700 hover:bg-background transition">
                  <td className="px-6 py-3 text-green-400 font-medium">${level.bestBidPrice}</td>
                  <td className="px-6 py-3">{level.bestBidSize}</td>
                  <td className="px-6 py-3 text-purple-400 font-medium">${level.bestOfferPrice}</td>
                  <td className="px-6 py-3">{level.bestOfferSize}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-secondary">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-4 mt-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => openModal('bid')}
          className="bg-primary text-background font-semibold py-2 px-6 rounded-lg shadow hover:bg-lime-400 transition"
        >
          Place Bid
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => openModal('offer')}
          className="bg-accent text-background font-semibold py-2 px-6 rounded-lg shadow hover:bg-purple-500 transition"
        >
          Place Offer
        </motion.button>
      </div>

      {showModal && (
        <BidOfferModal
          closeModal={() => setShowModal(false)}
          symbol={symbol}
          type={modalType}
        />
      )}
    </div>
  );
}

export default OrderBookPage;
