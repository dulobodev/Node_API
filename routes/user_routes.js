const express = require('express');
const router = express.Router();
const { getUserById } = require('../controllers/user_controller');
const checkToken = require('../middlewares/auth_middleware');

// Rota para buscar usuário por ID
router.get('/:id', checkToken, getUserById);

module.exports = router;