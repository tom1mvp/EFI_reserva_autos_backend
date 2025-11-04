const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const db = require('./models');

const cron = require('node-cron');


const port = 3000

// CORS configuration
const corsOptions = {
    origin: process.env.FRONT_URL ? process.env.FRONT_URL.split(',') : ['http://localhost:5173', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json())


// database synchronization
db.sequelize.sync({ alter: true })
    .then(() => {
        console.log("Base de datos sincronizada con éxito")
    })
    .catch(error => {
        console.error("Error al sincronizar la base de datos", error);
    });


const { autoFinishRentals } = require('./controller/rental.controller');


// Routers
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const peopleRouter = require('./routes/person.routes');
const paymentRouter = require('./routes/payment.routes');
const priceTableRouter = require('./routes/priceTable.routes');
const carRouter = require('./routes/car.routes');
const rentalRouter = require('./routes/rental.routes');



// Endpoits
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/cars', carRouter);
app.use('/people', peopleRouter);
app.use('/payment', paymentRouter);
app.use('/price/table', priceTableRouter);
app.use('/rental', rentalRouter);



app.listen(port, () => {console.log(
    `Servidor corriendo en localhost:${port}`
)});


// script de cron para finalizar alquileres vencidos todos los dias a las 2am(para que funcione cada minuto para testearla poner *****)
cron.schedule('0 2 * * *', () => {
    console.log('Ejecutando tarea automática para finalizar alquileres vencidos');
    autoFinishRentals();
});