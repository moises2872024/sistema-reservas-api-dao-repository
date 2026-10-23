const bookingsService = require('../services/bookings.service');

function handleError(res, error, fallbackMessage) {
  if (error.statusCode && error.statusCode < 500) {
    const response = {
      status: 'error',
      message: error.message
    };

    if (error.errors) {
      response.errors = error.errors;
    }

    if (error.fields) {
      response.fields = error.fields;
    }

    return res.status(error.statusCode).json(response);
  }

  return res.status(500).json({
    status: 'error',
    message: fallbackMessage
  });
}

function createBooking(req, res) {
  try {
    const booking = bookingsService.createBooking(req.body);

    return res.status(201).json({
      status: 'success',
      message: 'Reserva creada correctamente',
      data: booking
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Error al crear la reserva'
    );
  }
}

function getBookingById(req, res) {
  try {
    const booking = bookingsService.getBookingById(req.params.bid);

    return res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Error al obtener la reserva'
    );
  }
}

function addServiceToBooking(req, res) {
  try {
    const booking = bookingsService.addServiceToBooking(
      req.params.bid,
      req.params.sid
    );

    return res.status(200).json({
      status: 'success',
      message: 'Servicio agregado a la reserva correctamente',
      data: booking
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Error al agregar el servicio a la reserva'
    );
  }
}

module.exports = {
  createBooking,
  getBookingById,
  addServiceToBooking
};