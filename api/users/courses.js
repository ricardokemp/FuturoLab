// ==========================================
// API: /api/users/courses
// Método: GET
// Descrição: Buscar cursos do usuário
// ==========================================

const { getDB } = require('../_lib/db');
const { authMiddleware } = require('../_lib/auth');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
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

        const user = await users.findOne(
            { _id: new ObjectId(userId) },
            { projection: { cursos: 1 } }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado'
            });
        }

        // Lista de cursos (mock - substituir por dados reais)
        const cursosMock = [
            {
                _id: '1',
                titulo: 'IA para Adolescentes',
                descricao: 'Aprenda Inteligência Artificial na prática',
                progresso: 75,
                imagem: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop',
                link: 'curso-ia.html'
            },
            {
                _id: '2',
                titulo: 'Python do Zero',
                descricao: 'Programação para iniciantes',
                progresso: 100,
                imagem: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=300&fit=crop',
                link: 'curso-python.html'
            },
            {
                _id: '3',
                titulo: 'Automação Inteligente',
                descricao: 'Crie soluções automatizadas com IA',
                progresso: 30,
                imagem: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop',
                link: 'curso-automacao.html'
            }
        ];

        const cursosMatriculados = user.cursos || [];
        const cursos = cursosMock.filter(c => cursosMatriculados.includes(c._id));

        return res.status(200).json({
            success: true,
            cursos
        });

    } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
