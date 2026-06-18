import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import pizzaApi from '../api/pizzaApi';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [tipoEntrega, setTipoEntrega] = useState('domicilio');
  const [mismaFacturacion, setMismaFacturacion] = useState(true);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [medioPago, setMedioPago] = useState('');

  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreCompleto.trim() || !dni.trim() || !medioPago) {
      toast.error('Por favor, completa los campos obligatorios y selecciona un medio de pago.');
      return;
    }

    if (tipoEntrega === 'domicilio' && !domicilio.trim()) {
      toast.error('Por favor ingresa un domicilio para realizar el envío.');
      return;
    }

    setLoading(true);

    try {
      const items = cart.map(item => ({
        producto: item._id,
        cantidad: item.quantity,
        precioUnitario: item.precio
      }));
      const payload = {
        items,
        total,
        nombreCompleto,
        dni,
        telefono: telefono.trim() || undefined, // Evita mandar strings vacíos
        tipoEntrega,
        direccion: tipoEntrega === 'local' ? 'Retira en local' : domicilio,
        medioPago
      };

      await pizzaApi.post('/orders', payload);
      
      clearCart();
      toast.success('Pedido realizado con éxito');
      navigate('/orders');
    } catch (error) {
      console.error(error);
      toast.error('Error al procesar el pedido: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <p>Tu carrito está vacío. <a href="/" className="text-blue-500 underline">Volver al catálogo</a></p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-black rounded-lg shadow-lg max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumen del Pedido</h2>
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium text-gray-900">{item.nombre}</p>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-950">${(item.precio * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center font-bold text-xl mt-6 pt-4 border-t border-gray-300">
            <span>Total:</span>
            <span className="text-green-600">${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Entrega</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${tipoEntrega === 'local' ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="tipoEntrega"
                    value="local"
                    checked={tipoEntrega === 'local'}
                    onChange={() => setTipoEntrega('local')}
                    className="mr-2 accent-black"
                  />
                  <span>Retirar en local</span>
                </label>
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${tipoEntrega === 'domicilio' ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="tipoEntrega"
                    value="domicilio"
                    checked={tipoEntrega === 'domicilio'}
                    onChange={() => setTipoEntrega('domicilio')}
                    className="mr-2 accent-black"
                  />
                  <span>Envío a domicilio</span>
                </label>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Datos de facturación / envío</h3>
              
              <label className="flex items-center mb-4 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={mismaFacturacion}
                  onChange={(e) => setMismaFacturacion(e.target.checked)}
                  className="mr-2 rounded accent-black"
                />
                <span>Domicilio de facturación idéntico</span>
              </label>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Ej. Florencia Alvarez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">DNI *</label>
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Ej. 11111111"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Teléfono (Opcional)</label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Ej. 3442123456"
                  />
                </div>

                {tipoEntrega === 'domicilio' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Domicilio *</label>
                    <input
                      type="text"
                      value={domicilio}
                      onChange={(e) => setDomicilio(e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="Ej. Calle Falsa 123"
                      required={tipoEntrega === 'domicilio'}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Medio de pago</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${medioPago === 'transferencia' ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="medioPago"
                    value="transferencia"
                    checked={medioPago === 'transferencia'}
                    onChange={() => setMedioPago('transferencia')}
                    className="mr-2 accent-black"
                    required
                  />
                  <span>Transferencia</span>
                  <p className="text-xs text-gray-500 ml-2">Mostrar comprobante al recibir el pedido</p>
                </label>
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${medioPago === 'efectivo' ? 'border-black bg-gray-50 font-semibold' : 'border-gray-200'}`}>
                  <input
                    type="radio"
                    name="medioPago"
                    value="efectivo"
                    checked={medioPago === 'efectivo'}
                    onChange={() => setMedioPago('efectivo')}
                    className="mr-2 accent-black"
                  />
                  <span>Efectivo</span>
                  <p className="text-xs text-gray-500 ml-2">Pagar al recibir el pedido</p>
                </label>
                
                <label className="block text-sm font-bold text-gray-700 mb-3">Datos para transferir</label><br />
                <p className="text-sm text-gray-700"><span className="font-semibold">Banco:</span> Banco de Entre Rios</p><br />
                <p className="text-sm text-gray-700"><span className="font-semibold">CBU:</span> 1234567890123456789012</p><br />
                <p className="text-sm text-gray-700"><span className="font-semibold">Alias:</span> pizza.alias</p>
                
                


              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-slate-900 text-white py-3.5 px-4 rounded-md font-bold hover:bg-slate-800 disabled:opacity-50 tracking-wide transition-colors shadow-sm"
            >
              {loading ? 'Procesando...' : 'Realizar pedido'}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default Checkout;