// auth.test.js
const request = require('supertest');
const { app, startServer, closeServer } = require('../app');
const User = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
let server; // Aqui vamos guardar o servidor

jest.setTimeout(30000); // 30 segundos

beforeAll(async () => {
  process.env.NODE_ENV = 'test'; // Garante ambiente de teste
  server = await startServer();  // Inicia o servidor real (mesmo que no Mongo em memória)
});

afterAll(async () => {
  await closeServer(); // Fecha o servidor corretamente
});

describe('Auth Endpoints', () => {
  describe('POST /auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        nome: 'Test User',
        email: 'valid@teste.com',
        password: 'password123',
        confirmpassword: 'password123'
      };

      const response = await request(server)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('msg', 'Usuário criado com sucesso!');
    });

    it('should not register user with existing email', async () => {
      const userData = {
        nome: 'Test User',
        email: 'test@teste.com',
        password: 'password123',
        confirmpassword: 'password123'
      };

      await User.create({
        ...userData,
        password: await bcrypt.hash(userData.password, 12)
      });

      const response = await request(server)
        .post('/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'E-mail já cadastrado!');
    });

    it('should not register user with invalid data', async () => {
      const invalidData = {
        nome: '',
        email: 'invalid',
        password: '123',
        confirmpassword: '123'
      };

      const response = await request(server)
        .post('/auth/register')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('msg', 'Dados inválidos');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      const passwordHash = await bcrypt.hash('password123', 12);
      await User.create({
        nome: 'Test User',
        email: 'test@teste.com',
        password: passwordHash
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@teste.com',
        password: 'password123'
      };

      const response = await request(server)
        .post('/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('msg', 'Autenticado com sucesso!');
    });

    it('should not login with invalid password', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: 'test@teste.com', password: 'wrongpass' });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('msg', 'Senha inválida');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: 'no@user.com', password: 'password123' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('msg', 'Usuário não encontrado');
    });
  });
});
