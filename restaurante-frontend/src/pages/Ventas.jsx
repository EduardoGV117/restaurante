import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table } from 'react-bootstrap';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/ventas')
      .then(res => setVentas(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container className="my-4">
      <h3>Ventas del Día</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mesa</th>
            <th>Camarero</th>
            <th>Total</th>
            <th>Propina</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id}>
              <td>{v.mesa_id}</td>
              <td>{v.camarero}</td>
              <td>${v.total}</td>
              <td>${v.propina}</td>
              <td>{new Date(v.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Ventas;
