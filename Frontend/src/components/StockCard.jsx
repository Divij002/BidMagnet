import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function StockCard({ symbol, name, logo, price }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-[#252535] rounded-lg shadow-md p-6 flex flex-col items-center justify-between transition-all duration-300"
    >
      <img src={`/company-logos/${logo}`} alt={name} className="h-24 w-32 object-contain mb-4" />
      <h2 className="text-yellow-100 text-xl font-bold">{name}</h2>
      <p className="text-secondary">{symbol}</p>
      <p className="text-primary text-lg font-bold">Current Stock : ${price}</p>
      <Link
        to={`/orderbook/${symbol}`}
        className="mt-4 bg-primary text-background font-medium py-2 px-4 rounded hover:bg-lime-400 transition"
      >
        View Order Book
      </Link>
    </motion.div>
  );
}

export default StockCard;
