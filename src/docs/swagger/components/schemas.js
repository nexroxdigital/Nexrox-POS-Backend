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

// customer schema
export const customerSchemas = {
  Customer: {
    type: "object",
    required: ["basic_info", "contact_info"],
    properties: {
      _id: {
        type: "string",
        description: "Auto-generated MongoDB ID",
        example: "507f1f77bcf86cd799439011",
      },
      basic_info: {
        type: "object",
        required: ["sl", "name"],
        properties: {
          sl: {
            type: "string",
            description: "Serial number or unique identifier",
            example: "C001",
          },
          name: {
            type: "string",
            description: "Customer's full name",
            example: "Ahmed Khan",
          },
          role: {
            type: "string",
            enum: ["customer", "vendor", "admin"],
            description: "Customer's role in the system",
            example: "customer",
          },
          avatar: {
            type: "string",
            description: "URL to customer's avatar image",
            example: "https://example.com/avatar.jpg",
          },
        },
      },
      contact_info: {
        type: "object",
        required: ["email", "phone"],
        properties: {
          email: {
            type: "string",
            format: "email",
            description: "Customer's email address",
            example: "ahmed@example.com",
          },
          phone: {
            type: "string",
            description: "Customer's phone number",
            example: "+8801712345678",
          },
          location: {
            type: "string",
            description: "Customer's location or address",
            example: "Dhaka, Bangladesh",
          },
        },
      },
      account_info: {
        type: "object",
        properties: {
          account_number: {
            type: "string",
            description: "Customer's account number",
            example: "ACC123456",
          },
          balance: {
            type: "number",
            description: "Current account balance",
            example: 5000,
          },
          dua: {
            type: "number",
            description: "Due amount",
            example: 1500,
          },
          return_amount: {
            type: "number",
            description: "Return amount",
            example: 500,
          },
        },
      },
      crate_info: {
        type: "object",
        properties: {
          type_1: {
            type: "number",
            description: "Number of Type 1 crates",
            example: 10,
          },
          type_1_price: {
            type: "number",
            description: "Price per Type 1 crate",
            example: 50,
          },
          type_2: {
            type: "number",
            description: "Number of Type 2 crates",
            example: 5,
          },
          type_2_price: {
            type: "number",
            description: "Price per Type 2 crate",
            example: 75,
          },
        },
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Customer creation timestamp",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Customer last update timestamp",
      },
    },
  },

  CustomerInput: {
    type: "object",
    required: ["basic_info", "contact_info"],
    properties: {
      basic_info: {
        type: "object",
        required: ["sl", "name"],
        properties: {
          sl: {
            type: "string",
            example: "C001",
          },
          name: {
            type: "string",
            example: "Ahmed Khan",
          },
          role: {
            type: "string",
            enum: ["customer", "vendor", "admin"],
            example: "customer",
          },
          avatar: {
            type: "string",
            example: "https://example.com/avatar.jpg",
          },
        },
      },
      contact_info: {
        type: "object",
        required: ["email", "phone"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "ahmed@example.com",
          },
          phone: {
            type: "string",
            example: "+8801712345678",
          },
          location: {
            type: "string",
            example: "Dhaka, Bangladesh",
          },
        },
      },
      account_info: {
        type: "object",
        properties: {
          account_number: {
            type: "string",
            example: "ACC123456",
          },
          balance: {
            type: "number",
            example: 5000,
          },
          dua: {
            type: "number",
            example: 1500,
          },
          return_amount: {
            type: "number",
            example: 500,
          },
        },
      },
      crate_info: {
        type: "object",
        properties: {
          type_1: {
            type: "number",
            example: 10,
          },
          type_1_price: {
            type: "number",
            example: 50,
          },
          type_2: {
            type: "number",
            example: 5,
          },
          type_2_price: {
            type: "number",
            example: 75,
          },
        },
      },
    },
  },

  CustomerUpdate: {
    type: "object",
    properties: {
      basic_info: {
        type: "object",
        properties: {
          sl: {
            type: "string",
            example: "C001",
          },
          name: {
            type: "string",
            example: "Ahmed Khan Updated",
          },
          role: {
            type: "string",
            enum: ["customer", "vendor", "admin"],
            example: "vendor",
          },
          avatar: {
            type: "string",
            example: "https://example.com/new-avatar.jpg",
          },
        },
      },
      contact_info: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "ahmed.updated@example.com",
          },
          phone: {
            type: "string",
            example: "+8801798765432",
          },
          location: {
            type: "string",
            example: "Chittagong, Bangladesh",
          },
        },
      },
      account_info: {
        type: "object",
        properties: {
          account_number: {
            type: "string",
            example: "ACC789012",
          },
          balance: {
            type: "number",
            example: 7500,
          },
          dua: {
            type: "number",
            example: 2000,
          },
          return_amount: {
            type: "number",
            example: 300,
          },
        },
      },
      crate_info: {
        type: "object",
        properties: {
          type_1: {
            type: "number",
            example: 15,
          },
          type_1_price: {
            type: "number",
            example: 55,
          },
          type_2: {
            type: "number",
            example: 8,
          },
          type_2_price: {
            type: "number",
            example: 80,
          },
        },
      },
    },
  },
};

// activity logs
export const activityLogSchemas = {
  ActivityLog: {
    type: "object",
    required: ["model_name", "action"],
    properties: {
      _id: {
        type: "string",
        description: "Auto-generated MongoDB ID",
        example: "507f1f77bcf86cd799439011",
      },
      date: {
        type: "string",
        format: "date-time",
        description: "Date of the activity",
        example: "2025-10-25T10:30:00.000Z",
      },
      logs_fields_id: {
        type: "string",
        description: "Reference ID to the related document",
        example: "507f1f77bcf86cd799439012",
      },
      model_name: {
        type: "string",
        description: "Name of the model/collection this log refers to",
        example: "Customer",
      },
      action: {
        type: "string",
        enum: ["Added", "Created", "Returned", "Updated", "Deleted", "Payment"],
        description: "Type of action performed",
        example: "Created",
      },
      note: {
        type: "string",
        description: "Additional notes about the activity",
        example: "Customer created with initial balance",
      },
      by: {
        type: "string",
        description: "User ID who performed the action",
        example: "507f1f77bcf86cd799439013",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Activity log creation timestamp",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Activity log last update timestamp",
      },
    },
  },
};

// Combine all schemas
export const schemas = {
  ...activityLogSchemas,
  ...userSchemas,
  ...customerSchemas,
};
