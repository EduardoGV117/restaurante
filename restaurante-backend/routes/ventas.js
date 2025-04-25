const express = require('express');
const router = express.Router();
const db = require('../db');

// Registrar una venta
router.post('/', async (req, res) => {
  const { comanda_id, propina, distribucion } = req.body;

  try {
    const comanda = await db.query('SELECT * FROM comandas WHERE id = $1 AND estado = $2', [comanda_id, 'activa']);
    if (!comanda.rows.length) return res.status(400).json({ error: 'Comanda no válida o ya pagada' });

    const total = comanda.rows[0].items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    await db.query(
      'INSERT INTO ventas (comanda_id, total, propina, distribucion) VALUES ($1, $2, $3, $4)',
      [comanda_id, total, propina, distribucion]
    );

    await db.query('UPDATE comandas SET estado = $1 WHERE id = $2', ['pagada', comanda_id]);
    await db.query('UPDATE mesas SET estado = $1 WHERE id = $2', ['disponible', comanda.rows[0].mesa_id]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar venta' });
  }
});

// Obtener ventas del día
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT v.*, c.mesa_id, c.camarero
      FROM ventas v
      JOIN comandas c ON c.id = v.comanda_id
      WHERE v.fecha::date = CURRENT_DATE
      ORDER BY v.fecha DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ventas' });
  }
});

// Corte de caja
router.get('/corte', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM ventas WHERE fecha::date = CURRENT_DATE');
    let totalVentas = 0;
    let totalPropinas = 0;
    let propinas = { meseros: 0, cocina: 0, bar: 0 };

    for (const v of result.rows) {
      totalVentas += parseFloat(v.total);
      totalPropinas += parseFloat(v.propina || 0);
      const dist = v.distribucion || {};
      propinas.meseros += (v.propina || 0) * (dist.meseros || 0);
      propinas.cocina += (v.propina || 0) * (dist.cocina || 0);
      propinas.bar += (v.propina || 0) * (dist.bar || 0);
    }

    res.json({ totalVentas, totalPropinas, propinas });
  } catch (err) {
    res.status(500).json({ error: 'Error en corte de caja' });
  }
});

module.exports = router;
