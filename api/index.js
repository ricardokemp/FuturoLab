// ==========================================
// FUTUROLAB - API
// Servidor Principal
// ==========================================

const http = require('http');
const url = require('url');

// Importar handlers
const registerHandler = require('./auth/register');
const loginHandler = require('./auth/login');
const verifyHandler = require('./auth/verify');
const profileHandler = require('./users/profile');
const coursesHandler = require('./users/courses');
const enrollHandler = require('./users/enroll');

// ==========================================
// ROTEADOR
// ==========================================

const routes = {
    'POST /api/auth/register': registerHandler,
    'POST /api/auth/login': loginHandler,
    'GET /api/auth/verify': verifyHandler,
    'GET /api/users/profile': profileHandler,
    'PUT /api/users/profile': profileHandler,
    'GET /api/users/courses': coursesHandler,
    'POST /api/users/enroll': enrollHandler,
};

// ==========================================
// SERVIDOR
// ==========================================

const server = http.createServer(async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const routeKey = `${req.method} ${path}`;

    // Buscar handler
    const handler = routes[routeKey];

    if (!handler) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: 'Rota não encontrada'
        }));
        return;
    }

    // Processar body para POST/PUT
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            if (body) {
                req.body = JSON.parse(body);
            } else {
                req.body = {};
            }

            // Adicionar query params
            req.query = parsedUrl.query;

            // Executar handler
            await handler(req, res);
        } catch (error) {
            console.error('Erro no servidor:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Erro interno do servidor'
            }));
        }
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API disponível em: http://localhost:${PORT}/api`);
});
