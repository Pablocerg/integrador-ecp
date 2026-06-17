import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import pizzaApi from '../api/pizzaApi';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tabLoading, setTabLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showInactiveProducts, setShowInactiveProducts] = useState(false);
  const [showInactiveUsers, setShowInactiveUsers] = useState(false);
  const [productForm, setProductForm] = useState({
    nombre: '', descripcion: '', precio: '', categoria: '', stock: '', imagenUrl: ''
  });
  const [userForm, setUserForm] = useState({
    nombre: '', email: '', password: '', rol: ''
  });

  useEffect(() => {
    setErrorMessage('');
    setTabLoading(true);
    if (activeTab === 'products') {
      fetchProducts().finally(() => setTabLoading(false));
    } else if (activeTab === 'orders') {
      fetchOrders().finally(() => setTabLoading(false));
    } else if (activeTab === 'users') {
      fetchUsers().finally(() => setTabLoading(false));
    }
  }, [activeTab, showInactiveProducts, showInactiveUsers]);

  const fetchProducts = async () => {
    try {
      setErrorMessage('');
      const endpoint = showInactiveProducts ? '/products?activo=false' : '/products';
      const response = await pizzaApi.get(endpoint);
      setProducts(response);
    } catch (error) {
      const msg = error.message || 'Error al cargar productos';
      setErrorMessage(msg);
      console.error('Error al cargar productos:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setErrorMessage('');
      const response = await pizzaApi.get('/orders');
      setOrders(response);
    } catch (error) {
      const msg = error.message || 'Error al cargar órdenes';
      setErrorMessage(msg);
      console.error('Error al cargar órdenes:', error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      if (editingProduct) {
        await pizzaApi.put(`/products/${editingProduct._id}`, productForm);
        toast.success('Producto actualizado');
      } else {
        await pizzaApi.post('/products', productForm);
        toast.success('Producto creado');
      }
      setProductForm({ nombre: '', descripcion: '', precio: '', categoria: '', stock: '', imagenUrl: '' });
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      const msg = error.message || 'Error: Error al guardar producto';
      setErrorMessage(msg);
      toast.error(msg);
      console.error('Error en handleProductSubmit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria,
      stock: product.stock,
      imagenUrl: product.imagenUrl || ''
    });
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('¿Eliminar producto?')) {
      try {
        setErrorMessage('');
        await pizzaApi.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        const msg = error.message || 'Error al eliminar';
        setErrorMessage(msg);
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const fetchUsers = async () => {
    try {
      setErrorMessage('');
      const endpoint = showInactiveUsers ? '/users?activo=false' : '/users';
      const response = await pizzaApi.get(endpoint);
      setUsers(response);
    } catch (error) {
      const msg = error.message || 'Error al cargar usuarios';
      setErrorMessage(msg);
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      if (editingUser) {
        await pizzaApi.put(`/users/${editingUser._id}`, userForm);
        toast.success('Usuario actualizado');
      } else {
        await pizzaApi.post('/users/register', userForm);
        toast.success('Usuario creado');
      }
      setUserForm({ nombre: '', email: '', password: '', rol: '' });
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      const msg = error.message || 'Error: Error al guardar usuario';
      setErrorMessage(msg);
      toast.error(msg);
      console.error('Error en handleUserSubmit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      nombre: user.nombre,
      email: user.email,
      password: '', // No mostrar password existente
      rol: user.rol
    });
  };

  const handleDeleteUser = async (id) => {
    if (confirm('¿Eliminar usuario?')) {
      try {
        setErrorMessage('');
        await pizzaApi.delete(`/users/${id}`);
        fetchUsers();
      } catch (error) {
        const msg = error.message || 'Error al eliminar';
        setErrorMessage(msg);
        console.error('Error al eliminar usuario:', error);
      }
    }
  };

  const handleRestoreProduct = async (id) => {
    try {
      setErrorMessage('');
      await pizzaApi.put(`/products/${id}/restore`, {});
      fetchProducts();
      toast.success('Producto reactivado correctamente');
    } catch (error) {
      const msg = error.message || 'Error al restaurar producto';
      setErrorMessage(msg);
      console.error('Error al restaurar producto:', error);
    }
  };

  const handleRestoreUser = async (id) => {
    try {
      setErrorMessage('');
      await pizzaApi.put(`/users/${id}/restore`, {});
      fetchUsers();
      toast.success('Usuario reactivado correctamente');
    } catch (error) {
      const msg = error.message || 'Error al restaurar usuario';
      setErrorMessage(msg);
      console.error('Error al restaurar usuario:', error);
    }
  };

  const handleMakeAdmin = async (id, currentRol) => {
    const newRol = currentRol === 'admin' ? 'usuario' : 'admin';
    if (confirm(`¿Cambiar rol a ${newRol}?`)) {
      try {
        setErrorMessage('');
        await pizzaApi.put(`/users/${id}/role`, { rol: newRol });
        toast.success(`Rol actualizado a ${newRol}`);
        fetchUsers();
      } catch (error) {
        const msg = error.message || 'Error al cambiar rol';
        setErrorMessage(msg);
        toast.error(msg);
        console.error('Error al cambiar rol:', error);
      }
    }
  };

  const handleBecomeAdmin = async (e) => {
    e.preventDefault();
    const email = prompt('Ingresa tu email:');
    const password = prompt('Ingresa tu contraseña:');
    
    if (!email || !password) {
      toast.error('Email y contraseña son requeridos');
      return;
    }

    try {
      setErrorMessage('');
      const response = await pizzaApi.post('/users/self-admin', { email, password });
      toast.success('¡Te has convertido en admin! Por favor, recarga la página.');
      window.location.reload();
    } catch (error) {
      const msg = error.message || 'Error al convertirse en admin';
      setErrorMessage(msg);
      console.error('Error al convertirse en admin:', error);
    }
  };

  const handleUpdateOrderStatus = async (id, estado) => {
    try {
      setErrorMessage('');
      await pizzaApi.put(`/orders/${id}`, { estado });
      fetchOrders();
      const statusMsgs = {
        pendiente: 'Pedido marcado como pendiente',
        pagado: 'Pedido marcado como pagado',
        enviado: '✅ Pedido marcado como enviado — se notificó al cliente por email',
        entregado: 'Pedido marcado como entregado'
      };
      toast.success(statusMsgs[estado] || 'Estado actualizado');
    } catch (error) {
      const msg = error.message || 'Error al actualizar estado';
      setErrorMessage(msg);
      toast.error(msg);
      console.error('Error al actualizar estado:', error);
    }
  };

  return (
    
    <div className="container mx-auto px-4 py-8 bg-white text-black rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>
      
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p><strong>Error:</strong> {errorMessage}</p>
          <p className="text-sm mt-2">Asegúrate de: 1) Estar logeado como admin, 2) El servidor esté corriendo en http://localhost:5000</p>
          {errorMessage.includes('administrador') && (
            <button 
              onClick={handleBecomeAdmin}
              className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Convertirme en Admin
            </button>
          )}
        </div>
      )}
      
      <div className="mb-4">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 mr-2 ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
           Gestion Productos
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 mr-2 ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Gestion Órdenes
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Gestion Usuarios
        </button>
      </div>

      {activeTab === 'products' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-semibold">Productos</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowInactiveProducts(false)}
                className={`px-4 py-2 rounded ${showInactiveProducts ? 'bg-gray-300 text-black' : 'bg-[#6A8E23] text-white'}`}
              >
                Activos
              </button>
              <button
                type="button"
                onClick={() => setShowInactiveProducts(true)}
                className={`px-4 py-2 rounded ${showInactiveProducts ? 'bg-[#6A8E23] text-white' : 'bg-gray-300 text-black'}`}
              >
                Inactivos
              </button>
            </div>
          </div>

          {showInactiveProducts ? (
            <div className="mb-6 p-4 rounded border border-yellow-500/30 bg-yellow-50 text-sm text-yellow-900">
              Estás viendo productos inactivos. Usa el botón Restaurar para volver a activar un producto.
            </div>
          ) : (
            <form onSubmit={handleProductSubmit} className="mb-8 p-4 border rounded">
              <h3 className="text-lg font-medium mb-4">{editingProduct ? 'Editar Producto' : 'Crear Producto'}</h3>
              <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Nombre" value={productForm.nombre} onChange={(e) => setProductForm({...productForm, nombre: e.target.value})} required className="p-2 border rounded" />
              <input type="text" placeholder="Categoría" value={productForm.categoria} onChange={(e) => setProductForm({...productForm, categoria: e.target.value})} required className="p-2 border rounded" />
              <input type="number" placeholder="Precio" value={productForm.precio} onChange={(e) => setProductForm({...productForm, precio: e.target.value})} required className="p-2 border rounded" />
              <input type="number" placeholder="Stock" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} required className="p-2 border rounded" />
              <input type="url" placeholder="Imagen URL" value={productForm.imagenUrl} onChange={(e) => setProductForm({...productForm, imagenUrl: e.target.value})} className="p-2 border rounded" />
              <textarea placeholder="Descripción" value={productForm.descripcion} onChange={(e) => setProductForm({...productForm, descripcion: e.target.value})} required className="p-2 border rounded" />
            </div>
            <button type="submit" disabled={loading} className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
              {loading ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear'}
            </button>
            {editingProduct && <button type="button" onClick={() => {setEditingProduct(null); setProductForm({ nombre: '', descripcion: '', precio: '', categoria: '', stock: '', imagenUrl: '' });}} className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>}
          </form>
          )}

          {tabLoading && <p className="text-gray-500">Cargando productos...</p>}
          {!tabLoading && products.length === 0 && (
            <p className="text-gray-500 bg-yellow-50 p-4 rounded">No hay productos en la base de datos</p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div key={product._id} className="border rounded p-4">
                <h3 className="font-semibold">{product.nombre}</h3>
                <p className="text-sm text-gray-600">{product.descripcion}</p>
                <p>Precio: ${product.precio}</p>
                <p>Stock: {product.stock}</p>
                <div className="mt-2">
                  {showInactiveProducts ? (
                    <button onClick={() => handleRestoreProduct(product._id)} className="bg-green-500 text-white px-2 py-1 rounded">Restaurar</button>
                  ) : (
                    <>
                      <button onClick={() => handleEditProduct(product)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Editar</button>
                      <button onClick={() => handleDeleteProduct(product._id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Órdenes</h2>
          {tabLoading && <p className="text-gray-500">Cargando órdenes...</p>}
          {!tabLoading && orders.length === 0 && (
            <p className="text-gray-500 bg-yellow-50 p-4 rounded">No hay órdenes en la base de datos</p>
          )}
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="border rounded p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Pedido #{order._id.slice(-8)}</h3>
                  <select
                    value={order.estado || 'pendiente'}
                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="enviado">Enviado</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>
                <p>Usuario: {order.usuario?.nombre || 'Desconocido'} ({order.usuario?.email || 'N/A'})</p>
                <p>Total: ${order.total}</p>
                <div>
                  <h4 className="font-medium">Productos:</h4>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <p key={index} className="text-sm">{item.producto?.nombre || 'Producto desconocido'} x{item.cantidad}</p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Sin productos</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-semibold">Usuarios</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowInactiveUsers(false)}
                className={`px-4 py-2 rounded ${showInactiveUsers ? 'bg-gray-300 text-black' : 'bg-[#6A8E23] text-white'}`}
              >
                Activos
              </button>
              <button
                type="button"
                onClick={() => setShowInactiveUsers(true)}
                className={`px-4 py-2 rounded ${showInactiveUsers ? 'bg-[#6A8E23] text-white' : 'bg-gray-300 text-black'}`}
              >
                Inactivos
              </button>
            </div>
          </div>

          {showInactiveUsers ? (
            <div className="mb-6 p-4 rounded border border-yellow-500/30 bg-yellow-50 text-sm text-yellow-900">
              Estás viendo usuarios inactivos. Usa el botón Restaurar para volver a activar un usuario.
            </div>
          ) : (
            <form onSubmit={handleUserSubmit} className="mb-8 p-4 border rounded">
              <h3 className="text-lg font-medium mb-4">{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</h3>
              <div className="grid md:grid-cols-4 gap-4">
              <input type="text" placeholder="Nombre" value={userForm.nombre} onChange={(e) => setUserForm({...userForm, nombre: e.target.value})} required className="p-2 border rounded" />
              <input type="email" placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({...userForm, email: e.target.value})} required className="p-2 border rounded" />
              <input type="password" placeholder="Contraseña" value={userForm.password} onChange={(e) => setUserForm({...userForm, password: e.target.value})} required={!editingUser} className="p-2 border rounded" />
              <select value={userForm.rol} onChange={(e) => setUserForm({...userForm, rol: e.target.value})} required className="p-2 border rounded">
                <option value="">Seleccionar Rol</option>
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
              {loading ? 'Guardando...' : editingUser ? 'Actualizar' : 'Crear'}
            </button>
            {editingUser && <button type="button" onClick={() => {setEditingUser(null); setUserForm({ nombre: '', email: '', password: '', rol: '' });}} className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>}
          </form>
          )}

          {tabLoading && <p className="text-gray-500">Cargando usuarios...</p>}
          {!tabLoading && users.length === 0 && (
            <p className="text-gray-500 bg-yellow-50 p-4 rounded">No hay usuarios en la base de datos</p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => (
              <div key={user._id} className="border rounded p-4">
                <h3 className="font-semibold">{user.nombre}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p>Rol: <span className={`font-bold ${user.rol === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>{user.rol}</span></p>
                <div className="mt-2">
                  {showInactiveUsers ? (
                  <button onClick={() => handleRestoreUser(user._id)} className="bg-green-500 text-white px-2 py-1 rounded">Restaurar</button>
                ) : (
                  <>
                    <button onClick={() => handleMakeAdmin(user._id, user.rol)} className={`px-2 py-1 rounded mr-2 text-white ${user.rol === 'admin' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                      {user.rol === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                    </button>
                    <button onClick={() => handleEditUser(user)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Editar</button>
                    <button onClick={() => handleDeleteUser(user._id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                  </>
                )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

};

export default AdminPanel;