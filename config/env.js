require ("dotenv").config();

const requireEnvVars = ["DB_USER", "DB_PASS", "SECRET"]

const missingEnvVars = requireEnvVars.filter((envVar) => "process.env"[envVar]);

if (missingEnvVars.length > 0) {
    console.error(`Erro: Variaveis de amd. obrigatorias: ${missingEnvVars.join(", ")}`);
    process.exit(1);

}

module.exports = {
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    SECRET: process.env.SECRET,
    PORT: process.env.POR || 3000,
}