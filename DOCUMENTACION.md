# Pizzería KONE — Documentación del Trabajo Práctico Integrador

---

**Materia:** Programación IV  
**Carrera:** Tecnicatura Universitaria en Programación (TUP)  
**Institución:** UTN Facultad Regional Concepción del Uruguay (FRCU)  
**Año:** 2026  
**Profesora:** Ing. Florencia Alvarez Vuille

**Repositorio:** [https://github.com/.../PizeriaKONE](https://github.com/.../PizeriaKONE)

---

---

## 1. Requerimientos funcionales implementados

### 1.1 Autenticación y autorización
- Registro de usuarios con validaciones (nombre, email, contraseña)
- Inicio de sesión con generación de JWT (expira en 1 día)
- Encriptación de contraseñas con bcryptjs (salt rounds 10)
- Middleware de autenticación (`isAuth`) que verifica JWT en header `Authorization: Bearer <token>`
- Middleware de autorización por roles (`isAdmin`)
- Recuperación de contraseña mediante correo electrónico con token criptográfico (SHA-256, 20 min de expiración, un solo uso)
- Roles: `user` (cliente) y `admin` (administrador)

### 1.2 Gestión de productos
- CRUD completo de productos (crear, leer, actualizar, baja lógica)
- Restauración de productos dados de baja
- Control de stock con validación antes de cada operación
- Búsqueda por ID
- Filtro por estado activo/inactivo mediante query parameter `?activo=false`
- Operaciones de escritura protegidas para administradores

### 1.3 Gestión de usuarios
- Perfil propio: consulta y edición de datos personales (nombre, email, contraseña)
- Administración de usuarios: listar, editar, cambiar rol, baja lógica y restauración
- Endpoint de autopromoción a administrador (`self-admin`)
- Filtro por estado activo/inactivo

### 1.4 Gestión de carrito (persistente en backend)
- Modelo `Cart` en MongoDB (un carrito por usuario)
- Agregar productos con validación de stock
- Modificar cantidades
- Eliminar productos del carrito
- Vaciar carrito
- Sincronización automática entre frontend (localStorage) y backend (MongoDB)
- Migración del carrito local al backend al iniciar sesión

### 1.5 Órdenes de compra
- Creación de pedidos autenticados
- Items con producto, cantidad y precio unitario
- Cálculo del total de la compra
- Datos de facturación: nombre completo, DNI, teléfono
- Tipo de entrega: retiro en local o envío a domicilio
- Medio de pago: transferencia bancaria o efectivo
- Descuento automático de stock al confirmar la orden
- Historial de pedidos del usuario autenticado
- Detalle de cada orden: productos, cantidades, precios, total, fecha, estado
- Administración de órdenes: listar todas, cambiar estado (pendiente → pagado → enviado → entregado)

### 1.6 Catálogo de productos (frontend)
- Visualización de productos en grilla con infinite scroll (carga de 6 en 6)
- Datos visibles: nombre, precio, categoría, descripción, stock (con códigos de color)
- Página de detalle individual por producto
- Selector de cantidad y cálculo de precio total en tiempo real

### 1.7 Panel de administración
- Gestión de productos: formulario de creación/edición, baja lógica, restauración
- Gestión de usuarios: edición, cambio de rol, baja lógica, restauración
- Gestión de órdenes: visualización y cambio de estado
- Toggle entre vista de activos e inactivos

### 1.8 Estado global
- Carrito de compras manejado con React Context API
- Persistencia en localStorage para usuarios no autenticados
- Sincronización con servidor MongoDB para usuarios autenticados

### 1.9 Consumo de API REST
- Cliente HTTP centralizado con fetch API
- Headers de autenticación automáticos
- Manejo de errores con respuestas JSON consistentes

### 1.10 Organización del código
- Backend con arquitectura MVC: modelos, controladores, rutas, middlewares
- Frontend con separación en páginas, componentes, contextos, hooks, API y utilidades

### 1.11 Control de concurrencia en stock
- Descuento de stock mediante operación atómica `findOneAndUpdate` con condición `stock: { $gte: cantidad }`
- Rollback automático si falla algún producto o la creación de la orden
- Previene que dos usuarios compren la última unidad disponible simultáneamente (race condition)

### 1.12 Buenas prácticas REST
- Rutas con sustantivos (`/products`, `/users`, `/orders`, `/cart`) siguiendo convención REST
- Códigos HTTP correctos según la operación: 201 (creación), 400 (validación), 401/403 (autenticación/autorización), 404 (no encontrado), 500 (error interno)
- Respuestas sin datos sensibles (contraseñas excluidas en endpoints públicos)
- Formato JSON consistente en todas las respuestas de la API

---

---

## 2. Documentación de endpoints de la API

**Base URL:** `http://localhost:5000/api`  
**Autenticación:** JWT vía header `Authorization: Bearer <token>`  
**Formato de request/response:** JSON (`Content-Type: application/json`)

---

### 2.1 Usuarios

---

### `POST /api/users/register`

Registrar un nuevo usuario.

**Autenticación:** No requiere

**Body (JSON):**
```json
{
    "nombre": "Juan Pérez",
    "email": "juan@gmail.com",
    "password": "miPassword123"
}
```

**Response — 201 Created:**
```json
{
    "message": "Usuario creado con éxito",
    "user": {
        "nombre": "Juan Pérez",
        "email": "juan@gmail.com",
        "rol": "user"
    }
}
```

**Response — 400 Bad Request:**
```json
{
    "message": "El correo ya está registrado"
}
```

---

### `POST /api/users/login`

Iniciar sesión. Devuelve un token JWT.

**Autenticación:** No requiere

**Body (JSON):**
```json
{
    "email": "admin@pizeriakone.com",
    "password": "admin123"
}
```

**Response — 200 OK:**
```json
{
    "message": "Login exitoso",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "nombre": "Admin KONE",
        "rol": "admin"
    }
}
```

**Response — 401 Unauthorized:**
```json
{
    "message": "Contraseña incorrecta"
}
```

---

### `POST /api/users/self-admin`

Autopromocionar el rol del usuario a administrador (para setup inicial).

**Autenticación:** No requiere

**Body (JSON):**
```json
{
    "email": "miemail@correo.com",
    "password": "miPassword"
}
```

**Response — 200 OK:**
```json
{
    "message": "Rol actualizado a admin correctamente",
    "user": {
        "nombre": "Mi Nombre",
        "email": "miemail@correo.com",
        "rol": "admin"
    }
}
```

---

### `GET /api/users/me`

Obtener perfil del usuario autenticado.

**Autenticación:** Requiere JWT

**Headers:**
```
Authorization: Bearer <token>
```

**Response — 200 OK:**
```json
{
    "_id": "665abc123...",
    "nombre": "Juan Pérez",
    "email": "juan@gmail.com",
    "rol": "user",
    "activo": true
}
```

---

### `PUT /api/users/me`

Actualizar perfil del usuario autenticado (nombre, email, contraseña).

**Autenticación:** Requiere JWT

**Headers:**
```
Authorization: Bearer <token>
```

**Body (JSON) — solo nombre y email:**
```json
{
    "nombre": "Juan Actualizado",
    "email": "nuevoemail@correo.com"
}
```

**Body (JSON) — con cambio de contraseña:**
```json
{
    "nombre": "Juan Pérez",
    "email": "juan@gmail.com",
    "currentPassword": "miPasswordActual",
    "newPassword": "miNuevaPassword",
    "confirmPassword": "miNuevaPassword"
}
```

**Response — 200 OK:**
```json
{
    "message": "Perfil actualizado correctamente",
    "user": {
        "nombre": "Juan Actualizado",
        "email": "nuevoemail@correo.com",
        "rol": "user"
    }
}
```

---

### `GET /api/users`

Listar todos los usuarios (solo admin). Por defecto devuelve activos.

**Autenticación:** Requiere JWT + rol admin

**Query parameters:** `?activo=false` para ver usuarios inactivos (dados de baja)

**Response — 200 OK:**
```json
[
    {
        "_id": "665abc123...",
        "nombre": "Admin KONE",
        "email": "admin@pizeriakone.com",
        "rol": "admin",
        "activo": true
    },
    {
        "_id": "665def456...",
        "nombre": "Juan Pérez",
        "email": "juan@gmail.com",
        "rol": "user",
        "activo": true
    }
]
```

---

### `GET /api/users/:id`

Obtener un usuario por su ID.

**Autenticación:** Requiere JWT

**Response — 200 OK:**
```json
{
    "_id": "665abc123...",
    "nombre": "Juan Pérez",
    "email": "juan@gmail.com",
    "rol": "user",
    "activo": true
}
```

---

### `PUT /api/users/:id`

Actualizar datos de un usuario (solo admin).

**Autenticación:** Requiere JWT + rol admin

**Body (JSON):**
```json
{
    "nombre": "Nuevo Nombre",
    "email": "nuevo@email.com",
    "password": "nuevaPassword",
    "rol": "user"
}
```

**Response — 200 OK:**
```json
{
    "_id": "665abc123...",
    "nombre": "Nuevo Nombre",
    "email": "nuevo@email.com",
    "rol": "user",
    "activo": true
}
```

---

### `DELETE /api/users/:id`

Baja lógica de un usuario (solo admin). Establece `activo: false`.

**Autenticación:** Requiere JWT + rol admin

**Response — 200 OK:**
```json
{
    "message": "Usuario desactivado correctamente",
    "user": {
        "_id": "665abc123...",
        "nombre": "Juan Pérez",
        "activo": false
    }
}
```

---

### `PUT /api/users/:id/restore`

Restaurar un usuario dado de baja (solo admin). Establece `activo: true`.

**Autenticación:** Requiere JWT + rol admin

**Response — 200 OK:**
```json
{
    "message": "Usuario reactivado correctamente",
    "user": {
        "_id": "665abc123...",
        "nombre": "Juan Pérez",
        "activo": true
    }
}
```

---

### `PUT /api/users/:id/role`

Cambiar el rol de un usuario (solo admin).

**Autenticación:** Requiere JWT + rol admin

**Body (JSON):**
```json
{
    "rol": "admin"
}
```

**Response — 200 OK:**
```json
{
    "message": "Rol actualizado correctamente",
    "user": {
        "_id": "665abc123...",
        "nombre": "Juan Pérez",
        "rol": "admin"
    }
}
```

---

### `POST /api/users/forgot-password`

Solicitar enlace de recuperación de contraseña. Envía un email con un token temporal.

**Autenticación:** No requiere

**Body (JSON):**
```json
{
    "email": "juan@gmail.com"
}
```

**Response — 200 OK:**
```json
{
    "message": "Si el correo está registrado, se enviará un enlace de recuperación."
}
```

> **Nota:** Por seguridad, la respuesta es idéntica exista o no el email, para no revelar qué correos están registrados.

---

### `POST /api/users/reset-password/:token`

Restablecer la contraseña usando el token recibido por email.

**Autenticación:** No requiere

**Parámetros de ruta:** `token` — token hexadecimal de 64 caracteres recibido por email

**Body (JSON):**
```json
{
    "password": "nuevaContraseña123"
}
```

**Response — 200 OK:**
```json
{
    "message": "Tu contraseña ha sido actualizada con éxito. Ya puedes iniciar sesión."
}
```

**Response — 400 Bad Request:**
```json
{
    "message": "El enlace de recuperación es inválido o ha expirado."
}
```

---

### `POST /api/users/contact`

Enviar un mensaje desde el formulario de contacto. El mensaje se envía por email al administrador.

**Autenticación:** No requiere

**Body (JSON):**
```json
{
    "nombre": "Carlos García",
    "email": "carlos@gmail.com",
    "mensaje": "Hola, quería consultar por los horarios de atención."
}
```

**Response — 200 OK:**
```json
{
    "message": "¡Tu mensaje fue enviado con éxito!"
}
```

---

### 2.2 Productos

---

### `GET /api/products`

Obtener listado de productos. Por defecto devuelve solo productos activos.

**Autenticación:** No requiere

**Query parameters:** `?activo=false` para ver productos inactivos (dados de baja)

**Response — 200 OK:**
```json
[
    {
        "_id": "664abc123...",
        "nombre": "Pizza Muzzarella",
        "descripcion": "Salsa de tomate artesana, muzzarella y orégano",
        "precio": 9500,
        "categoria": "Pizzas",
        "stock": 20,
        "imagenUrl": "/images/pizza-muzzarella.jpeg",
        "activo": true
    },
    {
        "_id": "664def456...",
        "nombre": "Pizza Napolitana",
        "descripcion": "Salsa de tomate, muzzarella, rodajas de tomate y orégano",
        "precio": 10500,
        "categoria": "Pizzas",
        "stock": 15,
        "imagenUrl": "/images/pizza-napolitana.jpeg",
        "activo": true
    }
]
```

---

### `GET /api/products/:id`

Obtener un producto por su ID.

**Autenticación:** No requiere

**Response — 200 OK:**
```json
{
    "_id": "664abc123...",
    "nombre": "Pizza Muzzarella",
    "descripcion": "Salsa de tomate artesana, muzzarella y orégano",
    "precio": 9500,
    "categoria": "Pizzas",
    "stock": 20,
    "imagenUrl": "/images/pizza-muzzarella.jpeg",
    "activo": true
}
```

---

### `POST /api/products`

Crear un nuevo producto (solo admin).

**Autenticación:** Requiere JWT + rol admin

**Body (JSON):**
```json
{
    "nombre": "Pizza Especial",
    "descripcion": "Salsa de tomate artesana, muzzarella, jamón y morrones",
    "precio": 12000,
    "categoria": "Pizzas",
    "stock": 25,
    "imagenUrl": "/images/pizza-especial.jpeg"
}
```

**Response — 201 Created:**
```json
{
    "_id": "664ghi789...",
    "nombre": "Pizza Especial",
    "descripcion": "Salsa de tomate artesana, muzzarella, jamón y morrones",
    "precio": 12000,
    "categoria": "Pizzas",
    "stock": 25,
    "imagenUrl": "/images/pizza-especial.jpeg",
    "activo": true
}
```

---

### `PUT /api/products/:id`

Actualizar un producto existente (solo admin).

**Autenticación:** Requiere JWT + rol admin

**Body (JSON) — campos a modificar:**
```json
{
    "precio": 13000,
    "stock": 30
}
```

**Response — 200 OK:**
```json
{
    "_id": "664ghi789...",
    "nombre": "Pizza Especial",
    "descripcion": "Salsa de tomate artesana, muzzarella, jamón y morrones",
    "precio": 13000,
    "categoria": "Pizzas",
    "stock": 30,
    "imagenUrl": "/images/pizza-especial.jpeg",
    "activo": true
}
```

---

### `DELETE /api/products/:id`

Baja lógica de un producto (solo admin). Establece `activo: false`.

**Autenticación:** Requiere JWT + rol admin

**Response — 200 OK:**
```json
{
    "message": "Producto desactivado correctamente (Baja Lógica)",
    "productDeleted": {
        "_id": "664ghi789...",
        "nombre": "Pizza Especial",
        "activo": false
    }
}
```

---

### `PUT /api/products/:id/restore`

Restaurar un producto dado de baja (solo admin). Establece `activo: true`.

**Autenticación:** Requiere JWT + rol admin

**Response — 200 OK:**
```json
{
    "message": "Producto reactivado correctamente",
    "product": {
        "_id": "664ghi789...",
        "nombre": "Pizza Especial",
        "activo": true
    }
}
```

---

### 2.3 Órdenes

---

### `POST /api/orders`

Crear un nuevo pedido. Reduce el stock de los productos automáticamente mediante operación atómica con rollback en caso de falla (control de concurrencia).

**Autenticación:** Requiere JWT

**Body (JSON):**
```json
{
    "items": [
        {
            "producto": "664abc123...",
            "cantidad": 2,
            "precioUnitario": 9500
        },
        {
            "producto": "664def456...",
            "cantidad": 1,
            "precioUnitario": 10500
        }
    ],
    "total": 29500,
    "nombreCompleto": "Juan Pérez",
    "dni": "11222333",
    "telefono": "3442123456",
    "tipoEntrega": "domicilio",
    "direccion": "Calle Falsa 123",
    "medioPago": "transferencia"
}
```

**Response — 201 Created:**
```json
{
    "message": "Pedido realizado con éxito",
    "newOrder": {
        "usuario": "665abc123...",
        "items": [
            {
                "producto": "664abc123...",
                "cantidad": 2,
                "precioUnitario": 9500
            },
            {
                "producto": "664def456...",
                "cantidad": 1,
                "precioUnitario": 10500
            }
        ],
        "total": 29500,
        "nombreCompleto": "Juan Pérez",
        "dni": "11222333",
        "telefono": "3442123456",
        "tipoEntrega": "domicilio",
        "direccion": "Calle Falsa 123",
        "medioPago": "transferencia",
        "estado": "pendiente",
        "_id": "666jkl012..."
    }
}
```

---

### `GET /api/orders/mis-pedidos`

Obtener el historial de pedidos del usuario autenticado.

**Autenticación:** Requiere JWT

**Response — 200 OK:**
```json
[
    {
        "_id": "666jkl012...",
        "usuario": "665abc123...",
        "items": [
            {
                "producto": {
                    "_id": "664abc123...",
                    "nombre": "Pizza Muzzarella",
                    "precio": 9500,
                    "imagenUrl": "/images/pizza-muzzarella.jpeg"
                },
                "cantidad": 2,
                "precioUnitario": 9500
            }
        ],
        "total": 19000,
        "estado": "entregado",
        "tipoEntrega": "domicilio",
        "medioPago": "efectivo",
        "createdAt": "2026-05-15T20:30:00.000Z"
    }
]
```

---

### `GET /api/orders`

Listar todas las órdenes registradas (solo admin).

**Autenticación:** Requiere JWT + rol admin

**Response — 200 OK:**
```json
[
    {
        "_id": "666jkl012...",
        "usuario": {
            "_id": "665abc123...",
            "nombre": "Juan Pérez",
            "email": "juan@gmail.com"
        },
        "items": [
            {
                "producto": {
                    "_id": "664abc123...",
                    "nombre": "Pizza Muzzarella",
                    "precio": 9500
                },
                "cantidad": 2,
                "precioUnitario": 9500
            }
        ],
        "total": 29500,
        "estado": "pendiente",
        "tipoEntrega": "domicilio",
        "medioPago": "transferencia",
        "createdAt": "2026-06-01T15:00:00.000Z"
    }
]
```

---

### `GET /api/orders/:id`

Obtener una orden por su ID.

**Autenticación:** Requiere JWT

**Response — 200 OK:**
```json
{
    "_id": "666jkl012...",
    "usuario": {
        "_id": "665abc123...",
        "nombre": "Juan Pérez",
        "email": "juan@gmail.com"
    },
    "items": [
        {
            "producto": {
                "_id": "664abc123...",
                "nombre": "Pizza Muzzarella",
                "precio": 9500,
                "imagenUrl": "/images/pizza-muzzarella.jpeg"
            },
            "cantidad": 2,
            "precioUnitario": 9500
        }
    ],
    "total": 19000,
    "nombreCompleto": "Juan Pérez",
    "dni": "11222333",
    "tipoEntrega": "domicilio",
    "medioPago": "efectivo",
    "estado": "pendiente",
    "createdAt": "2026-06-01T15:00:00.000Z"
}
```

---

### `PUT /api/orders/:id`

Actualizar el estado de una orden (solo admin).

**Autenticación:** Requiere JWT + rol admin

**Body (JSON):**
```json
{
    "estado": "pagado"
}
```

**Valores válidos para `estado`:** `pendiente`, `pagado`, `enviado`, `entregado`

**Response — 200 OK:**
```json
{
    "_id": "666jkl012...",
    "usuario": {
        "_id": "665abc123...",
        "nombre": "Juan Pérez",
        "email": "juan@gmail.com"
    },
    "items": [...],
    "total": 19000,
    "estado": "pagado"
}
```

---

### `DELETE /api/orders/:id`

Eliminar una orden del sistema (solo admin).

**Autenticación:** Requiere JWT + rol admin

**Response — 200 OK:**
```json
{
    "message": "Orden eliminada correctamente"
}
```

---

### 2.4 Carrito

---

### `GET /api/cart`

Obtener el carrito del usuario autenticado. Si no existe, devuelve un carrito vacío.

**Autenticación:** Requiere JWT

**Response — 200 OK:**
```json
{
    "_id": "667mno345...",
    "usuario": "665abc123...",
    "items": [
        {
            "_id": "668pqr678...",
            "producto": {
                "_id": "664abc123...",
                "nombre": "Pizza Muzzarella",
                "precio": 9500,
                "descripcion": "Salsa de tomate artesana, muzzarella y orégano",
                "imagenUrl": "/images/pizza-muzzarella.jpeg",
                "stock": 18
            },
            "cantidad": 2
        }
    ]
}
```

**Response — carrito vacío:**
```json
{
    "items": []
}
```

---

### `POST /api/cart/add`

Agregar un producto al carrito. Si ya existe, incrementa la cantidad.

**Autenticación:** Requiere JWT

**Body (JSON):**
```json
{
    "producto": "664abc123...",
    "cantidad": 1
}
```

**Response — 200 OK:**
```json
{
    "_id": "667mno345...",
    "usuario": "665abc123...",
    "items": [
        {
            "_id": "668pqr678...",
            "producto": {
                "_id": "664abc123...",
                "nombre": "Pizza Muzzarella",
                "precio": 9500,
                "stock": 18
            },
            "cantidad": 1
        }
    ]
}
```

**Response — 400 Bad Request (stock insuficiente):**
```json
{
    "message": "Stock insuficiente. Stock disponible: 5"
}
```

---

### `PUT /api/cart/update/:productId`

Modificar la cantidad de un producto en el carrito. Si `cantidad` es 0, elimina el producto.

**Autenticación:** Requiere JWT

**Parámetros de ruta:** `productId` — ID del producto

**Body (JSON):**
```json
{
    "cantidad": 3
}
```

**Response — 200 OK:**
```json
{
    "_id": "667mno345...",
    "usuario": "665abc123...",
    "items": [
        {
            "_id": "668pqr678...",
            "producto": {
                "_id": "664abc123...",
                "nombre": "Pizza Muzzarella",
                "precio": 9500,
                "stock": 18
            },
            "cantidad": 3
        }
    ]
}
```

---

### `DELETE /api/cart/remove/:productId`

Eliminar un producto del carrito.

**Autenticación:** Requiere JWT

**Parámetros de ruta:** `productId` — ID del producto

**Response — 200 OK:**
```json
{
    "message": "Producto eliminado del carrito"
}
```

---

### `DELETE /api/cart/clear`

Vaciar el carrito por completo.

**Autenticación:** Requiere JWT

**Response — 200 OK:**
```json
{
    "message": "Carrito vaciado",
    "items": []
}
```

---

### 2.5 Imágenes

---

### `GET /images/:filename`

Servir imágenes estáticas almacenadas en el backend.

**Autenticación:** No requiere

**Ejemplo:** `GET http://localhost:5000/images/pizza-muzzarella.jpeg`

**Response:** Archivo de imagen (JPEG, PNG, etc.)

---

---

## 3. Instalación y ejecución

### 3.1 Requisitos previos
- Node.js v18 o superior
- npm v9 o superior
- Conexión a Internet (para MongoDB Atlas y dependencias)

### 3.2 Pasos de instalación

#### Backend

```bash
# 1. Clonar el repositorio
git clone https://github.com/.../PizeriaKONE.git
cd PizeriaKONE/backend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Editar el archivo .env con los valores correspondientes

# 4. (Opcional) Sembrar datos de prueba
npm run seed

# 5. Iniciar el servidor en modo desarrollo
npm run dev
```

#### Frontend

```bash
# 1. En otra terminal, ir al directorio del frontend
cd PizeriaKONE/frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

### 3.3 Acceso a la aplicación
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000/api`
- **Imágenes:** `http://localhost:5000/images/`

### 3.4 Credenciales de prueba

| Rol           | Email                   | Contraseña   |
|---------------|-------------------------|--------------|
| Administrador | `admin@pizeriakone.com` | `admin123`   |
| Cliente       | `juan@gmail.com`        | `puntero123` |

---

---

## 4. Variables de entorno

### Backend (`backend/.env`)

| Variable | Descripción | Obligatorio | Ejemplo |
|----------------|-----------------------------------------|-------------------|--------------------------------------------------|
| `PORT`         | Puerto del servidor Express             | Sí                | `5000`                                           |
| `MONGO_URI`    | URI de conexión a MongoDB Atlas         | Sí                | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET`   | Clave secreta para firmar tokens JWT    | Sí                | `mi_clave_secreta_segura_2026`                   |
| `SMTP_HOST`    | Servidor SMTP para envío de emails      | Sí (recuperación) | `smtp.gmail.com`                                 |
| `SMTP_PORT`    | Puerto del servidor SMTP                | Sí                | `587`                                            |
| `SMTP_SECURE`  | Usar TLS seguro (`true`/`false`)        | Sí                | `false`                                          |
| `SMTP_USER`    | Email utilizado para enviar correos     | Sí                | `pizzeriakone.soporte@gmail.com`                 |
| `SMTP_PASS`    | Contraseña de aplicación SMTP           | Sí                | `abcd1234efgh5678`                               |
| `MAIL_FROM`    | Dirección de origen del correo          | Sí                | `pizzeriakone.soporte@gmail.com`                 |
| `FRONTEND_URL` | URL del frontend para enlaces en emails | Sí                | `http://localhost:5173`                          |

### Frontend (`frontend/.env`)

| Variable            | Descripción                    | Obligatorio | Ejemplo                     |
|---------------------|--------------------------------|-------------|-----------------------------|
| `VITE_API_BASE_URL` | URL base de la API del backend | Sí          | `http://localhost:5000/api` |

---

---

## 5. Dependencias

### Backend

| Paquete       | Versión | Propósito                                     |
|---------------|---------|-----------------------------------------------|
| express       | ^4.19.2 | Framework web para Node.js                    |
| mongoose      | ^8.3.2  | ODM para modelar datos en MongoDB             |
| jsonwebtoken  | ^9.0.3  | Generación y verificación de JWT              |
| bcryptjs      | ^3.0.3  | Encriptación de contraseñas                   |
| nodemailer    | ^8.0.10 | Envío de correos electrónicos (SMTP)          |
| cors          | ^2.8.6  | Middleware para CORS                          |
| dotenv        | ^16.4.5 | Carga de variables de entorno desde `.env`    |
| nodemon (dev) | ^3.1.0  | Recarga automática del servidor en desarrollo |

### Frontend

| Paquete | Versión | Propósito |
|----------------------|----------|-------------------------------------|
| react                | ^19.2.4  | Librería para interfaces de usuario |
| react-dom            | ^19.2.4  | Renderizado en el DOM               |
| react-router-dom     | ^7.13.1  | Enrutamiento y navegación           |
| react-toastify       | ^11.1.0  | Notificaciones toast                |
| lucide-react         | ^0.577.0 | Biblioteca de iconos                |
| tailwindcss          | ^4.2.1   | Framework de estilos CSS utilitario |
| vite                 | ^8.0.0   | Bundler y servidor de desarrollo    |
| @vitejs/plugin-react | ^6.0.0   | Plugin de Vite para React           |
| eslint (dev)         | ^9.39.4  | Linter de código                    |
| postcss              | ^8.5.3   | Procesador de CSS                   |
| autoprefixer         | ^10.4.21 | Prefijos CSS automáticos            |

---

---

## 6. Modelos de datos (Mongoose)

### Usuario (`User`)
| Campo                  | Tipo   | Detalles                                    |
|------------------------|--------|---------------------------------------------|
| `nombre`               | String | Requerido                                   |
| `email`                | String | Requerido, único                            |
| `password`             | String | Requerido, hasheado con bcrypt              |
| `rol`                  | String | Default: `'user'`. Valores: `user`, `admin` |
| `activo`               | Boolean | Default: `true`. Para baja lógica          |
| `resetPasswordToken`   | String | Hash SHA-256 del token de recuperación      |
| `resetPasswordExpires` | Date | Fecha de expiración del token                 |

### Producto (`Product`)
| Campo         | Tipo    | Detalles |
|---------------|---------|-----------------------------------|
| `nombre`      | String  | Requerido                         |
| `descripcion` | String  | Requerido                         |
| `precio`      | Number  | Requerido                         |
| `categoria`   | String  | Requerido                         |
| `stock`       | Number  | Requerido                         |
| `imagenUrl`   | String  | URL de la imagen                  |
| `activo`      | Boolean | Default: `true`. Para baja lógica |

### Orden (`Order`)
| Campo            | Tipo                 | Detalles                                                                  |
|------------------|----------------------|---------------------------------------------------------------------------|
| `usuario`        | ObjectId (ref: User) | Requerido                                                                 |
| `items`          | Array                | `[{ producto, cantidad, precioUnitario }]`                                |
| `total`          | Number               | Requerido                                                                 |
| `nombreCompleto` | String               | Requerido                                                                 |
| `dni`            | String               | Requerido                                                                 |
| `telefono`       | String               | Opcional                                                                  |    
| `direccion`      | String               | Requerido                                                                 |
| `tipoEntrega`    | String               | Enum: `local`, `domicilio`                                                |
| `medioPago`      | String               | Enum: `transferencia`, `efectivo`                                         |
| `estado`         | String               | Enum: `pendiente`, `pagado`, `enviado`, `entregado`. Default: `pendiente` |
| `timestamps`     | true                 | `createdAt`, `updatedAt` automáticos                                      |

### Carrito (`Cart`)
| Campo     | Tipo                 | Detalles                                                  |
|-----------|----------------------|-----------------------------------------------------------|
| `usuario` | ObjectId (ref: User) | Requerido, único (un carrito por usuario)                 |
| `items`   | Array                | `[{ producto: ObjectId ref: Product, cantidad: Number }]` |

---

---

## 7. Arquitectura del frontend

### Componentes
| Componente | Archivo | Función |
|----------------|---------------------------------|---------------------------------------------------------| 
| Navbar         | `components/Navbar.jsx`         | Navegación, botón de carrito con badge, menú de usuario |
| Hero           | `components/Hero.jsx`           | Sección principal de bienvenida                         |
| Specialties    | `components/Specialties.jsx`    | Grilla de productos con infinite scroll                 |
| Features       | `components/Features.jsx`       | Características del restaurante                         |
| Benefits       | `components/Benefits.jsx`       | Beneficios (ingredientes, delivery, calidad, precios)   |
| Location       | `components/Location.jsx`       | Dirección, horarios y mapa embebido                     |
| ContactForm    | `components/ContactForm.jsx`    | Formulario de contacto                                  |
| Cart           | `components/Cart.jsx`           | Vista del carrito con controles de cantidad             |
| Footer         | `components/Footer.jsx`         | Pie de página                                           |
| ProtectedRoute | `components/ProtectedRoute.jsx` | Protección de rutas por autenticación y rol             |

### Páginas
| Página | Ruta   | Descripción |
|-----------------|--------------------------|------------------------------------------|
| Login           | `/login`                 | Inicio de sesión                         |  
| Register        | `/register`              | Registro de usuario                      |
| ForgotPassword  | `/forgot-password`       | Solicitud de recuperación de contraseña  |
| ResetPassword   | `/reset-password/:token` | Restablecimiento de contraseña           |
| DetalleProducto | `/producto/:id`          | Detalle individual de producto           |
| Cart            | `/cart`                  | Carrito de compras                       |
| Checkout        | `/checkout`              | Formulario de compra (requiere auth)     |
| OrderHistory    | `/orders`                | Historial de pedidos (requiere auth)     |
| MiPerfil        | `/profile`               | Edición de perfil (requiere auth)        |
| AdminPanel      | `/admin`                 | Panel de administración (requiere admin) |

### Estado global
- **Context API:** Carrito de compras (`CartContext`)
- **Custom Hook:** `useCart()` para acceder al contexto
- **Persistencia:** localStorage (no autenticado) / MongoDB (autenticado)
- **Auth:** Token JWT almacenado en localStorage, verificado en ProtectedRoute

---

---

---

## 8. Concurrencia y buenas prácticas REST

### 8.1 Control de concurrencia en stock

**Problema:** En la primera versión, el descuento de stock se realizaba en dos pasos separados (validar stock → descontar stock), lo que generaba una condición de carrera (*race condition*). Si dos usuarios intentaban comprar la última unidad al mismo tiempo, ambos pasaban la validación de stock y la orden se creaba, resultando en stock negativo.

**Solución implementada:** Se reemplazó por una operación atómica de MongoDB que combina validación y descuento en un solo paso:

```js
const producto = await Product.findOneAndUpdate(
    { _id: item.producto, stock: { $gte: item.cantidad } },
    { $inc: { stock: -item.cantidad } },
    { new: true }
);
```

- `findOneAndUpdate` solo descuenta si hay stock suficiente (`stock: { $gte: cantidad }`)
- Si no hay stock, retorna `null` y se revierten los descuentos previos (rollback)
- Si la creación de la orden falla, también se revierte el stock
- MongoDB garantiza la atomicidad de la operación, eliminando la condición de carrera

### 8.2 Buenas prácticas REST aplicadas

| Práctica                         | Implementación                                                                                                      |
|----------------------------------|---------------------------------------------------------------------------------------------------------------------|
| **Rutas con sustantivos**        | `/products`, `/users`, `/orders`, `/cart` en lugar de `/getProducts`, `/createUser`                                 |
| **Métodos HTTP semánticos**      | GET (obtener), POST (crear), PUT (actualizar), DELETE (eliminar)                                                    |
| **Códigos de estado HTTP**       | 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Internal Server Error) |
| **Exclusión de datos sensibles** | Contraseñas omitidas en respuestas de endpoints públicos y privados                                                 |
| **Formato JSON uniforme**        | Todas las respuestas usan la misma estructura `{ message, data }`                                                   |
| **Validación en backend**        | Cada endpoint valida tipos, campos obligatorios y reglas de negocio antes de procesar                               |
| **Autenticación stateless**      | JWT sin estado de sesión en servidor, verificado en cada request mediante middleware                                |

---

*Trabajo Práctico Integrador Final — Programación IV — TUP UTN FRCU 2026*
