# API de Alquiler de Autos — Backend

Este proyecto es una API REST construida con Node.js, Express y Sequelize para gestionar un sistema de alquiler de autos. Provee endpoints para autenticación, gestión de usuarios, personas, autos, tabla de precios, alquileres y pagos.

- Runtime: Node.js + Express
- Base de datos: Sequelize (compatible con PostgreSQL/MySQL)
- Autenticación: JWT (Bearer Token)
- Tareas automáticas: node-cron para finalizar alquileres vencidos


## Índice
- [Instalación y ejecución](#instalación-y-ejecución)
- [Variables de entorno](#variables-de-entorno)
- [Configuración CORS](#configuración-cors)
- [Autenticación y seguridad](#autenticación-y-seguridad)
  - [Formato del token](#formato-del-token)
  - [Middlewares](#middlewares)
- [Modelo de datos (resumen)](#modelo-de-datos-resumen)
- [Convenciones de respuesta y errores](#convenciones-de-respuesta-y-errores)
- [Endpoints](#endpoints)
  - [/auth](#auth)
  - [/user](#user)
  - [/people](#people)
  - [/cars](#cars)
  - [/price/table](#pricetable)
  - [/rental](#rental)
  - [/payment](#payment)
  - [Correo (contacto)](#correo-contacto)
- [Tarea automática (Cron)](#tarea-automática-cron)

---

## Instalación y ejecución

1. Clonar el repositorio y entrar al directorio `backend`.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno (ver sección siguiente).
4. Ejecutar en desarrollo:
   ```bash
   npm run dev
   ```
   Producción/simple:
   ```bash
   npm start
   ```
5. Por defecto el servidor levanta en `http://localhost:3000`.

Al iniciar, el proyecto ejecuta `db.sequelize.sync({ alter: true })`, sincronizando los modelos con la base de datos.


## Variables de entorno
Crear un archivo `.env` en `backend/` con las siguientes claves (según tu entorno):

- `FRONT_URL` URLs permitidas por CORS (separadas por coma). Ej.: `http://localhost:5173`
- `JWT_SECRET` Secreto para firmar/validar JWT (si no se define, se usa `'AbcDLZ'`).
- `EMAIL` Cuenta de correo para envío de mails (SMTP Gmail en ejemplo).
- `APP_PASSWORD` App password de Gmail (para envío de correos).
- Variables de conexión de base de datos pueden estar en `config/config.json` (Sequelize CLI).


## Configuración CORS
En `index.js` hay una configuración CORS que permite:
- Origins: desde `FRONT_URL` (separadas por coma) o `['http://localhost:5173', 'http://localhost:3001']`
- Métodos: `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- Headers: `Content-Type, Authorization`
- Envío de cookies/credenciales: `credentials: true`


## Autenticación y seguridad
La mayoría de los endpoints públicos listados abajo no requieren autenticación, salvo los marcados. Para endpoints protegidos se usa JWT con el middleware `verifyToken`.

### Formato del token
Enviar el header `Authorization` con el esquema Bearer:
```
Authorization: Bearer <TOKEN-JWT>
```

El token se genera al hacer login y contiene, entre otros, `id` (ID de usuario) y `role` (rol, p.ej. `admin` o `customer`).

### Middlewares
- `verify_token` (`middlewares/verify_token.js`):
  - Valida header `Authorization: Bearer <token>` y verifica el JWT usando `process.env.JWT_SECRET || 'AbcDLZ'`.
  - Si es válido, adjunta el payload en `req.user` y continúa.
  - Respuestas de error:
    - `403 { message: 'Token requerido' }`
    - `401 { message: 'Formato invalido' }`
    - `401 { message: 'Token invalido o expirado' }`

- `is_admin` (`middlewares/is_admin.js`):
  - Verifica que el rol del usuario sea `admin` para permitir acceso a rutas restringidas.
  - Respuesta de error: `403 { message: 'Acceso denegado: se requiere rol admin' }`


## Modelo de datos (resumen)
Campos principales por entidad (según carpeta `models/`):

- `People` (`models/person.js`): `name`, `age`, `gender` ('female'|'male'|'other'), `birthday` (DATEONLY), `dni`, `phone`.
- `User` (`models/users.js`): `people_id` (FK a People), `username` (único), `role` ('admin'|'customer', default 'customer'), `password`, `mail` (único), `image`, `is_active` (boolean).
- `Car` (`models/cars.js`): `brand`, `model`, `color`, `age` (string), `price_day` (decimal), `availble` (boolean), `stock` (decimal), `image`, `is_active` (boolean).
- `Rental` (`models/rentals.js`): relación con `User` y `Car`; además: `start_date`, `completion_date`, `daily_rate`, `total`, `observation`, `is_active`.
- `PriceTable` (`models/table_price.js`): `name`, `price`, `category`.
- `Payment` (`models/payment.js`): relación con `Invoice`; campos típicos: `payment_date`, `amount`, `payment_method`, `status`, `is_active`.
- `Invoice` / `invoiceDetail` (presentes en controladores y modelos): Facturación asociada a Rentals y a PriceTable.

Relaciones destacadas:
- `People 1..n User`
- `User 1..n Rental`
- `User 1..n Payment`
- `Car 1..n Rental`
- `Rental 1..n Invoice`
- `Invoice 1..n invoiceDetail`
- `PriceTable 1..n invoiceDetail`


## Convenciones de respuesta y errores
- Éxito: por lo general `200` con `{ status: 200, data: ... }` o directamente el recurso (p.ej. lista de autos).
- Creación: `201` con `{ message: '...', data: ... }`.
- No encontrado: `404` con `{ message: '... no encontrado' }`.
- Validación: `400` con `{ message: 'Faltan datos...' }`.
- Autorización/Autenticación: `401` o `403` según corresponda.
- Error interno: `500` con `{ message: 'Error ...', error: error.message }`.

Nota: Algunas respuestas pueden variar ligeramente entre controladores (p.ej., envoltura `{ status, data }` o datos planos).

---

## Endpoints
A continuación se listan todos los endpoints montados en `index.js` con sus verbos HTTP, seguridad y estructuras de entrada/salida.

### /auth
Base: `/auth`

1) POST `/auth/register`
- Público
- Body JSON:
  ```json
  {
    "name": "Juan Perez",
    "age": "30",
    "gender": "male",
    "birthday": "1994-01-01",
    "dni": "12345678",
    "mail": "juan@example.com",
    "phone": "123456789",
    "username": "juan",
    "password": "Secreta123",
    "confirm_password": "Secreta123",
    "role": "customer",
    "is_active": true
  }
  ```
- Respuestas:
  - 201 `{ message: 'Registro exitoso', data: { people, user } }`
  - 400 `{ message: 'Username y password son requeridos' }` u otros errores de validación
  - 500 `{ message: 'Error al registrar', error }`

2) POST `/auth/login`
- Público
- Body JSON:
  ```json
  { "username": "juan", "password": "Secreta123" }
  ```
- Respuestas:
  - 200 `{ message, token, role, username, id }`
  - 400 `{ message: 'Usuario no encontrado' }`
  - 403 `{ message: 'Contraseña incorrecta' }`
  - 500 `{ message: 'Error al loguear el usuario', error }`

3) POST `/auth/forgot-password`
- Público
- Body JSON:
  ```json
  { "email": "juan@example.com" }
  ```
- Respuestas:
  - 200 `{ message: 'Email de recuperación enviado' }`
  - 400 `{ message: 'El usuario no existe' }`
  - 500 `{ message: 'Error al enviar el mail' }`

4) POST `/auth/reset-password`
- Público
- Body JSON:
  ```json
  { "id": 1, "token": "<token>", "password": "Nueva123", "confirm_password": "Nueva123" }
  ```
- Respuestas esperadas:
  - 200 `{ message: 'Contraseña actualizada correctamente' }`
  - 400 `{ message: 'Token invalido' | 'Faltan datos' }`
  - 500 `{ message: 'Error al recuperar la contraseña' }`


### /user
Base: `/user`

1) GET `/user/`
- Requiere: `verifyToken` + `isAdmin`
- Devuelve lista de usuarios.
- Respuestas:
  - 200 `{ status: 200, data: User[] }`
  - 403 si no es admin

2) GET `/user/username/:username`
- Requiere: `isAdmin`
- Path params: `username`
- Respuestas:
  - 200 `{ status: 200, data: User }`
  - 404 `{ message: 'No se encontro el username del usuario' }`

3) GET `/user/profile/:id`
- Requiere: `verifyToken`
- Path params: `id` (del usuario)
- Respuestas:
  - 200 `{ status: 200, data: User }`
  - 404 `{ message: 'Usuario no encontrado' }`

4) GET `/user/:id/person`
- Requiere: `verifyToken`
- Devuelve la persona asociada a un usuario.
- Respuestas:
  - 200 `People` (objeto plano)
  - 404 `{ message: 'Usuario no encontrado' | 'Persona no encontrada para este usuario' }`

5) PUT `/user/update/:id`
- Requiere: `verifyToken`
- Body (todos opcionales):
  ```json
  { "username": "nuevo", "password": "hash o plain", "mail": "u@e.com", "role": "admin|customer", "image": "url" }
  ```
- Respuestas:
  - 200 `{ message: 'Usuario editado exitosamente', data: User }`
  - 404 `{ message: 'Usuario no encontrado' }`

6) PATCH `/user/:id/status`
- Requiere: `verifyToken`
- Marca lógicamente inactivo.
- Respuestas:
  - 200 `{ message: 'Usuario eliminado exitosamente' }`
  - 404 `{ message: 'Usuario no encontrado' }`


### /people
Base: `/people`

1) GET `/people/`
- Requiere: `isAdmin`
- Respuestas:
  - 200 `{ status: 200, data: People[] }`

2) GET `/people/name/:name`
- Público
- Respuestas:
  - 200 `{ status: 200, data: People }`
  - 404 `{ message: 'No se encontró ninguna persona con ese nombre' }`

3) GET `/people/:id`
- Requiere: `isAdmin`
- Respuestas:
  - 200 `{ status: 200, data: People }`
  - 404 `{ message: 'Persona no encontrada' }`


### /cars
Base: `/cars`

1) GET `/cars/`
- Público
- Respuesta: `200` con `Car[]` (array plano)

2) GET `/cars/:id`
- Público
- Respuestas:
  - 200 `Car`
  - 404 `{ message: 'Auto no encontrado' }`

3) POST `/cars/`
- Público (en código actual no exige auth; en escenarios reales conviene restringir a admin)
- Body JSON (requeridos):
  ```json
  {
    "brand": "Ford",
    "model": "Focus",
    "color": "Azul",
    "age": "2018",
    "price_day": 50,
    "stock": 3,
    "available": true,
    "image": "https://...",
    "is_active": true
  }
  ```
- Respuestas:
  - 201 `{ message: 'Auto creado exitosamente', data: Car }`
  - 400 `{ message: 'Faltan datos requeridos' }`

4) PUT `/cars/:id`
- Público (sugerido: restringir)
- Body: campos a actualizar parciales.
- Respuestas:
  - 200 `{ message: 'Auto actualizado exitosamente', data: Car }`
  - 404 `{ message: 'Auto no encontrado' }`

5) DELETE `/cars/:id`
- Público (sugerido: restringir)
- Realiza baja lógica (`is_active = false`).
- Respuestas:
  - 200 `{ message: 'Auto eliminado exitosamente' }`
  - 404 `{ message: 'Auto no encontrado' }`


### /price/table
Base: `/price/table`

1) GET `/price/table/`
- Público
- Respuesta: `200 { status: 200, data: PriceTable[] }`

2) POST `/price/table/`
- Público (sugerido: restringir)
- Body JSON (requeridos):
  ```json
  { "name": "Seguro Full", "price": 25, "category": "insurance" }
  ```
- Respuesta: `201 { status: 201, message: 'Elemento creado con éxito', data: PriceTable }`

3) PUT `/price/table/:id`
- Público (sugerido: restringir)
- Body: `{ name?, price?, category? }`
- Respuestas:
  - 200 esperado tras actualizar (el controlador actual no envía respuesta explícita; considerar ajuste)
  - 404 `{ message: 'Elemento no encontrado' }`


### /rental
Base: `/rental`

1) GET `/rental/rentals`
- Requiere: `verifyToken`
- Query params (opcionales):
  - `status`: `active` | `overdue` | `finished`
  - `user_id`: filtra por usuario (solo admins pueden especificar otro usuario)
  - `page`: número de página (default 1)
  - `limit`: tamaño de página (default 10)
- Comportamiento:
  - Si no es admin, se fuerza `user_id = req.user.id`.
  - `overdue` devuelve alquileres activos con `completion_date` menor a hoy.
- Respuesta: `200` con `Rental[]` ordenado por `start_date DESC`.

2) POST `/rental/rentals`
- Requiere: `verifyToken`
- Body JSON (requeridos):
  ```json
  {
    "car_id": 1,
    "user_id": 10,
    "start_date": "2025-11-01",
    "completion_date": "2025-11-05",
    "daily_rate": 50,
    "total": 200,
    "observation": "Alguna nota"
  }
  ```
- Validaciones:
  - Verifica `Car` disponible (`is_active`, `stock > 0`, `availble`)
  - Disminuye `stock` del auto al crear
- Respuestas:
  - 201 `{ message: 'Alquiler creado', data: Rental }`
  - 400 `{ message: 'El auto no está disponible' }`

3) POST `/rental/rentals/:id/finish`
- Requiere: `verifyToken` + `isAdmin`
- Efecto: marca `is_active = false` y devuelve stock al `Car`.
- Respuestas:
  - 200 `{ message: 'Alquiler finalizado', data: Rental }`
  - 404 `{ message: 'Alquiler no encontrado' }`
  - 400 `{ message: 'El alquiler ya está finalizado' }`


### /payment
Base: `/payment`

1) GET `/payment/`
- Público
- Respuesta: `200 { status: 200, data: Payment[] }`

2) POST `/payment/`
- Requiere: `verifyToken`
- Crea el pago y, a la vez, genera una `Invoice` con sus detalles.
- Body JSON (requeridos):
  ```json
  {
    "rental_id": 15,
    "payment_date": "2025-11-04",
    "amount": 200,
    "payment_method": "credit_card",
    "status": "paid",
    "details": [
      { "price_table_id": 1, "quantity": 4, "unit_price": 50 }
    ]
  }
  ```
- Respuestas:
  - 201 `{ message: 'Pago y factura creados con éxito', data: { payment, invoice } }`
  - 400 `{ message: 'Faltan campos obligatorios' }`
  - 500 `{ message: 'Error al crear el pago y la factura', error }`




