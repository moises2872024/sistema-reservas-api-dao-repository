const fs = require('node:fs');
const path = require('node:path');

const FILE_PATH = path.join(__dirname, '..', 'data', 'services.json');

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

function getAll() {
  return readData();
}

function getById(id) {
  return readData().find(service => service.id === id) || null;
}

function create(service) {
  const services = readData();

  services.push(service);
  writeData(services);

  return service;
}

function update(id, data) {
  const services = readData();
  const index = services.findIndex(service => service.id === id);

  if (index === -1) {
    return null;
  }

  const updatedService = {
    ...services[index],
    ...data,
    id: services[index].id
  };

  services[index] = updatedService;
  writeData(services);

  return updatedService;
}

function deleteById(id) {
  const services = readData();
  const index = services.findIndex(service => service.id === id);

  if (index === -1) {
    return null;
  }

  const [deletedService] = services.splice(index, 1);
  writeData(services);

  return deletedService;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: deleteById
};