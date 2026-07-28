// ==========================================
// API: /api/users/profile
// Método: GET, PUT
// Descrição: Buscar ou atualizar perfil
// ==========================================

const { getDB } = require('../_lib/db');
const { authMiddleware } = require('../_lib/auth');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'PUT') {
        return res.status(405).json({
            success: false,
            message: 'Método não permitido'
        });
    }

    try {
        const authError = await authMiddleware(req, res);
        if (authError) return authError;

        const db = await getDB();
        const users = db.collection('users');
        const userId = req.user._id;

        if (req.method === 'GET') {
            const user = await users.findOne(
                { _id: new ObjectId(userId) },
                { projection: { senha: 0 } }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            return res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    nome: user.nome,
                    email: user.email,
                    cursos: user.cursos || [],
                    createdAt: user.createdAt
                }
            });
        }

        if (req.method === 'PUT') {
            const { nome } = req.body;

            const updateData = {};
            if (nome && nome.trim().length >= 3) {
                updateData.nome = nome.trim();
            }

            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Nenhum dado para atualizar'
                });
            }

            updateData.updatedAt = new Date();

            const result = await users.findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $set: updateData },
                { returnDocument: 'after' }
            );

            if (!result.value) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuário não encontrado'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Perfil atualizado com sucesso',
                user: {
                    _id: result.value._id,
                    nome: result.value.nome,
                    email: result.value.email
                }
            });
        }

    } catch (error) {
        console.error('Erro no perfil:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
