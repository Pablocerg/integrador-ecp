# Sistema de Gestión de Pizzería

Este proyecto es una API REST desarrollada con Express.js para gestionar una pizzería. 
Permite administrar productos, usuarios y pedidos 
con un backend moderno en Node.js y MongoDB.

## Estructura del Proyecto

- `backend/`
  - `controllers/` - Lógica de productos, usuarios y órdenes
  - `models/` - Esquemas de Mongoose
  - `routes/` - Endpoints de la API
  - `middlewares/` - Autenticación y autorización
  - `server.js` - Punto de entrada del servidor
  - `.env` - Variables de entorno

- `frontend/`
  - `src/` - Código fuente de React
  - `src/components/` - Componentes reutilizables como Navbar, Cart, Specialties
  - `src/pages/` - Vistas principales: Login, Register, Checkout, OrderHistory, AdminPanel
  - `src/contexts/` - Contextos globales como el carrito de compras
  - `src/hooks/` - Hooks personalizados para manejar estado y lógica del carrito
  - `src/api/` - Cliente HTTP para consumir la API del backend
  - `App.jsx` - Enrutamiento y estructura de la aplicación

## Rutas reales del backend

El backend corre en:
- `http://localhost:5000`

Las rutas principales van bajo el prefijo `/api`:

### Productos
- **GET** `/api/products` - Obtener todos los productos
- **GET** `/api/products/:id` - Obtener producto por ID
- **POST** `/api/products` - Crear nuevo producto (admin)
- **PUT** `/api/products/:id` - Actualizar producto (admin)
- **DELETE** `/api/products/:id` - Baja lógica de producto (admin)

### Usuarios
- **POST** `/api/users/register` - Registrar usuario
- **POST** `/api/users/login` - Iniciar sesión
- **GET** `/api/users` - Listar usuarios (admin)
- **GET** `/api/users/:id` - Ver usuario
- **PUT** `/api/users/:id` - Actualizar usuario (admin)
- **DELETE** `/api/users/:id` - Eliminar usuario (admin)

### Órdenes
- **POST** `/api/orders` - Crear nuevo pedido
- **GET** `/api/orders/mis-pedidos` - Obtener historial del usuario autenticado
- **GET** `/api/orders` - Listar todas las órdenes (admin)
- **GET** `/api/orders/:id` - Ver orden por ID
- **PUT** `/api/orders/:id` - Actualizar estado (admin)
- **DELETE** `/api/orders/:id` - Eliminar orden (admin)

## Uso en Postman

### Base URL
- `http://localhost:5000/api`

### Ejemplo: obtener productos
- Método: `GET`
- URL: `http://localhost:5000/api/products`

### Ejemplo: obtener producto por ID
- Método: `GET`
- URL: `http://localhost:5000/api/products/<ID>`

### Ejemplo: crear producto
- Método: `POST`
- URL: `http://localhost:5000/api/products`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <TOKEN>`
- Body (JSON):
```json
{
  "nombre": "Pizza Especial",
  "descripcion": "Salsa de tomate artesana, muzzarella y orégano",
  "precio": 12000,
  "categoria": "Pizzas",
  "stock": 20,
  "imagenUrl": "https://url-de-tu-imagen.com/pizza.jpg"
}
```

### Ejemplo: registrar usuario
- Método: `POST`
- URL: `http://localhost:5000/api/users/register`
- Headers:
  - `Content-Type: application/json`
- Body (JSON):
```json
{
  "nombre": "Juan Cliente",
  "email": "juan@gmail.com",
  "password": "puntero123"
}
```

### Ejemplo: iniciar sesión
- Método: `POST`
- URL: `http://localhost:5000/api/users/login`
- Headers:
  - `Content-Type: application/json`
- Body (JSON):
```json
{
  "email": "admin@pizeriakone.com",
  "password": "admin123"
}
```

### Ejemplo: crear pedido
- Método: `POST`
- URL: `http://localhost:5000/api/orders`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <TOKEN>`
- Body (JSON):
```json
{
  "items": [
    {"producto": "<PRODUCT_ID>", "cantidad": 2, "precio": 9500}
  ],
  "total": 19000
}
```

### Ejemplo: ver historial de pedidos
- Método: `GET`
- URL: `http://localhost:5000/api/orders/mis-pedidos`
- Headers:
  - `Authorization: Bearer <TOKEN>`

## Notas importantes

- El backend actual no usa rutas como `/clientes`, `/productos` o `/pedidos`.
- Las rutas válidas son las que empiezan con `/api`.
- El servidor escuchará en el puerto `5000`.
- Para usar endpoints protegidos necesitas un token JWT en el header `Authorization: Bearer <TOKEN>`.

## Credenciales de ejemplo

- Email: `admin@pizeriakone.com`
- Password: `admin123`

## Instalación y ejecución

```bash
cd backend
npm install
npm run dev
```

Luego abre Postman y usa las rutas bajo `http://localhost:5000/api`.

## Licencia

ISC
