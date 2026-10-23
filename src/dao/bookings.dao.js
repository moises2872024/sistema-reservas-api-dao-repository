const fs = require('node:fs');
const path = require('node:path');

const FILE_PATH = path.join(__dirname, '..', 'data', 'bookings.json');

function ensureFile() {
  const directory = path.dirname(FILE_PATH);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, '[]', 'utf8');
  }
}

function readData() {
  ensureFile();

  const content = fs.readFileSync(FILE_PATH, 'utf8');
  return JSON.parse(content);
}

function writeData(data) {
  ensureFile();
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function create(booking) {
  const bookings = readData();

  bookings.push(booking);
  writeData(bookings);

  return booking;
}

function getById(id) {
  return readData().find(booking => booking.id === id) || null;
}

function update(id, data) {
  const bookings = readData();
  const index = bookings.findIndex(booking => booking.id === id);

  if (index === -1) {
    return null;
  }

  const updatedBooking = {
    ...bookings[index],
    ...data,
    id: bookings[index].id
  };

  bookings[index] = updatedBooking;
  writeData(bookings);

  return updatedBooking;
}

module.exports = {
  create,
  getById,
  update
};