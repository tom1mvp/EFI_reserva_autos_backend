## 🏙️ EFI Node & React 2025: *Sistema de Reserva de Autos* 🚗


**Última actualización: Lunes 22/09/2025**:

Bienvenidos al repositorio del **Sistema de Reserva de Autos**, un proyecto desarrollado en el marco teórico-práctico de la materia **Programación III**.  

Este repositorio contiene el **backend** de la aplicación, implementado con **Node.js** y **Express**, y en esta primera versión incluye:  

### 📌 Modelos iniciales

- **Autos**  
- **Usuarios**  
- **Personas**  
- **Pagos**  
- **Facturas**  
- **Detalle de Factura**  
- **Alquileres**

### 📌 Controladores y Rutas
- **Auth (con sus endpoints básicos de autenticación).**
En la siguiente sección se detallarán los endpoints disponibles en esta versión, su funcionalidad y ejemplos de uso.

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

### 🧩 Estructura y navegación  

El sistema organiza sus componentes en:  

- **Modelos** → definen la estructura de datos en la base.  
- **Controllers** → manejan la lógica de negocio.  
- **Rutas** → exponen los endpoints de la API.  

📌 En esta primera versión, las rutas incluyen:  
- **/auth/register** → registro de usuarios.  
- **/auth/login** → autenticación de usuarios.  

### 🔐 Seguridad y flujo de usuarios  

Aunque es una versión inicial, ya se implementaron medidas básicas:  

- Encriptación de contraseñas en el registro.  
- Validación de credenciales en el login.  
- Preparación para incluir **tokens JWT** en próximas actualizaciones.  

### 🚀 Próximos pasos  

En futuras versiones se planea:  
- Implementar CRUD completo para **Autos** y **Alquileres**.  
- Agregar **roles de usuario** (administrador / cliente).  
- Incorporar un sistema de **pagos en línea**.  
- Mejorar el flujo de facturación y reportes.  
- Desplegar una interfaz en **React** conectada al backend.  


## ✍️ Autores 

- [@t.bratik](https://github.com/tom1mvp)
- [@m.geller](https://github.com/MarcosAyrton)
- [@s.giacomucci](https://github.com/Stefano818-bot)
