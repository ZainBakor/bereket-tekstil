import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function addTestData() {
    console.log('Adding test gallery items to works_gallery...');
    const items = [
        {
            title: 'Test Mezuniyet Fotoğrafı',
            media_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop',
            thumbnail_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=150&fit=crop',
            type: 'image',
            category_id: 'universite'
        },
        {
            title: 'Test Mezuniyet Videosu',
            media_url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
            thumbnail_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=200&h=150&fit=crop',
            type: 'video',
            category_id: 'universite'
        }
    ];

    const { error } = await supabase
        .from('works_gallery')
        .insert(items);

    if (error) {
        console.error('Error adding test data:', error.message);
        console.error('Details:', error.details);
    } else {
        console.log('Test data added successfully.');
    }
}

addTestData();
