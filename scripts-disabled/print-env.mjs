import 'dotenv/config';

function show(name) {
  const v = process.env[name];
  console.log(
    name + ':',
    v ? (name.includes('KEY') ? (v.slice(0, 10) + '...') : v) : '(missing)'
  );
}

show('SUPABASE_URL');
show('SUPABASE_ANON_KEY');
show('SUPABASE_SERVICE_ROLE_KEY');
show('COHERE_API_KEY');
