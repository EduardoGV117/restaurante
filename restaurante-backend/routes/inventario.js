const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM inventario ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener inventario' });
  }
});

router.get('/reabastecer', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM inventario WHERE cantidad < minimo');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar productos bajos' });
  }
});

module.exports = router;
