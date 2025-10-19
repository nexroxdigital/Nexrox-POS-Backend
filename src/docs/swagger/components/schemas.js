/**
 *  Global API Schemas
 * --------------------------------------------
 *  This file contains all OpenAPI / Swagger schema
 *  definitions used across the application.
 *
 *  Each module (User, Product, Order, etc.)
 *  should define its own schema and export it here
 *  for centralized API documentation.
 *
 */

// user schema
export const userSchemas = {
  User: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      _id: {
        type: "string",
        description: "Auto-generated MongoDB ID",
        example: "507f1f77bcf86cd799439011",
      },
      name: {
        type: "string",
        description: "User's full name",
        example: "John Doe",
      },
      email: {
        type: "string",
        format: "email",
        description: "User's email address",
        example: "john@example.com",
      },
      password: {
        type: "string",
        description: "User's password (hashed)",
        example: "$2b$10$...",
      },
      role: {
        type: "string",
        enum: ["admin", "user", "manager"],
        description: "User's role",
        example: "user",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "User creation timestamp",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "User last update timestamp",
      },
    },
  },

  UserInput: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: {
        type: "string",
        example: "John Doe",
      },
      email: {
        type: "string",
        format: "email",
        example: "john@example.com",
      },
      password: {
        type: "string",
        format: "password",
        example: "Password123!",
      },
      role: {
        type: "string",
        enum: ["admin", "user", "manager"],
        example: "user",
      },
    },
  },

  UserUpdate: {
    type: "object",
    properties: {
      name: {
        type: "string",
        example: "John Updated",
      },
      email: {
        type: "string",
        format: "email",
        example: "johnupdated@example.com",
      },
      role: {
        type: "string",
        enum: ["admin", "user", "manager"],
        example: "manager",
      },
    },
  },

  Error: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "error",
      },
      message: {
        type: "string",
        example: "Something went wrong",
      },
    },
  },

  Success: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "success",
      },
      message: {
        type: "string",
        example: "Operation completed successfully",
      },
      data: {
        type: "object",
      },
    },
  },
};

// Combine all schemas
export const schemas = {
  ...userSchemas,
  // Add other feature schemas here
  // ...productSchemas,
  // ...orderSchemas,
};
