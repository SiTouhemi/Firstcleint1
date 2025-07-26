const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function checkDatabase() {
  console.log('🔍 Checking database content...\n');

  try {
    // Check stores
    console.log('📊 Checking stores...');
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, name, is_active');
    
    if (storesError) {
      console.error('❌ Stores error:', storesError);
    } else {
      console.log(`✅ Found ${stores?.length || 0} stores:`);
      stores?.forEach(store => {
        console.log(`  - ${store.name} (active: ${store.is_active})`);
      });
    }

    // Check products
    console.log('\n📦 Checking products...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, is_active');
    
    if (productsError) {
      console.error('❌ Products error:', productsError);
    } else {
      console.log(`✅ Found ${products?.length || 0} products:`);
      products?.slice(0, 5).forEach(product => {
        console.log(`  - ${product.name} (active: ${product.is_active})`);
      });
      if (products && products.length > 5) {
        console.log(`  ... and ${products.length - 5} more`);
      }
    }

         // Check orders
     console.log('\n📋 Checking orders...');
     const { data: orders, error: ordersError } = await supabase
       .from('orders')
       .select('id, order_number, status, total');
     
     if (ordersError) {
       console.error('❌ Orders error:', ordersError);
     } else {
       console.log(`✅ Found ${orders?.length || 0} orders:`);
       orders?.slice(0, 5).forEach(order => {
         console.log(`  - ${order.order_number} (${order.status}, ${order.total})`);
       });
       if (orders && orders.length > 5) {
         console.log(`  ... and ${orders.length - 5} more`);
       }
     }

     // Check admin users
     console.log('\n👥 Checking admin users...');
     const { data: adminUsers, error: adminUsersError } = await supabase
       .from('admin_users')
       .select('id, username, is_active');
     
     if (adminUsersError) {
       console.error('❌ Admin users error:', adminUsersError);
     } else {
       console.log(`✅ Found ${adminUsers?.length || 0} admin users:`);
       adminUsers?.forEach(user => {
         console.log(`  - ${user.username} (active: ${user.is_active})`);
       });
     }

    // Check if tables exist
    console.log('\n🔍 Checking table structure...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('❌ Tables error:', tablesError);
    } else {
      console.log('✅ Available tables:');
      tables?.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

checkDatabase(); 