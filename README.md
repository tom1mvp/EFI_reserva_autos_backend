## 🏙️ EFI Node & React 2025: *Sistema de Reserva de Autos* 🚗



**Última actualización: Martes 07/10/2025**

Bienvenidos al repositorio del **Sistema de Reserva de Autos**, un proyecto desarrollado en el marco teórico-práctico de la materia **Programación III**.  

Este repositorio contiene el **backend** de la aplicación, implementado con **Node.js** y **Express**.


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
- **CRUD completo de Autos**:
  - Solo accesible por administradores.
  - Administradores pueden **crear**, **editar**, **ver** y **eliminar** autos.
  - Usuarios pueden **ver los autos disponibles** para alquilar.
- **Creación de Alquileres**:
  - Los usuarios pueden realizar un **alquiler de autos** desde la plataforma.
  - Implementación de lógica automática con el paquete **`cron`**:
    - Todos los días a las **2:00 AM**, el sistema revisa qué alquileres vencieron el día anterior y **retorna automáticamente el auto al inventario disponible**.

## ⚙️ Endpoits


##  Gestión de Autos (CRUD)

Control total para **administradores** sobre el stock de autos:

###  Campos requeridos al crear o actualizar un auto:

| Campo         | Tipo     | Requerido | Descripción                          |
| ------------- | -------- | --------- | ------------------------------------ |
| `brand`       | `string` | ✅        | Marca del auto                       |
| `model`       | `string` | ✅        | Modelo del auto                      |
| `color`       | `string` | ✅        | Color del auto                       |
| `age`         | `number` | ✅        | Año o antigüedad                     |
| `price_day`   | `number` | ✅        | Precio por día                       |
| `stock`       | `number` | ✅        | Stock disponible                     |
| `available`   | `boolean`| ❌        | Por defecto `true`                   |
| `is_active`   | `boolean`| ❌        | Por defecto `true`                   |
| `image`       | `string` | ❌        | URL de la imagen                     |

---

## ⚙️ Endpoints de Autos

| Método | Endpoint         | Rol requerido | Descripción                     |
|--------|------------------|----------------|---------------------------------|
| GET    | `/autos`         | Público         | Ver todos los autos activos     |
| GET    | `/autos/:id`     | Público         | Ver detalles de un auto         |
| POST   | `/autos`         | Admin           | Crear un nuevo auto             |
| PUT    | `/autos/:id`     | Admin           | Actualizar un auto              |
| DELETE | `/autos/:id`     | Admin           | "Eliminar" (desactivar) un auto |

---

##  Alquiler de Autos

### ✅ Crear un alquiler

Cualquier usuario puede alquilar un auto si hay **stock disponible** y el auto está **activo y disponible**.

###  Campos requeridos:

| Campo            | Tipo     | Requerido | Descripción                         |
| ---------------- | -------- | --------- | ----------------------------------- |
| `car_id`         | `number` | ✅        | ID del auto a alquilar              |
| `user_id`        | `number` | ✅        | ID del usuario                      |
| `start_date`     | `date`   | ✅        | Fecha de inicio del alquiler        |
| `completion_date`| `date`   | ✅        | Fecha de finalización               |
| `daily_rate`     | `number` | ✅        | Precio por día                      |
| `total`          | `number` | ✅        | Total del alquiler calculado        |
| `observation`    | `string` | ❌        | Comentarios adicionales             |

Al momento de alquilar:

- Se **verifica disponibilidad y stock**.
- Se **reduce el stock del auto**.
- Se marca el alquiler como `activo`.

---

##  Finalización automática de alquileres

Gracias al uso del paquete **`node-cron`**, el sistema ejecuta una tarea diaria a las **2:00 AM**:

###  ¿Qué hace la tarea automática?

- Busca alquileres **activos** cuya **fecha de finalización haya pasado**.
- Marca esos alquileres como **inactivos**.
- **Devuelve el auto al stock** (suma +1 al stock del auto).

Esto permite mantener el stock sincronizado sin intervención manual.

---

###  Seguridad y flujo de usuarios  

- Encriptación de contraseñas en el registro.  
- Validación de credenciales en el login.  
- Preparación para incluir **tokens JWT** en próximas actualizaciones.  


---

###  Próximos pasos  

En futuras versiones se planea:   
- Agregar **roles de usuario** (administrador / cliente).  
- Incorporar un sistema de **pagos en línea**.  
- Mejorar el flujo de facturación y reportes.  
- Desplegar una interfaz en **React** conectada al backend.  


## ✍️ Autores 

- [@t.bratik](https://github.com/tom1mvp)
- [@m.geller](https://github.com/MarcosAyrton)
- [@s.giacomucci](https://github.com/Stefano818-bot)
