import express from "express";
import * as productController from "./products.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       required:
 *         - name
 *         - number
 *         - email
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: Full name of the user
 *         number:
 *           type: string
 *           description: Phone number
 *         email:
 *           type: string
 *           description: Unique email
 *         role:
 *           type: string
 *           enum: [admin, user, guest]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 650c0f5f6a8f2c001f8d1abc
 *                   name:
 *                     type: string
 *                     example: "Laptop"
 *                   price:
 *                     type: number
 *                     example: 1200
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/", productController.getAll);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Laptop"
 *               price:
 *                 type: number
 *                 example: 1200
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */
router.post("/", productController.create);

export default router;
