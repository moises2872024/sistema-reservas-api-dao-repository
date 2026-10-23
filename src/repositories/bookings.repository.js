const bookingsDAO = require('../dao/bookings.dao');

function create(booking) {
  return bookingsDAO.create(booking);
}

function getById(id) {
  return bookingsDAO.getById(id);
}

function update(id, data) {
  return bookingsDAO.update(id, data);
}

module.exports = {
  create,
  getById,
  update
};