const { randomUUID } = require('node:crypto');
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

function validateService(data) {
  const errors = [];

  if (typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('name debe ser un texto no vacío');
  }

  if (
    typeof data.description !== 'string' ||
    !data.description.trim()
  ) {
    errors.push('description debe ser un texto no vacío');
  }

  if (!Number.isInteger(data.duration) || data.duration <= 0) {
    errors.push('duration debe ser un número entero mayor que 0');
  }

  if (
    typeof data.price !== 'number' ||
    !Number.isFinite(data.price) ||
    data.price < 0
  ) {
    errors.push('price debe ser un número mayor o igual a 0');
  }

  if (typeof data.category !== 'string' || !data.category.trim()) {
    errors.push('category debe ser un texto no vacío');
  }

  if (typeof data.available !== 'boolean') {
    errors.push('available debe ser true o false');
  }

  return errors;
}

function normalizeService(data) {
  return {
    name: data.name.trim(),
    description: data.description.trim(),
    duration: data.duration,
    price: data.price,
    category: data.category.trim(),
    available: data.available
  };
}

function validateBody(data) {
  if (!isObjectBody(data)) {
    throw createError(400, 'El cuerpo debe ser un objeto JSON');
  }
}

function rejectUnknownFields(data, allowedFields) {
  const unknownFields = Object.keys(data).filter(
    field => !allowedFields.includes(field)
  );

  if (unknownFields.length > 0) {
    throw createError(400, 'Hay campos no permitidos', {
      fields: unknownFields
    });
  }
}

function getServices() {
  return servicesRepository.getAll();
}

function getServiceById(id) {
  const service = servicesRepository.getById(id);

  if (!service) {
    throw createError(404, 'Servicio no encontrado');
  }

  return service;
}

function createService(data) {
  validateBody(data);

  if (Object.hasOwn(data, 'id')) {
    throw createError(
      400,
      'El id se genera automáticamente y no debe enviarse'
    );
  }

  const errors = validateService(data);

  if (errors.length > 0) {
    throw createError(400, 'Datos del servicio inválidos', {
      errors
    });
  }

  const service = {
    id: randomUUID(),
    ...normalizeService(data)
  };

  return servicesRepository.create(service);
}

function updateService(id, data) {
  validateBody(data);

  if (Object.hasOwn(data, 'id')) {
    throw createError(400, 'No se permite modificar el id');
  }

  const allowedFields = [
    'name',
    'description',
    'duration',
    'price',
    'category',
    'available'
  ];

  rejectUnknownFields(data, allowedFields);

  // PUT requiere todos los campos del servicio.
  const errors = validateService(data);

  if (errors.length > 0) {
    throw createError(
      400,
      'Todos los campos del servicio son obligatorios',
      { errors }
    );
  }

  const updatedService = servicesRepository.update(
    id,
    normalizeService(data)
  );

  if (!updatedService) {
    throw createError(404, 'Servicio no encontrado');
  }

  return updatedService;
}

function deleteService(id) {
  const deletedService = servicesRepository.delete(id);

  if (!deletedService) {
    throw createError(404, 'Servicio no encontrado');
  }

  return deletedService;
}

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};