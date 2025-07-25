import { Router } from 'express';
import { getClient } from '../config/database';

const router = Router();

// GET /api/cities - List all cities
router.get('/', async (req, res) => {
  const client = getClient();
  try {
    const { rows } = await client.query('SELECT * FROM cities ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cities', details: err.message });
  }
});

// POST /api/cities - Add a new city
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'City name is required' });
  const client = getClient();
  try {
    const { rows } = await client.query('INSERT INTO cities (name, is_active) VALUES ($1, true) RETURNING *', [name]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add city', details: err.message });
  }
});

// PATCH /api/cities/:id/toggle - Toggle is_active status
router.patch('/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const client = getClient();
  try {
    const { rows } = await client.query('UPDATE cities SET is_active = NOT is_active WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'City not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle city status', details: err.message });
  }
});

export default router; 