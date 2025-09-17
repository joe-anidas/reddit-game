import express from 'express';

const app = express();
app.use(express.json());

// Health probe (Devvit Web hits your bundled server code)
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Simple placeholder endpoints (not used by client anymore)
app.use('/api/game', (_req, res) => {
  res.json({ message: 'Game runs locally in client' });
});

export default app;