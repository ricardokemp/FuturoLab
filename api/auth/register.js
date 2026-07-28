// ==========================================
// API: /api/auth/register
// Método: POST
// Descrição: Cadastrar novo usuário
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
        const { nome, email, senha } = req.body;

        if (!nome || nome.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Nome deve ter no mínimo 3 caracteres'
            });
        }

        if (!email || !validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'E-mail inválido'
            });
        }

        if (!senha || senha.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Senha deve ter no mínimo 6 caracteres'
            });
        }

        const db = await getDB();
        const users = db.collection('users');

        const existingUser = await users.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Este e-mail já está cadastrado'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const newUser = {
            nome: nome.trim(),
            email: email.toLowerCase(),
            senha: senhaHash,
            cursos: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await users.insertOne(newUser);
        const token = generateToken(result.insertedId, newUser.email);

        return res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso',
            token,
            user: {
                _id: result.insertedId,
                nome: newUser.nome,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
