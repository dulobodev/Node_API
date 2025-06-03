const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  // Inicia o MongoDB em memória
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Conecta o Mongoose
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000
  });
});

afterEach(async () => {
  // Limpa todos os dados após cada teste
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  // Fecha conexões
  await mongoose.disconnect();
  await mongoServer.stop();
});
