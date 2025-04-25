import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Badge } from 'react-bootstrap';

const Mesas = () => {
  const [mesas, setMesas] = useState([]);

  const fetchMesas = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/mesas');
      setMesas(res.data);
    } catch (err) {
      console.error('Error al cargar las mesas:', err);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      await axios.put(`http://localhost:4000/api/mesas/${id}`, { estado: nuevoEstado });
      fetchMesas(); // recarga las mesas
    } catch (err) {
      console.error('Error al cambiar estado:', err);
    }
  };

  useEffect(() => {
    fetchMesas();
  }, []);

  return (
    <Container className="my-4">
      <h2 className="text-center mb-4">Gestión de Mesas</h2>
      <Row xs={1} md={3} lg={4} className="g-4">
        {mesas.map(mesa => (
          <Col key={mesa.id}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>Mesa #{mesa.id}</Card.Title>
                <Card.Text>
                  <strong>Capacidad:</strong> {mesa.capacidad}
                  <br />
                  <strong>Estado:</strong>{' '}
                  <Badge bg={mesa.estado === 'disponible' ? 'success' : 'danger'}>
                    {mesa.estado}
                  </Badge>
                </Card.Text>
                <Button
                  variant={mesa.estado === 'disponible' ? 'danger' : 'success'}
                  onClick={() =>
                    cambiarEstado(mesa.id, mesa.estado === 'disponible' ? 'ocupada' : 'disponible')
                  }
                >
                  {mesa.estado === 'disponible' ? 'Ocupar' : 'Liberar'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Mesas;
