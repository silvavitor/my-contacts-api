const express = require('express');

const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3132, () => console.log('Server started at 127.0.0.1:3132'));
