// ==========================================
// FUTUROLAB - API
// Comunicação com o backend
// ==========================================

// ==========================================
// URL DA API - DETECÇÃO AUTOMÁTICA
// ==========================================

// Detecta se está em ambiente local (localhost ou 127.0.0.1)
const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1' ||
                window.location.hostname === '';

// Define a URL da API baseado no ambiente
const API_URL = isLocal 
    ? 'http://localhost:3000/api' 
    : 'https://futurolab.onrender.com/api';

console.log('=========================================');
console.log('🔗 AMBIENTE:', isLocal ? '📍 DESENVOLVIMENTO LOCAL' : '🚀 PRODUÇÃO (Render)');
console.log('🔗 API URL:', API_URL);
console.log('=========================================');

// ==========================================
// FUNÇÃO PRINCIPAL DE REQUISIÇÃO
// ==========================================

/**
 * Faz uma requisição para a API
 * @param {string} endpoint - Endpoint da API (ex: '/auth/register')
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {object} data - Dados a serem enviados no body (para POST/PUT)
 * @param {boolean} auth - Se a requisição precisa de autenticação
 * @returns {Promise} - Resposta da API em JSON
 */
async function apiRequest(endpoint, method = 'GET', data = null, auth = true) {
    const url = `${API_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    // Adicionar token se autenticado
    if (auth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log(`🔑 Token adicionado: ${endpoint}`);
        } else {
            console.log(`⚠️ Sem token para: ${endpoint}`);
        }
    }

    const options = {
        method,
        headers,
    };

    if (data) {
        options.body = JSON.stringify(data);
        console.log(`📦 Dados enviados para ${endpoint}:`, data);
    }

    try {
        console.log(`📤 Requisição: ${method} ${url}`);
        const response = await fetch(url, options);
        console.log(`📥 Status: ${response.status} ${response.statusText}`);

        // Verificar se a resposta é JSON
        const contentType = response.headers.get('content-type');
        let result;
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            const text = await response.text();
            console.warn('⚠️ Resposta não é JSON:', text.substring(0, 100));
            throw new Error('Resposta do servidor não é JSON válido');
        }

        if (!response.ok) {
            console.error(`❌ Erro ${response.status} em ${endpoint}:`, result);
            
            // Se token expirou ou é inválido, redirecionar para login
            if (response.status === 401) {
                removeToken();
                const publicPages = ['login.html', 'cadastro.html'];
                const isPublicPage = publicPages.some(page => window.location.pathname.includes(page));
                if (!isPublicPage) {
                    console.log('⛔ Token expirado, redirecionando para login...');
                    window.location.href = 'login.html';
                }
            }
            throw new Error(result.message || 'Erro na requisição');
        }

        console.log(`✅ Sucesso em ${endpoint}`);
        return result;
    } catch (error) {
        console.error(`❌ API Error em ${endpoint}:`, error);
        throw error;
    }
}

// ==========================================
// AUTENTICAÇÃO
// ==========================================

/**
 * Cadastrar novo usuário
 * @param {object} data - { nome, email, senha }
 * @returns {Promise}
 */
async function apiRegister(data) {
    console.log('📝 Registrando usuário...');
    return await apiRequest('/auth/register', 'POST', data, false);
}

/**
 * Login do usuário
 * @param {object} data - { email, senha }
 * @returns {Promise}
 */
async function apiLogin(data) {
    console.log('🔑 Fazendo login...');
    return await apiRequest('/auth/login', 'POST', data, false);
}

/**
 * Login com Google (Firebase)
 * @param {object} data - { token, email, nome }
 * @returns {Promise}
 */
async function apiLoginWithGoogle(data) {
    console.log('🔑 Login com Google...');
    return await apiRequest('/auth/google', 'POST', data, false);
}

/**
 * Verificar se o token é válido
 * @returns {Promise}
 */
async function apiVerifyToken() {
    console.log('🔍 Verificando token...');
    return await apiRequest('/auth/verify', 'GET', null, true);
}

// ==========================================
// USUÁRIO
// ==========================================

/**
 * Buscar perfil do usuário logado
 * @returns {Promise}
 */
async function apiGetProfile() {
    console.log('👤 Buscando perfil...');
    return await apiRequest('/users/profile', 'GET', null, true);
}

/**
 * Atualizar perfil do usuário
 * @param {object} data - { nome, email }
 * @returns {Promise}
 */
async function apiUpdateProfile(data) {
    console.log('📝 Atualizando perfil...');
    return await apiRequest('/users/profile', 'PUT', data, true);
}

/**
 * Buscar cursos do usuário
 * @returns {Promise}
 */
async function apiGetUserCourses() {
    console.log('📚 Buscando cursos...');
    return await apiRequest('/users/courses', 'GET', null, true);
}

/**
 * Matricular usuário em um curso
 * @param {string} courseId - ID do curso ('1', '2', '3')
 * @returns {Promise}
 */
async function apiEnrollCourse(courseId) {
    console.log(`📚 Matriculando no curso ${courseId}...`);
    return await apiRequest('/users/enroll', 'POST', { courseId }, true);
}

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

/**
 * Verifica se a API está online
 * @returns {Promise<boolean>}
 */
async function apiHealthCheck() {
    console.log('🏥 Verificando saúde da API...');
    try {
        const response = await fetch(`${API_URL}`);
        const result = await response.json();
        console.log('✅ API saudável');
        return result.success === true;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return false;
    }
}

// ==========================================
// EXPORTAR FUNÇÕES (para uso no navegador)
// ==========================================

// Tornar funções globais
window.apiRequest = apiRequest;
window.apiRegister = apiRegister;
window.apiLogin = apiLogin;
window.apiLoginWithGoogle = apiLoginWithGoogle;
window.apiVerifyToken = apiVerifyToken;
window.apiGetProfile = apiGetProfile;
window.apiUpdateProfile = apiUpdateProfile;
window.apiGetUserCourses = apiGetUserCourses;
window.apiEnrollCourse = apiEnrollCourse;
window.apiHealthCheck = apiHealthCheck;
window.API_URL = API_URL;

console.log('=========================================');
console.log('✅ API carregada com sucesso!');
console.log(`📡 Endpoint: ${API_URL}`);
console.log('📋 Funções disponíveis:');
console.log('   - apiRegister(data)');
console.log('   - apiLogin(data)');
console.log('   - apiLoginWithGoogle(data)');
console.log('   - apiVerifyToken()');
console.log('   - apiGetProfile()');
console.log('   - apiUpdateProfile(data)');
console.log('   - apiGetUserCourses()');
console.log('   - apiEnrollCourse(courseId)');
console.log('   - apiHealthCheck()');
console.log('=========================================');