import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Badge } from 'react-bootstrap';

const Inventario = () => {
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/inventario')
      .then(res => setInventario(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container className="my-4">
      <h3>Inventario Actual</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Unidad</th>
            <th>Mínimo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {inventario.map(i => {
            const necesita = parseFloat(i.cantidad) < parseFloat(i.minimo);
            return (
              <tr key={i.nombre}>
                <td>{i.nombre}</td>
                <td>{parseFloat(i.cantidad).toFixed(2)}</td>
                <td>{i.unidad}</td>
                <td>{i.minimo}</td>
                <td>
                  {necesita ? <Badge bg="danger">¡Reabastecer!</Badge> : <Badge bg="success">OK</Badge>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Inventario;
