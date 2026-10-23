const { randomUUID } = require('node:crypto');
const bookingsRepository = require('../repositories/bookings.repository');
const servicesRepository = require('../repositories/services.repository');

function createError(statusCode, message, details = {}) {
  const error = new Error(message);
  error.statusCode = statusCode;
  Object.assign(error, details);
  return error;
}

function isObjectBody(data) {
  return data !== null &&
    typeof data === 'object' &&
    !Array.isArray(data);
}

function isValidDate(date) {
  if (
    typeof date !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date)
  ) {
    return false;
  }

  const parsed = new Date(`${date}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}

function validateBooking(data) {
  const errors = [];

  if (
    typeof data.clientName !== 'string' ||
    !data.clientName.trim()
  ) {
    errors.push('clientName debe ser un texto no vacío');
  }

  if (
    typeof data.clientEmail !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)
  ) {
    errors.push('clientEmail debe ser un correo electrónico válido');
  }

  if (!isValidDate(data.date)) {
    errors.push('date debe ser una fecha válida con formato AAAA-MM-DD');
  }

  if (
    typeof data.time !== 'string' ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.time)
  ) {
    errors.push('time debe tener el formato HH:mm');
  }

  if (
    data.status !== undefined &&
    (
      typeof data.status !== 'string' ||
      !data.status.trim()
    )
  ) {
    errors.push('status debe ser un texto no vacío');
  }

  return errors;
}

function createBooking(data) {
  if (!isObjectBody(data)) {
    throw createError(400, 'El cuerpo debe ser un objeto JSON');
  }

  const allowedFields = [
    'clientName',
    'clientEmail',
    'date',
    'time',
    'status'
  ];

  const unknownFields = Object.keys(data).filter(
    field => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    throw createError(400, 'Hay campos no permitidos', {
      fields: unknownFields
    });
  }

  const errors = validateBooking(data);

  if (errors.length > 0) {
    throw createError(400, 'Datos de la reserva inválidos', {
      errors
    });
  }

  const booking = {
    id: randomUUID(),
    clientName: data.clientName.trim(),
    clientEmail: data.clientEmail.trim(),
    date: data.date,
    time: data.time,
    status: data.status === undefined
      ? 'pending'
      : data.status.trim(),
    services: []
  };

  return bookingsRepository.create(booking);
}

function getBookingById(id) {
  const booking = bookingsRepository.getById(id);

  if (!booking) {
    throw createError(404, 'Reserva no encontrada');
  }

  return booking;
}

function addServiceToBooking(bookingId, serviceId) {
  // Primero se verifica la existencia de la reserva.
  const booking = bookingsRepository.getById(bookingId);

  if (!booking) {
    throw createError(404, 'Reserva no encontrada');
  }

  // Se verifica la existencia y disponibilidad del servicio.
  const service = servicesRepository.getById(serviceId);

  if (!service) {
    throw createError(404, 'Servicio no encontrado');
  }

  if (!service.available) {
    throw createError(409, 'El servicio no está disponible');
  }

  // La regla de quantity pertenece a la capa Services.
  const bookingServices = Array.isArray(booking.services)
    ? booking.services
    : [];

  const existingItem = bookingServices.find(
    item => item.service === serviceId
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    bookingServices.push({
      service: serviceId,
      quantity: 1
    });
  }

  const updatedBooking = bookingsRepository.update(bookingId, {
    services: bookingServices
  });

  if (!updatedBooking) {
    throw createError(404, 'Reserva no encontrada');
  }

  return updatedBooking;
}

module.exports = {
  createBooking,
  getBookingById,
  addServiceToBooking
};