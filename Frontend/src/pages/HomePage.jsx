// src/pages/HomePage.jsx
import { motion } from "framer-motion";
import StockCard from "../components/StockCard";

const stockData = [
  { symbol: "AAPL", name: "Apple Inc.", logo: "aapl.png", price: 210.14 },
  { symbol: "MSFT", name: "Microsoft Corp.", logo: "msft.png", price: 391.16 },
  { symbol: "GOOGL", name: "Alphabet Inc.", logo: "googl.png", price: 160.61 },
  { symbol: "AMZN", name: "Amazon.com Inc.", logo: "amzn.png", price: 187.70 },
  { symbol: "TSLA", name: "Tesla Inc.", logo: "tsla.png", price: 285.88 },
  { symbol: "BRK.B", name: "Berkshire Hathaway", logo: "brk-b.png", price: 530.94 },
  { symbol: "NVDA", name: "NVIDIA Corp.", logo: "nvda.png", price: 108.73 },
  { symbol: "META", name: "Meta Platforms", logo: "meta.png", price: 549.74 },
  { symbol: "JNJ", name: "Johnson & Johnson", logo: "jnj.png", price: 155.35 },
];

function HomePage() {
  return (
    <div className="bg-[#f4decb] text-black font-body min-h-screen">
      {/* Hero Section */}
      <section className="px-6 md:px-20 pt-32 pb-10 max-w-7xl mx-auto">
        <motion.h1 className="text-5xl md:text-7xl font-heading font-bold leading-[1.2] tracking-tight mb-6" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          Welcome to BidMagnet
        </motion.h1>

        <motion.p className="text-xl md:text-2xl font-body max-w-2xl text-black/80 mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          Your Real-Time Market Book. Track and trade intelligently with a unified order book.
        </motion.p>

        <motion.div className="flex justify-center" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
          <img
            src="/book image.png"
            alt="Book Flip Illustration"
            className="w-[300px] md:w-[800px] rounded-lg "
          />
        </motion.div>
      </section>

      {/* Stock Cards Section */}
      <section className="px-6 md:px-20 py-20 max-w-7xl mx-auto">
        <motion.h2 className="text-3xl font-heading font-semibold mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          Our Market Symbols
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {stockData.map((stock) => (
            <StockCard
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              logo={stock.logo}
              price={stock.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
