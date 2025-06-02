const Joi = require("joi");

const registerSchema = Joi.object({
    nome: Joi.string().required().min(3).messages({
        "string.empty": "O nome é obrigatório",
        "string.min": "O nome deve ter no mínimo 3 caracteres"
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "O email é obrigatório",
        "string.email": "Por favor, insira um email válido"
    }),
    password: Joi.string().required().min(6).messages({
        "string.empty": "A senha é obrigatória",
        "string.min": "A senha deve ter no mínimo 6 caracteres"
    }),
    confirmpassword: Joi.string().required().valid(Joi.ref("password")).messages({
        "string.empty": "A confirmação de senha é obrigatória",
        "any.only": "As senhas não conferem"
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "O email é obrigatório",
        "string.email": "Por favor, insira um email válido"
    }),
    password: Joi.string().required().messages({
        "string.empty": "A senha é obrigatória"
    })
});

module.exports = {
    registerSchema,
    loginSchema
}; 