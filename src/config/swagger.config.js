import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "POS Inventory API",
      version: "1.0.0",
      description: "API documentation for POS Inventory Server",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}/api/v1`,
        description: "Development server (API v1)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API routes files where you'll add JSDoc comments
  apis: ["./src/features/**/*.router.js", "./src/features/**/*.model.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
