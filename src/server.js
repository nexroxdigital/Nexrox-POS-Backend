import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

dotenv.config();

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express Server
    const PORT = process.env.PORT || 8000;

    app.listen(PORT, () => {
      console.log(`⚡ Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start:", err);
    process.exit(1); // Exit process if DB connection fails
  }
};

startServer();
