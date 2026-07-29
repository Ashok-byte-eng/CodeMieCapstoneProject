import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { createSearchRouter } from './routes/search.js';

/** Load environment variables from .env file into process.env. */
dotenv.config();

const app = express();

/** Configure CORS and JSON parsing middleware. */
app.use(cors());
app.use(express.json());

/** Basic health check endpoint for monitoring and local development. */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

/** Register API routes under /api. */
app.use('/api', createSearchRouter());

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

/** Start the HTTP server. */
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});
