import pg from 'pg';

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const columns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'orders'
    `);
    console.log("Columns in 'orders' table:");
    console.log(columns.rows.map(r => r.column_name));
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

main();
