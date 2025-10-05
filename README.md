## 🏙️ EFI Node & React 2025: *Sistema de Reserva de Autos* 🚗

**Última actualización: Lunes 28/09/2025**

Bienvenidos al repositorio del **Sistema de Reserva de Autos**, un proyecto desarrollado en el marco de la materia **Programación III**.  

Este repositorio contiene el **backend** de la aplicación, implementado con **Node.js**, **Express** y **Sequelize**, y en esta versión inicial incluye funcionalidades básicas de usuarios, pagos y facturación.

### 📌 Modelos implementados

- **Usuarios**  
- **Autos**  
- **Alquileres**  
- **Pagos**  
- **Facturas**  
- **Detalle de Factura**  
- **Personas**  

### 📌 Endpoints disponibles

- **Autenticación de usuarios** (`registro` y `login`)  
- **Pagos y facturación**  
  - `GET /payments` → Listar todos los pagos y sus facturas asociadas  
  - `POST /payments` → Crear un pago y generar su factura automáticamente  

En la siguiente sección se detallan los **endpoints**, los **parámetros requeridos**, y ejemplos de **request/response** para facilitar la integración.



## ⚙️ Endpoits


### 🔒 Auth

***Register - Registra al usuario***

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` |   *Nombre de la persona*   (**Requerido**) |
|`age`| `string`| *Edad*    (**Requerido**)|
|`gender`|`string`|*Género* (**Requerido**)|
|`birthday`|`date`| *Fecha de cumpleaños* (**Requerido**)|
|`dni`|`string`|*Documento de la persona* (**Requerido**)|
|`mail`|`string`|*Mail de la persona* (**Requerido**)|
|`phone`|`string`|*Teléfono de la persona* (**Requerido**)|
|`username`|`string`|*Nombre de usuario*(**Requerido**)|
|`password`|`string`|*Contraseña*(**Requerido**)|
|`role`|`string`|*Rol del usuario*(**Requerido**)|

***Login - Iniciar sesón***

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|`username`|`string`|*Nombre de usuario*(**Requerido**)|
|`password`|`string`|*Contraseña*(**Requerido**)|


### 💰 Payment

***Get all payment - Obtener todos los pagos***

| Field           | Type                        | Description                                      |
| :-------------- | :-------------------------- | :----------------------------------------------- |
| `id`            | integer                     | ID del pago                                      |
| `invoice_id`    | integer                     | ID de la factura asociada                        |
| `payment_date`  | date                        | Fecha del pago                                   |
| `amount`        | integer                     | Monto del pago                                   |
| `payment_method`| string                      | Método de pago                                   |
| `status`        | enum ('pending','paid')     | Estado del pago                                  |
| `is_active`     | boolean                     | Indica si el pago está activo                   |
| `createdAt`     | date                        | Fecha de creación del registro                  |
| `updatedAt`     | date                        | Fecha de última actualización                   |
| `user_id`       | integer              | ID del usuario que registró el pago |

***Create payment - crear pagos***

| Parameter      | Type     | Description                                         |
| :------------- | :------- | :--------------------------------------------------|
| `rental_id`    | integer  | ID del alquiler asociado (**Requerido**)           |
| `payment_date` | date     | Fecha del pago (**Requerido**)                     |
| `amount`       | integer  | Monto del pago (**Requerido**)                     |
| `payment_method` | string | Método de pago (ej. 'tarjeta', 'efectivo') (**Requerido**) |
| `status`       | enum ('pending','paid') | Estado del pago (**Requerido**)       |
| `details`      | string   | Detalle o descripción de la factura (**Requerido**)|


## 📦 Contenido  

Esta **primera versión** del sistema de reserva de autos introduce la estructura base del backend y define los principales modelos, rutas y controladores.  

### 🛠️ Funcionalidades iniciales  

- Configuración de la API con **Node.js** y **Express**.  
- Conexión inicial a la base de datos.  
- Creación de modelos principales:  
  - **Autos**  
  - **Usuarios**  
  - **Personas**  
  - **Pagos**  
  - **Facturas**  
  - **Detalle de Factura**  
  - **Alquileres**  
- Controlador de **autenticación (Auth)** con endpoints básicos para registro e inicio de sesión.  
- Controladores de **Pagos y Facturación**:  
  - `GET /payments` → listar todos los pagos y facturas asociadas  
  - `POST /payments` → crear un pago y generar su factura automáticamente  

### 🧩 Estructura y navegación  

El sistema organiza sus componentes en:  

- **Modelos** → definen la estructura de datos en la base.  
- **Controllers** → manejan la lógica de negocio.  
- **Rutas** → exponen los endpoints de la API.  

📌 En esta primera versión, las rutas incluyen:  
- **/auth/register** → registro de usuarios.  
- **/auth/login** → autenticación de usuarios.  
- **/payments** → gestión de pagos y facturas.  

### 🔐 Seguridad y flujo de usuarios  

Aunque es una versión inicial, ya se implementaron medidas básicas:  

- Encriptación de contraseñas en el registro.  
- Validación de credenciales en el login.  
- Creación y consulta de **pagos y facturas**.  
- Preparación para incluir **tokens JWT** en próximas actualizaciones.  

### 🚀 Próximos pasos  

En futuras versiones se planea:  
- Implementar CRUD completo para **Autos** y **Alquileres**.    
- Desarrollar una **interfaz web en React** conectada al backend.  


## ✍️ Autores 

- [@t.bratik](https://github.com/tom1mvp)
- [@m.geller](https://github.com/MarcosAyrton)
- [@s.giacomucci](https://github.com/Stefano818-bot)
