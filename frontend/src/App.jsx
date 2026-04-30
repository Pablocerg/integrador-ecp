import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import CartPage from './components/CartPage';
import Register from './components/Register'; 
import Contact from './components/Contact'; 
import Footer from './components/Footer';
import DetalleProducto from './components/DetalleProducto';   
import './App.css';

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <div className="bg-dark text-light min-vh-100 d-flex flex-column">
        <Navbar cartCount={cart.length} />
        
        <main className="container py-5 flex-grow-1">
          <Routes>
          
            <Route path="/" element={<ProductList cart={cart} setCart={setCart} />} />
            <Route path="/productos" element={<ProductList cart={cart} setCart={setCart} />} />
            <Route path="/producto/:id" element={<DetalleProducto cart={cart} setCart={setCart} />} />
            <Route path="/carrito" element={<CartPage cart={cart} setCart={setCart} />} />
            <Route path="/registro" element={<Register />} /> 
            <Route path="/contacto" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;