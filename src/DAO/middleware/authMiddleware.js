const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "segredo_super_forte";

// Middleware para verificar o token JWT
function autenticarToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Pega o token após "Bearer"

    if (!token) {
        return res.status(401).json({ sucesso: false, mensagem: "Token não fornecido." });
    }

    jwt.verify(token, SECRET, (err, usuario) => {
        if (err) {
            return res.status(403).json({ sucesso: false, mensagem: "Token inválido ou expirado." });
        }

        req.usuario = usuario; // Armazena os dados do usuário no request
        next(); // Permite seguir para a rota
    });
}

module.exports = { autenticarToken };
