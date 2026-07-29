import express from 'express';
import dotenv from 'dotenv';
import { openDb } from '../db/sqlite.js';
import { parseSearchParams } from '../services/search/parseSearchParams.js';
import { searchAccommodations } from '../services/search/searchAccommodations.js';

/** Load env vars for DB path resolution. */
dotenv.config();

/**
 * Create router for search endpoints.
 * @returns {express.Router} Router.
 */
export function createSearchRouter() {
  const router = express.Router();

  /**
   * Search accommodations with optional filters.
   */
  router.get('/search', async (req, res) => {
    try {
      const dbPath = process.env.DB_PATH || '../database/accommodations.db';
      const db = openDb(dbPath);

      try {
        const params = parseSearchParams(req.query);
        const result = await searchAccommodations(db, params);
        res.json(result);
      } finally {
        db.close();
      }
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
