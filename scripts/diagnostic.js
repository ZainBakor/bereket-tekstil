import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function diagnostic() {
    let log = 'Starting diagnostic...\n';
    try {
        const tableName = 'works_gallery';
        log += `Testing table: ${tableName}\n`;

        // 1. Check if table exists
        const { data: selectData, error: selectError } = await supabase.from(tableName).select('*').limit(1);
        if (selectError) {
            log += `Select Error: ${selectError.code} - ${selectError.message}\n`;
        } else {
            log += `Select Success: Data length ${selectData.length}\n`;
        }

        // 2. Try to insert
        const testItem = {
            title: 'Diagnostic Test',
            url: 'https://example.com/test.jpg',
            type: 'image',
            category: 'universite'
        };
        log += `Attempting insert of: ${JSON.stringify(testItem)}\n`;
        const { data: insertData, error: insertError } = await supabase.from(tableName).insert(testItem).select();
        if (insertError) {
            log += `Insert Error: ${insertError.code} - ${insertError.message}\n`;
            log += `Hint: ${insertError.hint || 'No hint'}\n`;
            log += `Details: ${insertError.details || 'No details'}\n`;
        } else {
            log += `Insert Success: ${JSON.stringify(insertData)}\n`;
        }

    } catch (e) {
        log += `CRITICAL EXCEPTION: ${e.message}\n`;
    }
    fs.writeFileSync('diagnostic_results.txt', log);
}

diagnostic();
