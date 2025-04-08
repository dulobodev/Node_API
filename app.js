require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./usuarioModel");
const jwt = require("jsonwebtoken");

//cria uma instância do Express
const app = express();

//Configura o express para entender req. em Json
app.use(express.json());

app.get("/", (requisicao, resposta) => {
  resposta.status(200).send({ msg: "Bem Vindo a API!" });
});

app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório! " });
  }

  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório! " });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória! " });
  }

  if (password != confirmpassword) {
    return res
      .status(422)
      .json({ msg: "A senha e a confirmação precisam ser iguais!" });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "Por favor, utilize outro E-mail!" });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save(); // Salva o usuario no banco de Dados

    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "O E-mail é obrigatorio" });
  }

  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatoria" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Usuario não encontrado!" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha invalida" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );
    res
      .status(200)
      .json({ msg: "Autentificação realizada com sucesso.", token });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
});

app.get("/user/:id", checktoken, async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Erro ao buscar usuário" });
    x;
  }
});

//Midlleeware (Chegagem de token)
function checktoken(req, res, next) {
  const authheader = req.headers["authorization"];
  const token = authheader && authheader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ msg: "Acesso Negado!" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "Token inválido." });
  }
}

const dbUser = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

// faz a conexao com o mongodb
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${password}@clusterapi.aeczj.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPI`
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectou ao banco e o servidor porta 3000");
  })
  .catch((err) => console.log(err));
