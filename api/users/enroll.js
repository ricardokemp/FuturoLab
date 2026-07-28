// ==========================================
// API: /api/users/enroll
// Método: POST
// Descrição: Matricular em curso
// ==========================================

const { getDB } = require('../_lib/db');
const { authMiddleware } = require('../_lib/auth');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Método não permitido'
        });
    }

    try {
        const authError = await authMiddleware(req, res);
        if (authError) return authError;

        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'ID do curso é obrigatório'
            });
        }

        const db = await getDB();
        const users = db.collection('users');
        const userId = req.user._id;

        // Verificar se o curso existe (mock)
        const cursosValidos = ['1', '2', '3'];
        if (!cursosValidos.includes(courseId)) {
            return res.status(404).json({
                success: false,
                message: 'Curso não encontrado'
            });
        }

        const user = await users.findOne({ _id: new ObjectId(userId) });
        if (user.cursos && user.cursos.includes(courseId)) {
            return res.status(400).json({
                success: false,
                message: 'Você já está matriculado neste curso'
            });
        }

        await users.updateOne(
            { _id: new ObjectId(userId) },
            { 
                $addToSet: { cursos: courseId },
                $set: { updatedAt: new Date() }
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Matrícula realizada com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao matricular:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
