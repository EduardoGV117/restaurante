import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Row, Col } from 'react-bootstrap';

const CorteCaja = () => {
  const [corte, setCorte] = useState(null);

  const fetchCorte = async () => {
    const res = await axios.get('http://localhost:4000/api/ventas/corte');
    setCorte(res.data);
  };

  useEffect(() => {
    fetchCorte();
  }, []);

  if (!corte) return <Container className="my-4"><p>Cargando corte...</p></Container>;

  return (
    <Container className="my-4">
      <h3>Corte de Caja</h3>
      <Row>
        <Col><Card className="p-3 shadow"><h5>Total Ventas</h5><p>${(corte?.totalVentas || 0).toFixed(2)}</p></Card></Col>
        <Col><Card className="p-3 shadow"><h5>Propinas Totales</h5><p>${(corte?.totalPropinas || 0).toFixed(2)}</p></Card></Col>
      </Row>
      <h5 className="mt-4">Propinas por Área</h5>
      <Row>
        <Col><Card className="p-3"><strong>Meseros</strong><p>${(corte?.propinas?.meseros || 0).toFixed(2)}</p></Card></Col>
        <Col><Card className="p-3"><strong>Cocina</strong><p>${(corte?.propinas?.cocina || 0).toFixed(2)}</p></Card></Col>
        <Col><Card className="p-3"><strong>Bar</strong><p>${(corte?.propinas?.bar || 0).toFixed(2)}</p></Card></Col>
      </Row>
    </Container>
  );
};

export default CorteCaja;
