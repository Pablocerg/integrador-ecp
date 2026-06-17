import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import pizzaApi from '../api/pizzaApi';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await pizzaApi.get('/orders/mis-pedidos');
        setOrders(response);
      } catch (error) {
        const msg = 'Error al cargar pedidos: ' + (error.message || 'Error desconocido');
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando pedidos...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-black rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>
      
      {orders.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="border rounded-lg p-4 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pedido #{order._id.slice(-8)}</h2>
                <span className={`px-2 py-1 rounded text-sm ${
                  order.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  order.estado === 'pagado' ? 'bg-blue-100 text-blue-800' :
                  order.estado === 'enviado' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.estado}
                </span>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2">Productos:</h3>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span>{item.producto.nombre} x{item.cantidad}</span>
                    <span>${(item.producto.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center font-bold">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              
              <p className="text-sm text-gray-600 mt-2">
                Fecha: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;