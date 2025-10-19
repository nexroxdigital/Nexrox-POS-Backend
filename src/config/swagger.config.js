import { schemas } from "../docs/swagger/components/schemas.js";
import { userPaths } from "../docs/swagger/paths/user.paths.js";
import { tags } from "../docs/swagger/tags.js";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Nexrox POS Inventory  API",
    version: "1.0.0",
    description:
      "A comprehensive REST API for managing POS inventory system with user authentication, product management, and order processing.",
    // contact: {
    //   name: "API Support",
    //   email: "hh",
    // },
    // license: {
    //   name: "MIT",
    //   url: "hh",
    // },
  },

  // servers: [
  //   {
  //     url: process.env.API_URL || "http://localhost:8000",
  //     description: "Development server",
  //   },
  //   {
  //     url: "https://api.posinventory.com",
  //     description: "Production server",
  //   },
  // ],

  tags,
  components: {
    schemas,
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token",
      },
    },
  },

  // paths

  paths: {
    ...userPaths,
    // Add more paths here as you create them
    // ...productPaths,
    // ...orderPaths,
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export default swaggerDefinition;
