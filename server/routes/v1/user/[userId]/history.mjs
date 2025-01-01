import express from "express";
const router = express.Router();
import { db, logger } from "../../../../lib/index.mjs";
import { v4 as uuidv4 } from "uuid";

// Validation
import Joi from "joi";
import {
  validateParams,
  validateBody,
} from "../../../../middleware/validation.mjs";

const paramsSchema = Joi.object({
  userId: Joi.string().guid({ version: "uuidv4" }).required(),
});

// Auth
import { requireAuth } from "../../../../middleware/auth.mjs";

// Get all media entries
router.get(
  "/:userId/history",
  validateParams(paramsSchema),
  requireAuth,
  async (req, res) => {
    try {
      const items = await new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM items WHERE userId = ? AND progress > 0 ORDER BY updatedAt DESC`,
          [req.params.userId],
          async (err, rows) => {
            if (err) {
              logger.error(err);
              reject(err);
            }
            return resolve(rows);
          }
        );
      });

      res.status(200).json(items);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Error storing data" });
    }
  }
);

const bodySchema = Joi.object({
  author: Joi.string().empty(""),
  title: Joi.string().required(),
  isFinished: Joi.boolean().required(),
});

// Add custom media
router.post(
  "/:userId/history",
  validateBody(bodySchema),
  requireAuth,
  async (req, res) => {
    try {
      const user = await new Promise((resolve, reject) => {
        db.get(
          `SELECT * FROM users WHERE id = ? LIMIT 1`,
          [req.params.userId],
          async (err, rows) => {
            return resolve(rows);
          }
        );
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO items (userId, itemId, type, author, title, progress, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            req.params.userId,
            uuidv4(),
            "custom",
            req.body.author,
            req.body.title,
            req.body.isFinished ? 1 : 0.001,
            new Date().toISOString(),
          ],
          function (err) {
            if (err) {
              logger.error(err);
              reject(err);
            }
            return resolve();
          }
        );
      });

      const items = await new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM items WHERE userId = ? AND progress > 0 ORDER BY updatedAt DESC`,
          [req.params.userId],
          async (err, rows) => {
            if (err) {
              logger.error(err);
              reject(err);
            }
            return resolve(rows);
          }
        );
      });

      res.status(200).json(items);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Error storing data" });
    }
  }
);

export default router;
