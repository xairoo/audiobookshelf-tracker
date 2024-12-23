import express from "express";
const router = express.Router();
import { db, logger } from "../../../../lib/index.mjs";

/**
 * Validation
 */
import Joi from "joi";
import {
  validateBody,
  validateParams,
} from "../../../../middleware/validation.mjs";

const body_schema = Joi.object({});

const params_schema = Joi.object({
  userId: Joi.string().guid({ version: "uuidv4" }).required(),
});

// Get items
router.get(
  "/:userId/history",
  validateParams(params_schema),
  async (req, res) => {
    try {
      const items = await new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM items WHERE userId = ? AND progress > 0 ORDER BY updatedAt DESC`,
          [req.params.userId],
          async (err, rows) => {
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
