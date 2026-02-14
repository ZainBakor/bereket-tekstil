import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function listTables() {
    console.log('Listing all tables in public schema...');
    const { data: tables, error } = await supabase.rpc('get_tables');

    if (error) {
        // Fallback: Try a raw query to check some common table names if RPC fails
        console.log('RPC failed, checking individual tables...');
        const possibleTables = ['categories', 'products', 'colors', 'sizes', 'works_gallery', 'orders', 'order_items', 'profiles', 'site_content'];
        for (const table of possibleTables) {
            const { error: checkError } = await supabase.from(table).select('*').limit(1);
            if (!checkError) {
                console.log(`- Table [${table}] exists`);
            } else if (checkError.code !== '42P01') { // 42P01 is "relation does not exist"
                console.log(`- Table [${table}] might exist (Error: ${checkError.message})`);
            }
        }
    } else {
        console.log('Tables:', tables);
    }
}

listTables();
