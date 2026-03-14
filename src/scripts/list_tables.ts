import pg from 'pg';

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables:", tables.rows.map(r => r.table_name));

    const columns = await pool.query(`
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name ILIKE 'order'
    `);
    console.log("Columns for 'order' (case insensitive):", columns.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

main();
