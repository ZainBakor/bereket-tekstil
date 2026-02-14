import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkRLS() {
    console.log('Checking RLS status for profiles...');
    const { data: rlsStatus, error: rlsError } = await supabase.rpc('get_rls_status', { table_name: 'profiles' });

    // If RPC doesn't exist, try raw query
    const { data: policies, error: policyError } = await supabase
        .from('pg_policy')
        .select('*')
        .eq('schemaname', 'public')
        .eq('tablename', 'profiles');

    console.log('POLICIES:' + JSON.stringify(policies));
}

checkProfiles();
