import mariadb from 'mariadb';

async function createDb() {
  try {
    const pool = mariadb.createPool({ host: '127.0.0.1', user: 'root', password: '' });
    const conn = await pool.getConnection();
    await conn.query('CREATE DATABASE IF NOT EXISTS `rebon_motor_db`;');
    console.log('Database created or already exists');
    await conn.end();
    await pool.end();
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  }
}

createDb();
