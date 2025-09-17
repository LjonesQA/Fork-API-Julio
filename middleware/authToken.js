// Middleware para autenticação JWT de usuários
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: { message: 'Token não fornecido' } });

    jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: { message: 'Token inválido' } });
        req.user = user;
        next();
    });
}

module.exports = { authToken, SECRET };
