const User = require("../models/usuarioModel");

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password"); // Exclui o campo password
        
        if (!user) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserById
};
