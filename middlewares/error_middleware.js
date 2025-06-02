const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Erro de validação do Joi
    if (err.isJoi) {
        return res.status(400).json({
            msg: "Erro na validação",
            errors: err.details.map((detail) => detail.message)
        });
    }

    // Erro de duplicidade do MongoDB
    if (err.code === 11000) {
        return res.status(400).json({
            msg: "Erro de duplicidade",
            error: err.keyValue
        });
    }

    // Erro genérico
    return res.status(500).json({
        msg: "Erro no servidor",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

module.exports = errorHandler;


