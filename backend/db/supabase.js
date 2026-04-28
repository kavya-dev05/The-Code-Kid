const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('\n❌ CRITICAL: Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n   Please check your .env file and restart the server.\n');
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Validate database connection on startup
async function validateConnection() {
  try {
    // Test connection by attempting to fetch from a system table
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true }).limit(1);

    if (error) {
      if (error.code === 'PGRST116') {
        // Table doesn't exist yet - this is okay during initial setup
        console.warn('⚠️  Warning: profiles table not found. Run database migration first.');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Supabase connection validated successfully');
    }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.error('   Check your SUPABASE_URL and SUPABASE_SERVICE_KEY');
    process.exit(1);
  }
}

// Export validation function for server startup
module.exports = Object.assign(supabase, { validateConnection });