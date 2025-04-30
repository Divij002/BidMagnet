import 'dotenv/config';
import { app } from "./app.js";
import connectDB from "./db/index.js";
import http from "http";
import { Server } from "socket.io";

// Create HTTP server manually
const server = http.createServer(app);

// Initialize socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }
});

// Register socket events
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("joinSymbolRoom", (symbol) => {
    socket.join(symbol);
    console.log(`Client joined room: ${symbol}`);
  });

  socket.on("leaveSymbolRoom", (symbol) => {
    socket.leave(symbol);
    console.log(`Client left room: ${symbol}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Attach io to app instance so it can be accessed via req.app.get("io")
app.set("io", io);

app.get("/", (req,res) => {
  res.json(`BidMagnet Server running on ${process.env.PORT || 8000}`);
});

// Connect DB and start server
connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`🚀 Server is running at port: ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGO DB connection failed!!", err);
  });
