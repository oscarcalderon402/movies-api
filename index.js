const express = require('express');
const app = express();

const { config } = require('./config/index');
const moviesApi = require('./routes/movies');


const {
    logErrors,
    wrapErrors,
    errorHandler
} = require('./utils/middleware/errorHandlers')

const notFoundHandler = require('./utils/middleware/notFoundHandler');

// middleware de bodyparser
app.use(express.json());


moviesApi(app);

// Catch 404
app.use(notFoundHandler);

//middleware de manejo de errores
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server listen on http://localhost:${config.port}`)
})

