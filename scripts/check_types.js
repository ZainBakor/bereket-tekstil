import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function guessColumns() {
    let log = '';
    const tableName = 'works_gallery';

    const tryInsert = async (obj) => {
        log += `Trying: ${JSON.stringify(obj)}\n`;
        const { error } = await supabase.from(tableName).insert(obj).select();
        if (error) {
            log += `Error: ${error.code} - ${error.message}\n`;
        } else {
            log += `SUCCESS!\n`;
        }
    };

    // We know media_url is required.
    // Let's try to add one more field at a time to see what's valid.
    await tryInsert({ media_url: 'test', title: 'test' });
    await tryInsert({ media_url: 'test', name: 'test' });
    await tryInsert({ media_url: 'test', caption: 'test' });
    await tryInsert({ media_url: 'test', type: 'image' });
    await tryInsert({ media_url: 'test', media_type: 'image' });
    await tryInsert({ media_url: 'test', category_id: 'universite' });
    await tryInsert({ media_url: 'test', category: 'universite' });

    fs.writeFileSync('guess_results.txt', log);
}

guessColumns();
