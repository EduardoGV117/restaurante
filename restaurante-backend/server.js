const express = require('express');
const cors = require('cors');
require('dotenv').config();

const mesasRoutes = require('./routes/mesas');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/mesas', mesasRoutes);

const comandasRoutes = require('./routes/comandas');
app.use('/api/comandas', comandasRoutes);

const productosRoutes = require('./routes/productos');
app.use('/api/productos', productosRoutes);

const ventasRoutes = require('./routes/ventas');
app.use('/api/ventas', ventasRoutes);

const inventarioRoutes = require('./routes/inventario');
app.use('/api/inventario', inventarioRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
