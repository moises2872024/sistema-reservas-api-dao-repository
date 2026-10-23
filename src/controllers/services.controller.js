const servicesService = require('../services/services.service');

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

function getServices(req, res) {
  try {
    const services = servicesService.getServices();

    return res.status(200).json({
      status: 'success',
      data: services
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Error al obtener los servicios'
    );
  }
}

function getServiceById(req, res) {
  try {
    const service = servicesService.getServiceById(req.params.sid);

    return res.status(200).json({
      status: 'success',
      data: service
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Error al obtener el servicio'
    );
  }
}

function createService(req, res) {
  try {
    const service = servicesService.createService(req.body);

    return res.status(201).json({
      status: 'success',
      message: 'Servicio creado correctamente',
      data: service
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Error al crear el servicio'
    );
  }
}

function updateService(req, res) {
  try {
    const service = servicesService.updateService(
      req.params.sid,
      req.body
    );

    return res.status(200).json({
      status: 'success',
      message: 'Servicio actualizado correctamente',
      data: service
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Error al actualizar el servicio'
    );
  }
}

function deleteService(req, res) {
  try {
    const service = servicesService.deleteService(req.params.sid);

    return res.status(200).json({
      status: 'success',
      message: 'Servicio eliminado correctamente',
      data: service
    });
  } catch (error) {
    return handleError(
      res,
      error,
      'Error al eliminar el servicio'
    );
  }
}

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService
};