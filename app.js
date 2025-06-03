// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth_routes");
const userRoutes = require("./routes/user_routes");
const errorHandler = require("./middlewares/error_middleware");

const app = express();
let server = null; // Referência para o servidor

// Middlewares
app.use(express.json());

// Rotas públicas
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem-vindo à API!" });
});

// Rotas de usuário
app.use("/user", userRoutes);

// Rotas de autenticação
app.use("/auth", authRoutes);

// Middleware de erro
app.use(errorHandler);

const port = process.env.PORT || 4000;

const startServer = async (portToUse = port) => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      const dbUser = process.env.DB_USER;
      const dbPassword = process.env.DB_PASS;
      
      await mongoose.connect(
        `mongodb+srv://${dbUser}:${dbPassword}@clusterapi.aeczj.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPI`,
        {
          serverSelectionTimeoutMS: 30000
        }
      );
      console.log("Conectado ao MongoDB Atlas com sucesso!");
    }

    return new Promise((resolve) => {
      server = app.listen(portToUse, () => {
        console.log(`Servidor rodando na porta ${portToUse}`);
        resolve(server);
      });
    });
  } catch (err) {
    console.error("Erro ao conectar no MongoDB", err);
    process.exit(1);
  }
};

const closeServer = () => {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => resolve());
    } else {
      resolve();
    }
  });
};

// Inicia o servidor apenas fora do ambiente de teste
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = {
  app,
  startServer,
  closeServer
};
