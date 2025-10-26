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

// category schema
export const categorySchemas = {
  Category: {
    type: "object",
    required: ["categoryName", "slug"],
    properties: {
      _id: {
        type: "string",
        description: "Auto-generated MongoDB ID",
        example: "507f1f77bcf86cd799439011",
      },
      categoryName: {
        type: "string",
        description: "Name of the category",
        example: "Electronics",
      },
      slug: {
        type: "string",
        description: "URL-friendly unique identifier",
        example: "electronics",
      },
      description: {
        type: "string",
        description: "Category description",
        example: "All electronic items and gadgets",
      },
      comment: {
        type: "string",
        description: "Additional comments about the category",
        example: "Popular category with high demand",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Category creation timestamp",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Category last update timestamp",
      },
    },
  },

  CategoryInput: {
    type: "object",
    required: ["categoryName", "slug"],
    properties: {
      categoryName: {
        type: "string",
        example: "Electronics",
      },
      slug: {
        type: "string",
        example: "electronics",
      },
      description: {
        type: "string",
        example: "All electronic items and gadgets",
      },
      comment: {
        type: "string",
        example: "Popular category with high demand",
      },
    },
  },

  CategoryUpdate: {
    type: "object",
    properties: {
      categoryName: {
        type: "string",
        example: "Electronics Updated",
      },
      slug: {
        type: "string",
        example: "electronics-updated",
      },
      description: {
        type: "string",
        example: "Updated description for electronics",
      },
      comment: {
        type: "string",
        example: "Updated comment",
      },
    },
  },
};

// supplier schema
export const supplierSchemas = {
  Supplier: {
    type: "object",
    required: ["basic_info"],
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
            example: "S001",
          },
          name: {
            type: "string",
            description: "Supplier's full name",
            example: "Rahman Suppliers",
          },
          avatar: {
            type: "string",
            description: "URL to supplier's avatar image",
            example: "https://example.com/avatar.jpg",
          },
          role: {
            type: "string",
            enum: ["supplier"],
            description: "Supplier's role (fixed as supplier)",
            example: "supplier",
          },
        },
      },
      contact_info: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            description: "Supplier's email address",
            example: "rahman@example.com",
          },
          phone: {
            type: "string",
            description: "Supplier's phone number",
            example: "+8801712345678",
          },
          location: {
            type: "string",
            description: "Supplier's location or address",
            example: "Dhaka, Bangladesh",
          },
        },
      },
      account_info: {
        type: "object",
        properties: {
          accountNumber: {
            type: "string",
            description: "Supplier's account number",
            example: "ACC123456",
          },
          balance: {
            type: "number",
            description: "Current account balance",
            example: 15000,
          },
          due: {
            type: "number",
            description: "Due amount",
            example: 3000,
          },
          cost: {
            type: "number",
            description: "Total cost amount",
            example: 20000,
          },
        },
      },
      crate_info: {
        type: "object",
        properties: {
          crate1: {
            type: "number",
            description: "Number of Crate 1",
            example: 50,
          },
          crate1Price: {
            type: "number",
            description: "Price per Crate 1",
            example: 100,
          },
          remainingCrate1: {
            type: "number",
            description: "Remaining Crate 1 count",
            example: 45,
          },
          crate2: {
            type: "number",
            description: "Number of Crate 2",
            example: 30,
          },
          crate2Price: {
            type: "number",
            description: "Price per Crate 2",
            example: 150,
          },
          remainingCrate2: {
            type: "number",
            description: "Remaining Crate 2 count",
            example: 28,
          },
        },
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Supplier creation timestamp",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Supplier last update timestamp",
      },
    },
  },

  SupplierInput: {
    type: "object",
    required: ["basic_info"],
    properties: {
      basic_info: {
        type: "object",
        required: ["sl", "name"],
        properties: {
          sl: {
            type: "string",
            example: "S001",
          },
          name: {
            type: "string",
            example: "Rahman Suppliers",
          },
          avatar: {
            type: "string",
            example: "https://example.com/avatar.jpg",
          },
          role: {
            type: "string",
            enum: ["supplier"],
            example: "supplier",
          },
        },
      },
      contact_info: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "rahman@example.com",
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
          accountNumber: {
            type: "string",
            example: "ACC123456",
          },
          balance: {
            type: "number",
            example: 15000,
          },
          due: {
            type: "number",
            example: 3000,
          },
          cost: {
            type: "number",
            example: 20000,
          },
        },
      },
      crate_info: {
        type: "object",
        properties: {
          crate1: {
            type: "number",
            example: 50,
          },
          crate1Price: {
            type: "number",
            example: 100,
          },
          remainingCrate1: {
            type: "number",
            example: 45,
          },
          crate2: {
            type: "number",
            example: 30,
          },
          crate2Price: {
            type: "number",
            example: 150,
          },
          remainingCrate2: {
            type: "number",
            example: 28,
          },
        },
      },
    },
  },
};

// account schema
export const accountSchemas = {
  Account: {
    type: "object",
    required: ["name", "account_type"],
    properties: {
      _id: {
        type: "string",
        description: "Auto-generated MongoDB ID",
        example: "507f1f77bcf86cd799439011",
      },
      name: {
        type: "string",
        description: "Account holder's name",
        example: "John Doe",
      },
      account_type: {
        type: "string",
        enum: ["bank", "mobile_wallet", "cash"],
        description: "Type of account",
        example: "bank",
      },
      account_name: {
        type: "string",
        description: "Name of the bank or wallet service",
        example: "Dhaka Bank",
      },
      account_number: {
        type: "string",
        description: "Account number or wallet number",
        example: "1234567890",
      },
      balance: {
        type: "number",
        description: "Current account balance",
        example: 50000,
      },
      account_details: {
        type: "string",
        description: "Additional details about the account",
        example: "Primary business account",
      },
      added_by: {
        type: "string",
        description: "User who added this account",
        example: "Admin User",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Account creation timestamp",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Account last update timestamp",
      },
    },
  },

  AccountInput: {
    type: "object",
    required: ["name", "account_type"],
    properties: {
      name: {
        type: "string",
        example: "John Doe",
      },
      account_type: {
        type: "string",
        enum: ["bank", "mobile_wallet", "cash"],
        example: "bank",
      },
      account_name: {
        type: "string",
        example: "Dhaka Bank",
      },
      account_number: {
        type: "string",
        example: "1234567890",
      },
      balance: {
        type: "number",
        example: 50000,
      },
      account_details: {
        type: "string",
        example: "Primary business account",
      },
      added_by: {
        type: "string",
        example: "Admin User",
      },
    },
  },

  AccountUpdate: {
    type: "object",
    properties: {
      name: {
        type: "string",
        example: "John Doe Updated",
      },
      account_type: {
        type: "string",
        enum: ["bank", "mobile_wallet", "cash"],
        example: "mobile_wallet",
      },
      account_name: {
        type: "string",
        example: "bKash",
      },
      account_number: {
        type: "string",
        example: "01712345678",
      },
      balance: {
        type: "number",
        example: 75000,
      },
      account_details: {
        type: "string",
        example: "Updated account details",
      },
      added_by: {
        type: "string",
        example: "Manager User",
      },
    },
  },
};

// Combine all schemas
export const schemas = {
  ...activityLogSchemas,
  ...userSchemas,
  ...customerSchemas,
  ...categorySchemas,
  ...supplierSchemas,
  ...accountSchemas,
};
