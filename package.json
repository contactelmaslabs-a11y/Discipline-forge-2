// server/index-prod.ts
import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();

/** === CORS === */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // temporarily allow everything (keeps deployed app working).
    return callback(null, true);
  }
}));

/**
 * Try several candidate directories to find the built frontend (index.html).
 * This handles different Vite/SSR/monorepo setups.
 */
const candidates = [
  path.join(process.cwd(), 'dist'),            // common Vite output
  path.join(process.cwd(), 'dist', 'client'), // some projects put client in dist/client
  path.join(process.cwd(), 'dist', 'public'),
  path.join(process.cwd(), 'public'),
  path.join(process.cwd(), 'build')
];

let staticDir: string | null = null;
let foundIndexPath: string | null = null;

for (const dir of candidates) {
  const indexPath = path.join(dir, 'index.html');
  try {
    if (fs.existsSync(indexPath)) {
      staticDir = dir;
      foundIndexPath = indexPath;
      break;
    }
  } catch (e) {
    // ignore and continue
  }
}

// If we didn't find index.html, log the contents of dist (for debugging) and still attempt to serve whatever is in `dist`
if (!staticDir) {
  const fallbackDir = path.join(process.cwd(), 'dist');
  console.warn('Warning: index.html not found in expected locations. Listing dist contents for debugging...');
  try {
    const walk = (d: string, depth = 0) => {
      if (!fs.existsSync(d)) return [];
      return fs.readdirSync(d).flatMap(name => {
        const full = path.join(d, name);
        const stat = fs.statSync(full);
        if (stat.isDirectory() && depth < 3) {
          return [name + '/', ...walk(full, depth + 1).map(x => '  ' + x)];
        }
        return [name];
      });
    };
    const files = walk(fallbackDir);
    console.warn('dist/ contents:\n' + (files.length ? files.join('\n') : '<empty or does not exist>'));
  } catch (err) {
    console.warn('Could not list dist contents:', err);
  }
  staticDir = fallbackDir;
}

/** Serve static files (if any) from the chosen directory */
app.use(express.static(staticDir));

// health endpoint
app.get('/_health', (req, res) => {
  res.json({ ok: true, ts: Date.now(), staticDir });
});

// example API endpoint (keep or replace with your real routes)
app.get('/api/ping', (req, res) => {
  res.json({ pong: true });
});

/** Fallback to index.html for client-side routing, but only if it exists */
app.get('*', (req, res) => {
  const indexFile = path.join(staticDir as string, 'index.html');
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }
  // If index.html truly does not exist, return a helpful message instead of 500
  res.status(404).send(`
    <h2>Frontend not found</h2>
    <p>The server could not find <code>index.html</code> in <code>${staticDir}</code>.</p>
    <p>Check the build logs to see whether Vite produced the frontend files.</p>
    <pre>Looked in: ${candidates.join(', ')}</pre>
  `);
});

/** Start server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} — staticDir=${staticDir}`);
});
