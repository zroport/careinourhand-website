const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function reset() {
  const hash = '$2b$10$TCXg.ZFVyKEjdiiVLX0Zb.vtw1e/jTPs5SimxVJkvZ9idpnETa02C';
  await pool.query(`UPDATE "User" SET password = $1 WHERE email = $2`, [hash, 'admin@careinourhand.com.au']);
  console.log('✅ Password reset to admin123!');
  await pool.end();
}

reset().catch(console.error);