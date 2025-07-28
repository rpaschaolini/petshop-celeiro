const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const createTableIfNotExists = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS agendamentos (
      id SERIAL PRIMARY KEY,
      cliente TEXT NOT NULL,
      data_agendada DATE NOT NULL,
      pacote TEXT,
      avulso TEXT,
      valor_pacote NUMERIC,
      valor_avulso NUMERIC,
      pago BOOLEAN,
      valor_total NUMERIC
    );
  `;
  try {
    await pool.query(query);
    console.log("🧱 Tabela 'agendamentos' pronta!");
  } catch (err) {
    console.error("Erro ao criar tabela:", err);
  }
};

module.exports = {
  pool,
  createTableIfNotExists
};
