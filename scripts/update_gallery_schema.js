import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateSchema() {
    console.log('Adding category column to works_gallery...');
    const { error } = await supabase.rpc('add_category_column');

    if (error) {
        console.log('RPC failed, trying raw query if possible (Note: usually needs SQL editor for DDL)');
        // In some setups, you might have an RPC that can run SQL, but if not, 
        // the user has to run the SQL in the dashboard as instructed.
        console.error('Error:', error.message);
    } else {
        console.log('Column added successfully via RPC.');
    }
}

// Since I don't know if 'add_category_column' RPC exists, I'll just try to 
// check if the column is already there by doing a sample insert/select.
async function checkColumn() {
    const { data, error } = await supabase.from('works_gallery').select('category').limit(1);
    if (error) {
        console.log('Category column does not seem to exist yet.');
        console.log('Please make sure to run the SQL in Supabase Dashboard:');
        console.log("ALTER TABLE public.works_gallery ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';");
    } else {
        console.log('Category column exists!');
    }
}

checkColumn();
