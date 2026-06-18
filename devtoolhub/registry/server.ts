import express from 'express';
import cors from 'cors';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

function loadPlugins() {
  return JSON.parse(readFileSync(join(__dirname, 'plugins.json'), 'utf-8'));
}

app.get('/plugins', (_req, res) => {
  res.json(loadPlugins());
});

app.get('/plugins/:id', (req, res) => {
  const plugins = loadPlugins();
  const plugin = plugins.find((p: { id: string }) => p.id === req.params.id);
  if (!plugin) {
    res.status(404).json({ error: 'Plugin not found' });
    return;
  }
  res.json(plugin);
});

app.listen(PORT, () => {
  console.log(`Plugin registry running at http://localhost:${PORT}`);
  console.log(`  GET /plugins       — list all plugins`);
  console.log(`  GET /plugins/:id   — get plugin by id`);
});
