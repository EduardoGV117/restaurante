import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Table, Button, Modal, Form, Row, Col
} from 'react-bootstrap';

const ComandasActivas = () => {
  const [comandas, setComandas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [comandaSeleccionada, setComandaSeleccionada] = useState(null);
  const [propina, setPropina] = useState(0);
  const [dist, setDist] = useState({ meseros: 60, cocina: 30, bar: 10 });

  const fetchComandas = async () => {
    const res = await axios.get('http://localhost:4000/api/comandas');
    setComandas(res.data);
  };

  useEffect(() => {
    fetchComandas();
  }, []);

  const abrirModal = (comanda) => {
    const total = comanda.items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
    setPropina((total * 0.1).toFixed(2));
    setComandaSeleccionada(comanda);
    setShowModal(true);
  };

  const pagarComanda = async () => {
    const totalPorcentaje = parseInt(dist.meseros) + parseInt(dist.cocina) + parseInt(dist.bar);
    if (totalPorcentaje !== 100) return alert('La suma debe ser 100%');

    try {
      await axios.post('http://localhost:4000/api/ventas', {
        comanda_id: comandaSeleccionada.id,
        propina: parseFloat(propina),
        distribucion: {
          meseros: dist.meseros / 100,
          cocina: dist.cocina / 100,
          bar: dist.bar / 100
        }
      });
      alert('Venta registrada');
      setShowModal(false);
      fetchComandas();
    } catch (err) {
      console.error(err);
      alert('Error al pagar');
    }
  };

  return (
    <Container className="my-4">
      <h3>Comandas Activas</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mesa</th>
            <th>Camarero</th>
            <th>Items</th>
            <th>Total</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {comandas.map(c => (
            <tr key={c.id}>
              <td>{c.mesa_id}</td>
              <td>{c.camarero}</td>
              <td>{c.items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ')}</td>
              <td>${(c.items?.reduce((sum, i) => sum + (i.precio || 0) * (i.cantidad || 0), 0)).toFixed(2)}</td>
              <td><Button onClick={() => abrirModal(c)}>Pagar</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Pagar Comanda</Modal.Title></Modal.Header>
        <Modal.Body>
          <p><strong>Mesa:</strong> {comandaSeleccionada?.mesa_id}</p>
          <Form.Group className="mb-3">
            <Form.Label>Propina (MXN)</Form.Label>
            <Form.Control type="number" value={propina} onChange={(e) => setPropina(e.target.value)} />
          </Form.Group>
          <h5>Distribución de Propina</h5>
          <Row>
            <Col><Form.Label>Meseros %</Form.Label><Form.Control type="number" value={dist.meseros} onChange={(e) => setDist({ ...dist, meseros: e.target.value })} /></Col>
            <Col><Form.Label>Cocina %</Form.Label><Form.Control type="number" value={dist.cocina} onChange={(e) => setDist({ ...dist, cocina: e.target.value })} /></Col>
            <Col><Form.Label>Bar %</Form.Label><Form.Control type="number" value={dist.bar} onChange={(e) => setDist({ ...dist, bar: e.target.value })} /></Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="success" onClick={pagarComanda}>Confirmar Pago</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ComandasActivas;
