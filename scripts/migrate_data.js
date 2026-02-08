import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { products, categories } from '../src/data/products.js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use SERVICE_ROLE_KEY for migration to bypass RLS
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Environment variables VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    console.log('Please add SUPABASE_SERVICE_ROLE_KEY to your .env file.');
    process.exit(1);
}

// Create client with service_role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function migrate() {
    console.log('Starting migration with Service Role...');

    // 1. Migrate Categories
    console.log('Migrating categories...');
    const { error: catError } = await supabase
        .from('categories')
        .upsert(categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
            image: cat.image,
            product_count: cat.productCount
        })));

    if (catError) {
        console.error('Error migrating categories:', catError);
        return;
    }
    console.log('Categories migrated successfully.');

    // 2. Migrate Products
    console.log('Migrating products...');
    const { error: prodError } = await supabase
        .from('products')
        .upsert(products.map(prod => ({
            name: prod.name,
            category_id: prod.category,
            price: prod.price,
            old_price: prod.oldPrice,
            description: prod.description,
            features: prod.features,
            images: prod.images,
            colors: prod.colors,
            sizes: prod.sizes,
            in_stock: prod.inStock,
            featured: prod.featured,
            bestseller: prod.bestseller
        })));

    if (prodError) {
        console.error('Error migrating products:', prodError);
        return;
    }
    console.log('Products migrated successfully.');

    console.log('Migration complete!');
}

migrate();
