/** URL base de la API. Se sobreescribe con VITE_API_BASE_URL si está definida. */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/** Construye los encabezados HTTP incluyendo el token JWT si existe. */
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

/** Ejecuta una petición fetch genérica con manejo de errores centralizado. */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: getAuthHeaders(),
        ...options
    };

    const response = await fetch(url, config);
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
        throw new Error(error.message || `HTTP ${response.status}`);
    }
    return response.json();
};

const pizzaApi = {
    get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
    post: (endpoint, data) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' })
};

/** Obtiene todos los productos activos. Retorna array vacío en caso de error. */
export const getPizzas = async () => {
    try {
        return await pizzaApi.get('/products');
    } catch (error) {
        console.error("Error en la petición:", error);
        return [];
    }
};

/** Obtiene un producto por su ID. Lanza error si no existe. */
export const getProductoById = async (id) => {
    try {
        return await pizzaApi.get(`/products/${id}`);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        throw error;
    }
};

export default pizzaApi;