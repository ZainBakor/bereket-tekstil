import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkColumns() {
    let output = 'Checking columns for works_gallery...\n';
    try {
        // Querying information_schema is usually the best way
        const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'works_gallery' });

        if (error) {
            output += `RPC failed: ${error.message}\n`;
            // Fallback: try to insert a row with an empty object and see the error (PostgreSQL often tells you expected columns or if its empty)
            const { error: insertError } = await supabase.from('works_gallery').insert({}).select();
            if (insertError) {
                output += `Insert into empty failed: ${insertError.message}\n`;
                output += `Hint: ${insertError.hint}\n`;
                output += `Details: ${insertError.details}\n`;
            }
        } else {
            output += `Columns: ${JSON.stringify(data)}\n`;
        }
    } catch (e) {
        output += `Exception: ${e.message}\n`;
    }
    fs.writeFileSync('column_check_results.txt', output);
}

checkColumns();
