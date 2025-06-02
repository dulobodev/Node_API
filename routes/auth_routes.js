const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/auth_controller");
const validateRequest = require("../middlewares/validation_middleware");
const { registerSchema, loginSchema } = require("../validators/auth_validator");

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);

module.exports = router;