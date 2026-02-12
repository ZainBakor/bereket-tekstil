import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    console.log('Checking orders...');
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_number')
        .limit(5);

    if (ordersError) {
        console.error('Orders error:', ordersError);
        return;
    }
    console.log('Last 5 orders:', orders);

    if (orders.length > 0) {
        const orderId = orders[0].id;
        console.log(`Checking items for order ${orderId}...`);

        const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select(`
                *,
                products (
                    id,
                    name
                )
            `)
            .eq('order_id', orderId);

        if (itemsError) {
            console.error('Items error:', itemsError);
            console.log('Trying without join...');
            const { data: itemsSimple, error: itemsSimpleError } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', orderId);

            if (itemsSimpleError) {
                console.error('Simple items error:', itemsSimpleError);
            } else {
                console.log('Simple items (no join):', itemsSimple);
            }
        } else {
            console.log('Order items with products:', items);
        }
    }

    console.log('Checking products table...');
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name')
        .limit(5);

    if (productsError) {
        console.error('Products error:', productsError);
    } else {
        console.log('First 5 products in DB:', products);
    }
}

check();
