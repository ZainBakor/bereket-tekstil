import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function identifyColumns() {
    let output = 'Definitive Column Identification for works_gallery:\n';
    try {
        // Try to query the columns via RPC if it exists, but we know it might fail.
        // Instead, let's try a different approach: select a known non-existent column 
        // to get an error that lists valid ones, OR just use the previous failure hint.

        // Actually, let's try to query information_schema directly if permissions allow.
        const { data, error } = await supabase
            .from('works_gallery')
            .select('*')
            .limit(1);

        if (error) {
            output += `Error during select *: ${error.message}\n`;
        } else if (data && data.length > 0) {
            output += `Sample record columns: ${Object.keys(data[0]).join(', ')}\n`;
        } else {
            output += 'Table is empty, cannot deduce columns from select *.\n';
        }

        // Try to insert a very large object to see if PostgREST tells us which keys are invalid
        const { error: insertError } = await supabase
            .from('works_gallery')
            .insert({
                test_nonexistent_column: true
            });

        if (insertError) {
            output += `Insert Error (expected): ${insertError.message}\n`;
            output += `Hint: ${insertError.hint}\n`;
            output += `Details: ${insertError.details}\n`;
        }

    } catch (e) {
        output += `Exception: ${e.message}\n`;
    }
    fs.writeFileSync('definitive_columns.txt', output);
    console.log(output);
}

identifyColumns();
