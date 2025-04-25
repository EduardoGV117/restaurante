import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Row, Col, Card, Form, Button, Table
} from 'react-bootstrap';

const Comandas = () => {
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState('');
  const [camarero, setCamarero] = useState('');
  const [items, setItems] = useState([{ tipo: 'comida', nombre: '', cantidad: 1 }]);
  const [comandas, setComandas] = useState([]);

  const camareros = ['Carlos Rodríguez', 'María López', 'Juan Pérez', 'Laura García'];

  useEffect(() => {
    fetchMesas();
    fetchComandas();
  }, []);

  const fetchMesas = async () => {
    const res = await axios.get('http://localhost:4000/api/mesas');
    setMesas(res.data.filter(m => m.estado === 'disponible'));
  };

  const fetchComandas = async () => {
    const res = await axios.get('http://localhost:4000/api/comandas');
    setComandas(res.data);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = (tipo) => {
    setItems([...items, { tipo, nombre: '', cantidad: 1 }]);
  };
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchMesas();
    fetchComandas();
    fetchProductos();
  }, []);
  
  const fetchProductos = async () => {
    const res = await axios.get('http://localhost:4000/api/productos');
    setProductos(res.data);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mesaSeleccionada || !camarero || items.length === 0) return alert("Faltan datos");

    try {
      await axios.post('http://localhost:4000/api/comandas', {
        mesa_id: mesaSeleccionada,
        camarero,
        items
      });
      alert('Comanda registrada');
      setItems([{ tipo: 'comida', nombre: '', cantidad: 1 }]);
      setMesaSeleccionada('');
      setCamarero('');
      fetchMesas();
      fetchComandas();
    } catch (err) {
      console.error(err);
      alert('Error al registrar comanda');
    }
  };

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Gestión de Comandas</h2>
      <Card className="p-4 shadow-sm mb-5">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Label>Mesa</Form.Label>
              <Form.Select value={mesaSeleccionada} onChange={(e) => setMesaSeleccionada(e.target.value)}>
                <option value="">Seleccionar mesa</option>
                {mesas.map(mesa => (
                  <option key={mesa.id} value={mesa.id}>
                    Mesa #{mesa.id} (capacidad {mesa.capacidad})
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Camarero</Form.Label>
              <Form.Select value={camarero} onChange={(e) => setCamarero(e.target.value)}>
                <option value="">Seleccionar camarero</option>
                {camareros.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <h5>Items de la comanda</h5>
          {items.map((item, index) => (
            <Row key={index} className="mb-2">
              <Col md={4}>
                <Form.Select
                  value={item.tipo}
                  onChange={(e) => handleItemChange(index, 'tipo', e.target.value)}
                >
                  <option value="comida">Comida</option>
                  <option value="bebida">Bebida</option>
                </Form.Select>
              </Col>
              <Col md={4}>
              <Form.Select
                value={item.nombre}
                onChange={(e) => handleItemChange(index, 'nombre', e.target.value)}
                >
                <option value="">Seleccionar producto</option>
                {productos
                    .filter(p => p.tipo === item.tipo)
                    .map(p => (
                    <option key={p.id} value={p.nombre}>
                        {p.nombre} – ${p.precio}
                    </option>
                ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Control
                  type="number"
                  value={item.cantidad}
                  onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                  min="1"
                />
              </Col>
            </Row>
          ))}

          <Button variant="secondary" className="me-2" onClick={() => addItem('comida')}>+ Plato</Button>
          <Button variant="secondary" onClick={() => addItem('bebida')}>+ Bebida</Button>
          <Button type="submit" variant="primary" className="float-end">Guardar Comanda</Button>
        </Form>
      </Card>

      <h4>Comandas Activas</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mesa</th>
            <th>Camarero</th>
            <th>Items</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {comandas.map(c => (
            <tr key={c.id}>
              <td>{c.mesa_id}</td>
              <td>{c.camarero}</td>
              <td>{c.items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ')}</td>
              <td>{new Date(c.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Comandas;
