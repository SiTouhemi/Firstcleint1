"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
// GET /api/cities - List all cities
router.get('/', async (req, res) => {
    try {
        const { data: cities, error } = await database_1.supabase
            .from('cities')
            .select('*')
            .order('id', { ascending: true });
        if (error)
            throw error;
        res.json(cities);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch cities', details: String(err.message || err) });
    }
});
// POST /api/cities - Add a new city
router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name)
        return res.status(400).json({ error: 'City name is required' });
    try {
        const { data, error } = await database_1.supabase
            .from('cities')
            .insert([{ name, is_active: true }])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json(data);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to add city', details: String(err.message || err) });
    }
});
// PATCH /api/cities/:id/toggle - Toggle is_active status
router.patch('/:id/toggle', async (req, res) => {
    const { id } = req.params;
    try {
        // Get current status
        const { data: city, error: getError } = await database_1.supabase
            .from('cities')
            .select('is_active')
            .eq('id', id)
            .single();
        if (getError || !city)
            return res.status(404).json({ error: 'City not found' });
        const { data, error } = await database_1.supabase
            .from('cities')
            .update({ is_active: !city.is_active })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to toggle city status', details: String(err.message || err) });
    }
});
exports.default = router;
//# sourceMappingURL=cities.js.map