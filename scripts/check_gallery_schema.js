import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkCases() {
    let output = '';
    const names = [
        'works_galary', 'works_gallery',
        'Works_Galary', 'Works_Gallery',
        'WORKS_GALARY', 'WORKS_GALLERY',
        'works_galerie', 'galeri', 'gallery'
    ];
    for (const name of names) {
        const { error: e } = await supabase.from(name).select('*').limit(1);
        if (!e) {
            output += `FOUND: ${name}\n`;
        } else {
            output += `NOT FOUND: ${name} (Error: ${e.code} - ${e.message})\n`;
        }
    }
    fs.writeFileSync('case_check_results.txt', output);
}

checkCases();
