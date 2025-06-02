const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                msg: "Dados inválidos",
                errors: error.details.map((detail) => detail.message)
            });
        }
        next();
    };
};

module.exports = validateRequest;