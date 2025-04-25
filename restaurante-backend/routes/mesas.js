const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las mesas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM mesas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener las mesas' });
  }
});

// Cambiar estado de una mesa
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  try {
    await db.query('UPDATE mesas SET estado = $1 WHERE id = $2', [estado, id]);
    res.json({ message: 'Estado actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar la mesa' });
  }
});

module.exports = router;
