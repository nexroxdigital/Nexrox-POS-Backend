export const inventoryLotsPaths = {
  "/api/v1/inventoryLots/all": {
    get: {
      tags: ["Inventory Lots"],
      summary: "Get all inventory lots",
      description:
        "Retrieve a list of all inventory lots with product, supplier, and profit information",

      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            default: 1,
          },
          description: "Page number for pagination",
          example: 1,
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            default: 10,
          },
          description: "Number of items per page",
          example: 10,
        },
      ],

      responses: {
        200: {
          description: "List of inventory lots retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "success",
                  },
                  data: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/InventoryLot",
                    },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },

  "/api/v1/inventoryLots/details/{id}": {
    get: {
      tags: ["Inventory Lots"],
      summary: "Get inventory lot by ID",
      description:
        "Retrieve detailed information about a specific inventory lot by its MongoDB ObjectId",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "MongoDB ObjectId of the inventory lot",
          example: "507f1f77bcf86cd799439011",
        },
      ],
      responses: {
        200: {
          description: "Inventory lot retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "success",
                  },
                  data: {
                    $ref: "#/components/schemas/InventoryLot",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Inventory lot not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },

  "/api/v1/inventoryLots/check-name": {
    get: {
      tags: ["Inventory Lots"],
      summary: "Check if lot name already exists",
      description:
        "Check for duplicate lot names before creating a new inventory lot",
      parameters: [
        {
          in: "query",
          name: "lot_name",
          required: true,
          schema: {
            type: "string",
          },
          description: "Lot name to check for duplicates",
          example: "RS-291020-BANANA-30",
        },
      ],
      responses: {
        200: {
          description: "Lot name availability checked successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "success",
                  },
                  exists: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Lot name is available",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Missing lot_name parameter",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },

  "/api/v1/inventoryLots/add/?id=xyz": {
    post: {
      tags: ["Inventory Lots"],
      summary: "Create new inventory lots",
      description:
        "Create new inventory lots with product, supplier, purchase details, costs, sales, and profit tracking",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/InventoryLotInput",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Inventory lot created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "success",
                  },
                  message: {
                    type: "string",
                    example: "Inventory lot created successfully",
                  },
                  data: {
                    $ref: "#/components/schemas/InventoryLot",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid input",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },

  "/api/v1/inventoryLots/status/{id}": {
    put: {
      tags: ["Inventory Lots"],
      summary: "Update lot status",
      description:
        "Update the status of an inventory lot (in stock or stock out)",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "string",
          },
          description: "MongoDB ObjectId of the inventory lot",
          example: "507f1f77bcf86cd799439011",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/LotStatusUpdate",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Lot status updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "success",
                  },
                  message: {
                    type: "string",
                    example: "Lot status updated successfully",
                  },
                  data: {
                    $ref: "#/components/schemas/InventoryLot",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Inventory lot not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        400: {
          description: "Invalid status value",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
      },
    },
  },
};
