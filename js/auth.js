// ==========================================
// FUTUROLAB - AUTH
// Gerenciamento de autenticação
// ==========================================

// ==========================================
// TOKEN
// ==========================================

function saveToken(token, remember = false) {
    if (remember) {
        localStorage.setItem('futurolab_token', token);
    } else {
        sessionStorage.setItem('futurolab_token', token);
    }
}

function getToken() {
    // Primeiro verifica sessionStorage, depois localStorage
    return sessionStorage.getItem('futurolab_token') || 
           localStorage.getItem('futurolab_token');
}

function removeToken() {
    localStorage.removeItem('futurolab_token');
    sessionStorage.removeItem('futurolab_token');
}

function isAuthenticated() {
    return !!getToken();
}

// ==========================================
// LOGOUT
// ==========================================

function logout(redirect = true) {
    removeToken();
    if (redirect) {
        window.location.href = 'login.html';
    }
}

// ==========================================
// REDIRECIONAR APÓS LOGIN
// ==========================================

function redirectAfterLogin(redirectTo = 'dashboard.html') {
    window.location.href = redirectTo;
}

// ==========================================
// VERIFICAR SESSÃO
// ==========================================

async function verifySession() {
    const token = getToken();
    if (!token) return false;
    
    try {
        const response = await apiVerifyToken();
        return response.valid === true;
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return false;
    }
}

// ==========================================
// PROTEGER ROTAS
// ==========================================

function requireAuth() {
    if (!isAuthenticated()) {
        const currentPath = window.location.pathname;
        const protectedPages = ['dashboard.html'];
        
        const isProtected = protectedPages.some(page => currentPath.includes(page));
        
        if (isProtected) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
    
    // Se está logado e está na página de login ou cadastro, redirecionar para dashboard
    const currentPath = window.location.pathname;
    if (currentPath.includes('login.html') || currentPath.includes('cadastro.html')) {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}

// ==========================================
// INICIAR VERIFICAÇÃO AUTOMÁTICA
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Se estiver na página de login ou cadastro, não bloqueia
    const publicPages = ['login.html', 'cadastro.html'];
    const isPublicPage = publicPages.some(page => window.location.pathname.includes(page));
    
    if (!isPublicPage) {
        const token = getToken();
        if (!token) {
            // Redirecionar para login
            window.location.href = 'login.html';
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
