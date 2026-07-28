// ==========================================
// FUTUROLAB - AUTH
// Gerenciamento de autenticação
// ==========================================

// ==========================================
// TOKEN
// ==========================================

/**
 * Salva o token JWT no localStorage ou sessionStorage
 * @param {string} token - Token JWT
 * @param {boolean} remember - Se true, salva no localStorage (persistente)
 */
function saveToken(token, remember = false) {
    if (remember) {
        localStorage.setItem('futurolab_token', token);
        console.log('✅ Token salvo no localStorage (persistente)');
    } else {
        sessionStorage.setItem('futurolab_token', token);
        console.log('✅ Token salvo no sessionStorage (sessão)');
    }
}

/**
 * Recupera o token JWT armazenado
 * @returns {string|null} Token JWT ou null se não existir
 */
function getToken() {
    const token = sessionStorage.getItem('futurolab_token') || 
                  localStorage.getItem('futurolab_token');
    console.log('🔍 Token recuperado:', token ? '✅ Sim' : '❌ Não');
    return token;
}

/**
 * Remove o token JWT do armazenamento
 */
function removeToken() {
    localStorage.removeItem('futurolab_token');
    sessionStorage.removeItem('futurolab_token');
    console.log('🗑️ Token removido');
}

/**
 * Verifica se o usuário está autenticado
 * @returns {boolean}
 */
function isAuthenticated() {
    const authenticated = !!getToken();
    console.log('🔐 Usuário autenticado:', authenticated ? '✅ Sim' : '❌ Não');
    return authenticated;
}

// ==========================================
// LOGOUT
// ==========================================

/**
 * Faz logout do usuário
 * @param {boolean} redirect - Se true, redireciona para a página de login
 */
function logout(redirect = true) {
    console.log('🔓 Realizando logout...');
    removeToken();
    if (redirect) {
        console.log('🔄 Redirecionando para login...');
        window.location.href = 'login.html';
    }
}

// ==========================================
// REDIRECIONAMENTO
// ==========================================

/**
 * Redireciona após login bem-sucedido
 * @param {string} redirectTo - URL para redirecionar
 */
function redirectAfterLogin(redirectTo = 'dashboard.html') {
    console.log(`🔄 Redirecionando para: ${redirectTo}`);
    window.location.href = redirectTo;
}

// ==========================================
// VERIFICAÇÃO DE SESSÃO
// ==========================================

/**
 * Verifica se a sessão do usuário é válida
 * @returns {Promise<boolean>}
 */
async function verifySession() {
    const token = getToken();
    if (!token) {
        console.log('❌ Sessão inválida: token não encontrado');
        return false;
    }
    
    try {
        console.log('🔄 Verificando sessão com o servidor...');
        const response = await apiVerifyToken();
        const isValid = response.valid === true;
        console.log('✅ Sessão válida:', isValid ? '✅ Sim' : '❌ Não');
        return isValid;
    } catch (error) {
        console.error('❌ Erro ao verificar token:', error);
        return false;
    }
}

// ==========================================
// PROTEÇÃO DE ROTAS
// ==========================================

/**
 * Verifica se o usuário está autenticado e redireciona se necessário
 * @returns {boolean} - True se autenticado, False se não
 */
function requireAuth() {
    // Verificar se está autenticado
    if (!isAuthenticated()) {
        const currentPath = window.location.pathname;
        const protectedPages = [
            'dashboard.html', 
            'curso-conteudo-ia.html', 
            'curso-conteudo-python.html', 
            'curso-conteudo-automacao.html'
        ];
        
        const isProtected = protectedPages.some(page => currentPath.includes(page));
        
        if (isProtected) {
            console.log(`⛔ Acesso negado a ${currentPath}. Redirecionando para login...`);
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
    
    // Se está logado e está na página de login ou cadastro, redirecionar para dashboard
    const currentPath = window.location.pathname;
    if (currentPath.includes('login.html') || currentPath.includes('cadastro.html')) {
        console.log('🔄 Usuário já logado, redirecionando para dashboard...');
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}

// ==========================================
// INICIAR VERIFICAÇÃO AUTOMÁTICA
// ==========================================

/**
 * Verifica automaticamente se o usuário está logado ao carregar a página
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Verificando autenticação...');
    
    // Páginas públicas que não precisam de autenticação
    const publicPages = ['login.html', 'cadastro.html'];
    const isPublicPage = publicPages.some(page => window.location.pathname.includes(page));
    
    if (!isPublicPage) {
        const token = getToken();
        if (!token) {
            console.log('⛔ Usuário não autenticado, redirecionando para login...');
            window.location.href = 'login.html';
        } else {
            console.log('✅ Usuário autenticado');
        }
    } else {
        // Se está logado e está na página de login ou cadastro, redirecionar para dashboard
        const token = getToken();
        if (token) {
            console.log('🔄 Usuário já logado, redirecionando para dashboard...');
            window.location.href = 'dashboard.html';
        }
    }
});

// ==========================================
// EXPORTAR FUNÇÕES (para uso no navegador)
// ==========================================

window.saveToken = saveToken;
window.getToken = getToken;
window.removeToken = removeToken;
window.isAuthenticated = isAuthenticated;
window.logout = logout;
window.requireAuth = requireAuth;
window.redirectAfterLogin = redirectAfterLogin;
window.verifySession = verifySession;

console.log('🔐 Módulo de autenticação carregado com sucesso!');