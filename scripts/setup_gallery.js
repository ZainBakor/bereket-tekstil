import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function setup() {
    console.log('Ensuring works_gallery table exists...');

    // We can't easily create tables via JS client without RPC or unless we have SQL access
    // But we can check if it exists and what columns it has.
    const { error: checkError } = await supabase.from('works_gallery').select('*').limit(1);

    if (checkError && checkError.code === 'PGRST204') {
        console.log('Table works_gallery NOT found. You need to create it in Supabase SQL editor:');
        console.log(`
            create table public.works_gallery (
              id uuid default gen_random_uuid() primary key,
              caption text,
              media_url text not null,
              media_type text not null default 'image',
              thumbnail_url text,
              category text,
              display_order integer default 0,
              created_at timestamp with time zone default timezone('utc'::text, now()) not null
            );
            
            -- Enable RLS
            alter table public.works_gallery enable row level security;
            
            -- Allow public read
            create policy "Allow public read access" on public.works_gallery for select use true;
            
            -- Allow admin write (adjust according to your auth setup)
            create policy "Allow admin all access" on public.works_gallery for all using (auth.role() = 'authenticated');
        `);
    } else if (checkError) {
        console.error('Error checking table:', checkError.message);
    } else {
        console.log('Table works_gallery exists.');
    }

    console.log('Ensuring storage bucket exists...');
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
        console.error('Error listing buckets:', bucketError);
    } else {
        const galleryBucket = buckets.find(b => b.name === 'gallery');
        if (!galleryBucket) {
            console.log('Creating "gallery" bucket...');
            const { error: createBucketError } = await supabase.storage.createBucket('gallery', {
                public: true
            });
            if (createBucketError) {
                console.error('Error creating bucket:', createBucketError.message);
            } else {
                console.log('Bucket "gallery" created successfully.');
            }
        } else {
            console.log('Bucket "gallery" already exists.');
        }
    }
}

setup();
