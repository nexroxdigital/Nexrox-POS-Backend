import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config.js";

// routes
import userRouter from "./features/user/user.router.js";

const app = express();
const API_VERSION = process.env.API_VERSION || "/api/v1";

// Middleware
app.use(cors());
app.use(express.json());
// Swagger Documentation Route
// Swagger Documentation Route
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "POS Inventory API Docs",
    customfavIcon: "/favicon.ico",
  })
);

// root
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Pos Inventory server is running successfully",
    apiVersion: API_VERSION,
    docs: "http://localhost:8000/docs",
    note: "Use the versioned API routes for all endpoints.",
  });
});

// routes declaration
app.use("/users", userRouter);
// app.use("/api/v1/health-check", healthCheckRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    docs: `http://localhost:${process.env.PORT || 8000}/docs`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

export default app;
