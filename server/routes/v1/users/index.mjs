import express from "express";
const router = express.Router();
import { db, logger } from "../../../lib/index.mjs";

// Validation
import Joi from "joi";
import { validateParams } from "../../../middleware/validation.mjs";

const params_schema = Joi.object({
  userId: Joi.string().guid({ version: "uuidv4" }),
});

// Auth
import { requireAuth } from "../../../middleware/auth.mjs";

// Get users
router.get(
  "/",
  validateParams(params_schema),
  requireAuth,
  async (req, res) => {
    try {
      const users = await new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM users ORDER BY username ASC`,
          async (err, rows) => {
            return resolve(rows);
          }
        );
      });

      res.status(200).json(users);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: "Error storing data" });
    }
  }
);

export default router;
