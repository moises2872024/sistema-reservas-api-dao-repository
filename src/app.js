const express = require('express');

const servicesRouter = require('./routes/services.router');
const bookingsRouter = require('./routes/bookings.router');

const app = express();

app.use(express.json());

app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);

module.exports = app;