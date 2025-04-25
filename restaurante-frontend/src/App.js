import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Mesas from './pages/Mesas';
import Comandas from './pages/Comandas';
import ComandasActivas from './pages/ComandasActivas';
import Ventas from './pages/Ventas';
import CorteCaja from './pages/CorteCaja';
import Inventario from './pages/Inventario';

function App() {
  const [vista, setVista] = useState('mesas');

  const renderVista = () => {
    switch (vista) {
      case 'comandas': return <Comandas />;
      case 'activas': return <ComandasActivas />;
      case 'ventas': return <Ventas />;
      case 'corte': return <CorteCaja />;
      case 'inventario' : return <Inventario />;
      default: return <Mesas />;
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Restaurante</Navbar.Brand>
          <Nav>
            <Nav.Link onClick={() => setVista('mesas')}>Mesas</Nav.Link>
            <Nav.Link onClick={() => setVista('comandas')}>Nueva Comanda</Nav.Link>
            <Nav.Link onClick={() => setVista('activas')}>Comandas Activas</Nav.Link>
            <Nav.Link onClick={() => setVista('ventas')}>Ventas</Nav.Link>
            <Nav.Link onClick={() => setVista('corte')}>Corte Caja</Nav.Link>
            <Nav.Link onClick={() => setVista('inventario')}>Inventario</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      {renderVista()}
    </>
  );
}

export default App;
