// ==========================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ==========================================

const jwt = require('jsonwebtoken');
const { getDB } = require('./db');
const { ObjectId } = require('mongodb');

const JWT_SECRET = process.env.JWT_SECRET || 'futurolab-secret-key-change-me';

// ==========================================
// GERAR TOKEN
// ==========================================

function generateToken(userId, email) {
    return jwt.sign(
        { userId, email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// ==========================================
// VERIFICAR TOKEN
// ==========================================

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

// ==========================================
// MIDDLEWARE - Autenticar requisição
// ==========================================

async function authMiddleware(req, res) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Token não fornecido'
        });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado'
        });
    }
    
    try {
        const db = await getDB();
        const users = db.collection('users');
        const user = await users.findOne({ _id: new ObjectId(decoded.userId) });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }
        
        req.user = {
            _id: user._id,
            nome: user.nome,
            email: user.email,
            cursos: user.cursos || []
        };
        
        return null;
    } catch (error) {
        console.error('Erro no authMiddleware:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

module.exports = {
    generateToken,
    verifyToken,
    authMiddleware,
    validateEmail,
    JWT_SECRET
};
