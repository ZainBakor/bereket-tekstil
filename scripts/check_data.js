import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkData() {
    const { data, error } = await supabase.from('works_gallery').select('*').limit(5);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Current Data:', JSON.stringify(data, null, 2));
    }
}

checkData();
