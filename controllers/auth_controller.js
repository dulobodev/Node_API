const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usuarioModel");
const { registerSchema } = require("../validators/auth_validator");

const registerUser = async (req, res, next) => {
  try {
    // Validação com Joi
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: "Dados inválidos" });
    }

    const { nome, email, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "E-mail já cadastrado!" });
    }

    // Cria hash da senha
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Cria e salva o novo usuário
    const user = new User({ 
      nome, 
      email, 
      password: passwordHash 
    });
    
    await user.save();

    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Busca usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    // Verifica a senha
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida" });
    }

    // Gera token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        nome: user.nome, 
        email: user.email 
      },
      process.env.SECRET || "default-secret",
      { expiresIn: "24h" }
    );

    // Retorna resposta com token
    res.status(200).json({
      msg: "Autenticado com sucesso!",
      token,
      user: { 
        id: user._id, 
        nome: user.nome, 
        email: user.email 
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser };