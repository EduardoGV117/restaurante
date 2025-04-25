const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/productos
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos ORDER BY tipo, nombre');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos del menú' });
  }
});

module.exports = router;
