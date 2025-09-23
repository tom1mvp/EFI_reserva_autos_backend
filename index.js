const express = require('express')
const cors = require('cors')
const app = express()

const port = 3000
app.use(cors())
app.use(express.json())

// Routers
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const peopleRouter = require('./routes/person.routes');

// Endpoits
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/people', peopleRouter);

app.listen(port, () => {console.log(
    `Servidor corriendo en localhost:${port}`
)})