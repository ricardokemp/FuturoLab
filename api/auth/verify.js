// ==========================================
// API: /api/auth/verify
// Método: GET
// Descrição: Verificar se o token é válido
// ==========================================

const { authMiddleware } = require('../_lib/auth');

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

        return res.status(200).json({
            success: true,
            valid: true,
            user: req.user
        });

    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};
