"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
// GET /api/promo-codes - List all promo codes
router.get('/', async (req, res) => {
    try {
        const { data, error } = await database_1.supabase
            .from('promo_codes')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err.message || err) });
    }
});
// POST /api/promo-codes - Add a new promo code
router.post('/', async (req, res) => {
    try {
        const { data, error } = await database_1.supabase
            .from('promo_codes')
            .insert([req.body])
            .select()
            .single();
        if (error)
            throw error;
        res.status(201).json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err.message || err) });
    }
});
// PATCH /api/promo-codes/:id - Update a promo code
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await database_1.supabase
            .from('promo_codes')
            .update(req.body)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err.message || err) });
    }
});
// PATCH /api/promo-codes/:id/toggle - Toggle is_active
router.patch('/:id/toggle', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: promo, error: getError } = await database_1.supabase
            .from('promo_codes')
            .select('is_active')
            .eq('id', id)
            .single();
        if (getError || !promo)
            return res.status(404).json({ success: false, error: 'Promo code not found' });
        const { data, error } = await database_1.supabase
            .from('promo_codes')
            .update({ is_active: !promo.is_active })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err.message || err) });
    }
});
// DELETE /api/promo-codes/:id - Delete a promo code
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await database_1.supabase
            .from('promo_codes')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err.message || err) });
    }
});
// POST /api/promo-codes/validate - Validate a promo code
router.post('/validate', async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        if (!code) {
            return res.status(400).json({
                success: false,
                error: "كود الخصم مطلوب"
            });
        }
        // Get the promo code from database
        const { data: promoCode, error } = await database_1.supabase
            .from('promo_codes')
            .select('*')
            .eq('code', code.toUpperCase())
            .single();
        if (error || !promoCode) {
            return res.status(404).json({
                success: false,
                error: "كود الخصم غير صحيح"
            });
        }
        // Check if promo code is active
        if (!promoCode.is_active) {
            return res.status(400).json({
                success: false,
                error: "كود الخصم غير مفعل"
            });
        }
        // Check if promo code is within date range
        const now = new Date();
        const startDate = promoCode.start_date ? new Date(promoCode.start_date) : null;
        const endDate = promoCode.end_date ? new Date(promoCode.end_date) : null;
        if (startDate && now < startDate) {
            return res.status(400).json({
                success: false,
                error: "كود الخصم لم يبدأ بعد"
            });
        }
        if (endDate && now > endDate) {
            return res.status(400).json({
                success: false,
                error: "كود الخصم منتهي الصلاحية"
            });
        }
        // Check minimum order amount
        if (promoCode.min_order_amount && subtotal < promoCode.min_order_amount) {
            return res.status(400).json({
                success: false,
                error: `الحد الأدنى للطلب ${promoCode.min_order_amount} ر.س`
            });
        }
        // Check usage limit
        if (promoCode.usage_limit && promoCode.used_count >= promoCode.usage_limit) {
            return res.status(400).json({
                success: false,
                error: "كود الخصم استنفذ عدد مرات الاستخدام"
            });
        }
        // Calculate discount
        let discountAmount = 0;
        if (promoCode.discount_type === 'percentage') {
            discountAmount = (subtotal * promoCode.discount_value) / 100;
            // Apply max discount limit if set
            if (promoCode.max_discount_amount && discountAmount > promoCode.max_discount_amount) {
                discountAmount = promoCode.max_discount_amount;
            }
        }
        else if (promoCode.discount_type === 'fixed') {
            discountAmount = promoCode.discount_value;
        }
        // Ensure discount doesn't exceed subtotal
        if (discountAmount > subtotal) {
            discountAmount = subtotal;
        }
        return res.json({
            success: true,
            discount_amount: discountAmount,
            message: `تم تطبيق الخصم بنجاح: ${discountAmount.toFixed(2)} ر.س`,
            promo_code: promoCode
        });
    }
    catch (err) {
        console.error('Promo code validation error:', err);
        res.status(500).json({
            success: false,
            error: "حدث خطأ في التحقق من كود الخصم"
        });
    }
});
exports.default = router;
//# sourceMappingURL=promo-codes.js.map