const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener comandas activas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM comandas WHERE estado = $1', ['activa']);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener comandas activas' });
  }
});

router.post('/', async (req, res) => {
    const { mesa_id, camarero, items } = req.body;
  
    try {
      const mesa = await db.query('SELECT * FROM mesas WHERE id = $1', [mesa_id]);
      if (!mesa.rows[0] || mesa.rows[0].estado !== 'disponible') {
        return res.status(400).json({ error: 'La mesa no está disponible' });
      }
  
      // Buscar precios reales desde la tabla productos
      const itemsFinal = [];
      for (const item of items) {
        const prod = await db.query('SELECT precio FROM productos WHERE nombre = $1 AND tipo = $2', [item.nombre, item.tipo]);
        if (prod.rows.length > 0) {
          itemsFinal.push({
            ...item,
            precio: parseFloat(prod.rows[0].precio)
          });
        }
      }
  
      const insert = await db.query(
        'INSERT INTO comandas (mesa_id, camarero, items, estado, fecha) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
        [mesa_id, camarero, JSON.stringify(itemsFinal), 'activa']
      );
      // Descontar ingredientes
        for (const item of itemsFinal) {
            const producto = await db.query('SELECT ingredientes FROM productos WHERE nombre = $1', [item.nombre]);
            if (producto.rows.length === 0) continue;
            const ingredientes = producto.rows[0].ingredientes;
        
            for (const [nombreInsumo, cantidad] of Object.entries(ingredientes)) {
            const cantidadTotal = cantidad * item.cantidad;
            await db.query('UPDATE inventario SET cantidad = cantidad - $1 WHERE nombre = $2', [cantidadTotal, nombreInsumo]);
            }
        }
  
      await db.query('UPDATE mesas SET estado = $1 WHERE id = $2', ['ocupada', mesa_id]);
  
      res.json({ success: true, comanda: insert.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al registrar comanda' });
    }
  });
  

module.exports = router;
