const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool, createTableIfNotExists } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

createTableIfNotExists();

// Rota de status
app.get('/', (req, res) => {
  res.send('Petshop Backend 🐶 funcionando!');
});

// Rota POST - novo agendamento
app.post('/agendamentos', async (req, res) => {
  const {
    cliente,
    data_agendada,
    pacote,
    avulso,
    valor_pacote,
    valor_avulso,
    pago,
    valor_total
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO agendamentos 
      (cliente, data_agendada, pacote, avulso, valor_pacote, valor_avulso, pago, valor_total) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [cliente, data_agendada, pacote, avulso, valor_pacote, valor_avulso, pago, valor_total]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao salvar agendamento:', err);
    res.status(500).json({ error: 'Erro interno ao salvar agendamento' });
  }
});

// Rota GET - listar agendamentos
app.get('/agendamentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM agendamentos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    res.status(500).json({ error: 'Erro interno ao buscar agendamentos' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
