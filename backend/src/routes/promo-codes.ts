import { Router } from 'express';
import { supabase } from '../config/database';

const router = Router();

// GET /api/promo-codes - List all promo codes
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: String((err as Error).message || err) });
  }
});

// POST /api/promo-codes - Add a new promo code
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .insert([req.body])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: String((err as Error).message || err) });
  }
});

// PATCH /api/promo-codes/:id - Update a promo code
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('promo_codes')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: String((err as Error).message || err) });
  }
});

// PATCH /api/promo-codes/:id/toggle - Toggle is_active
router.patch('/:id/toggle', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: promo, error: getError } = await supabase
      .from('promo_codes')
      .select('is_active')
      .eq('id', id)
      .single();
    if (getError || !promo) return res.status(404).json({ success: false, error: 'Promo code not found' });
    const { data, error } = await supabase
      .from('promo_codes')
      .update({ is_active: !promo.is_active })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: String((err as Error).message || err) });
  }
});

// DELETE /api/promo-codes/:id - Delete a promo code
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: String((err as Error).message || err) });
  }
});

export default router; 