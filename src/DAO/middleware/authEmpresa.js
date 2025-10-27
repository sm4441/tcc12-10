const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'segredo_super_forte';

function authEmpresa(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ sucesso: false, mensagem: 'Token não fornecido.' });

  const [, token] = authHeader.split(' ');
  if (!token) return res.status(401).json({ sucesso: false, mensagem: 'Token inválido.' });

  try {
    const payload = jwt.verify(token, SECRET);
    // payload deve conter { id: ..., tipo: 'empresa' } conforme seu login
    if (payload.tipo !== 'empresa') {
      return res.status(403).json({ sucesso: false, mensagem: 'Acesso restrito a empresas.' });
    }
    req.empresa = { id: payload.id, nome: payload.nome };
    next();
  } catch (err) {
    return res.status(401).json({ sucesso: false, mensagem: 'Token inválido ou expirado.' });
  }
}

module.exports = { authEmpresa };
