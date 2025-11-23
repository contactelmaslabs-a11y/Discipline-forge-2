// server/index-prod.ts
// Paste this file as-is if creating a new file.
// If your existing server file already sets up Express and `app`, see notes below.

import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();

/**
 * === CORS ===
 * Allow localhost (dev) and the Render domain (will be set at runtime).
 * If you have a custom domain later, add it to allowedOrigins.
 */
const allowedOrigins = [
  'http://localhost:5173', // Vite dev
  'http://localhost:3000'
];

// Permit requests with no Origin (curl, server-to-server)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow everything for now - remove the next line to restrict to allowedOrigins.
    return callback(null, true);
    // To restrict, uncomment the line below and remove the previous "allow everything" line:
    // return callback(new Error('CORS not allowed'), false);
  }
}));

/**
 * === Static files ===
 * Serve the Vite build located in <repo-root>/dist
 * (Your build script places frontend assets in `dist/`).
 */
const staticDir = path.join(process.cwd(), 'dist');
app.use(express.static(staticDir));

/**
 * Health endpoint for Render / monitoring
 */
app.get('/_health', (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

/**
 * API routes
 * If your existing code defines API routes (e.g., app.use('/api', ...)),
 * merge them here. Below is an example placeholder route.
 */
app.get('/api/ping', (req, res) => {
  res.json({ pong: true });
});

/**
 * Client-side routing fallback:
 * For any route not handled above, return index.html so the SPA can handle routing.
 * Place this after your API route registrations.
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

/**
 * === Start server (use process.env.PORT) ===
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


