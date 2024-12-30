import express from "express";
const router = express.Router();
import { db, logger } from "../../../../lib/index.mjs";

// Validation
import Joi from "joi";
import { validateParams } from "../../../../middleware/validation.mjs";

const params_schema = Joi.object({
  userId: Joi.string().guid({ version: "uuidv4" }).required(),
});

// Auth
import { requireAuth } from "../../../../middleware/auth.mjs";

// Get items
router.get(
  "/:userId/history",
  validateParams(params_schema),
  requireAuth,
  async (req, res) => {
    try {
      const items = await new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM items WHERE userId = ? AND progress > 0.025 ORDER BY updatedAt DESC`,
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
