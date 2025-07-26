"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../config/database");
const router = express_1.default.Router();
// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        console.log('🔍 Fetching dashboard stats...');
        // Get stores stats - using service role to bypass RLS
        const { data: stores, error: storesError } = await database_1.supabase
            .from('stores')
            .select('id, is_active');
        console.log('📊 Stores query result:', { stores: stores?.length, error: storesError });
        if (storesError) {
            console.error('❌ Stores error:', storesError);
            throw storesError;
        }
        // Get products stats - get ALL products, not just active ones
        const { data: products, error: productsError } = await database_1.supabase
            .from('products')
            .select('id, is_active');
        console.log('📦 Products query result:', { products: products?.length, error: productsError });
        if (productsError) {
            console.error('❌ Products error:', productsError);
            throw productsError;
        }
        // Get orders stats
        const { data: orders, error: ordersError } = await database_1.supabase
            .from('orders')
            .select('id, status, total');
        console.log('📋 Orders query result:', { orders: orders?.length, error: ordersError });
        if (ordersError) {
            console.error('❌ Orders error:', ordersError);
            throw ordersError;
        }
        // Calculate stats
        const totalStores = stores?.length || 0;
        const activeStores = stores?.filter(store => store.is_active).length || 0;
        const totalProducts = products?.length || 0; // Show ALL products, not just active ones
        const activeProducts = products?.filter(product => product.is_active).length || 0;
        const inactiveProducts = totalProducts - activeProducts;
        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
        // Count orders by status
        const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
        const processingOrders = orders?.filter(order => ['confirmed', 'preparing', 'ready', 'out_for_delivery'].includes(order.status)).length || 0;
        const deliveredOrders = orders?.filter(order => order.status === 'delivered').length || 0;
        const cancelledOrders = orders?.filter(order => order.status === 'cancelled').length || 0;
        const stats = {
            totalStores,
            activeStores,
            totalProducts,
            activeProducts,
            inactiveProducts,
            totalOrders,
            totalRevenue,
            pendingOrders,
            processingOrders,
            deliveredOrders,
            cancelledOrders,
        };
        console.log('✅ Calculated stats:', stats);
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('❌ Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard statistics',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Get recent orders
router.get('/recent-orders', async (req, res) => {
    try {
        console.log('🔍 Fetching recent orders...');
        const { data: orders, error } = await database_1.supabase
            .from('orders')
            .select(`
        id,
        order_number,
        customer_name,
        total,
        status,
        created_at,
        stores (
          name
        )
      `)
            .order('created_at', { ascending: false })
            .limit(10);
        console.log('📋 Recent orders query result:', { orders: orders?.length, error });
        if (error) {
            console.error('❌ Recent orders error:', error);
            throw error;
        }
        const formattedOrders = orders?.map(order => ({
            id: order.id,
            order_number: order.order_number,
            customer_name: order.customer_name,
            total: order.total || 0,
            status: order.status,
            created_at: order.created_at,
            store_name: order.stores?.name || 'غير محدد'
        })) || [];
        console.log('✅ Formatted orders:', formattedOrders.length);
        res.json({
            success: true,
            data: formattedOrders
        });
    }
    catch (error) {
        console.error('❌ Error fetching recent orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch recent orders',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map