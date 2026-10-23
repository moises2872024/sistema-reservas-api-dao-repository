const servicesDAO = require('../dao/services.dao');

function getAll() {
  return servicesDAO.getAll();
}

function getById(id) {
  return servicesDAO.getById(id);
}

function create(service) {
  return servicesDAO.create(service);
}

function update(id, data) {
  return servicesDAO.update(id, data);
}

function deleteService(id) {
  return servicesDAO.delete(id);
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteService
};