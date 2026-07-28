// ==========================================
// API: /api/auth/login
// Método: POST
// Descrição: Login do usuário
// ==========================================

const { getDB } = require('../_lib/db');
const { generateToken, validateEmail } = require('../_lib/auth');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Método não permitido'
        });
    }

    try {
        const { email, senha } = req.body;

        if (!email || !validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'E-mail inválido'
            });
        }

        if (!senha || senha.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Senha inválida'
            });
        }

        const db = await getDB();
        const users = db.collection('users');

        const user = await users.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'E-mail ou senha incorretos'
            });
        }

        const isPasswordValid = await bcrypt.compare(senha, user.senha);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'E-mail ou senha incorretos'
            });
        }

        const token = generateToken(user._id, user.email);

        return res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso',
            token,
            user: {
                _id: user._id,
                nome: user.nome,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
