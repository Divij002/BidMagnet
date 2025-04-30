import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { isEmpty } from "lodash";

function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/v1/stocks/order/getMyOrders", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response && !isEmpty(response.data) && response.data.orders) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const deleteOrder = async (orderId, symbol) => {
    try {
      await axios.post("http://localhost:8000/api/v1/stocks/order/cancel", {
        orderId,
        symbol,
      });
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const modifyOrder = async (orderId, symbol) => {
    const newQuantity = prompt("Enter new quantity:");
    if (!newQuantity) return;

    try {
      await axios.post("http://localhost:8000/api/v1/stocks/order/modify", {
        orderId,
        newQuantity: parseInt(newQuantity),
        symbol,
      });
      fetchOrders();
    } catch (error) {
      console.error("Error modifying order:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-xl mb-4 text-textPrimary">Please login to view your orders.</p>
        <div className="flex gap-4">
          <Link to="/signin" className="bg-primary text-background py-2 px-4 rounded hover:bg-lime-400">Sign In</Link>
          <Link to="/signup" className="bg-accent text-background py-2 px-4 rounded hover:bg-purple-500">Sign Up</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 max-w-5xl mx-auto bg-background bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:32px_32px] min-h-screen">
      <h1 className="text-4xl font-heading2 font-bold mb-8 text-primary tracking-tight">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-secondary text-lg text-center mt-12">No active orders found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              key={order._id}
              className="bg-surface rounded-xl p-6 shadow-lg border border-gray-700 transition"
            >
              <div className="flex flex-col gap-2 text-textPrimary">
                <p><span className="font-semibold text-accent">Symbol:</span> {order.symbol}</p>
                <p><span className="font-semibold">Price:</span> ${order.limitPrice}</p>
                <p><span className="font-semibold">Quantity:</span> {order.quantity}</p>
                <p><span className="font-semibold">Side:</span> {order.side.toUpperCase()}</p>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => modifyOrder(order.orderId, order.symbol)}
                  className="bg-primary text-background px-4 py-2 rounded-lg font-medium hover:bg-lime-400 transition shadow"
                >
                  Modify
                </button>
                <button
                  onClick={() => deleteOrder(order.orderId, order.symbol)}
                  className="bg-danger text-background px-4 py-2 rounded-lg font-medium hover:bg-rose-500 transition shadow"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrdersPage;
