// ==========================================
// FUTUROLAB - API
// Comunicação com o backend
// ==========================================

// URL da API no Render
const API_URL = 'https://futurolab.onrender.com/api';

// ==========================================
// FUNÇÃO PRINCIPAL DE REQUISIÇÃO
// ==========================================

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
        }
    }

    const options = {
        method,
        headers,
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            // Se token expirou, redirecionar para login
            if (response.status === 401) {
                removeToken();
                if (!window.location.pathname.includes('login.html') && 
                    !window.location.pathname.includes('cadastro.html')) {
                    window.location.href = 'login.html';
                }
            }
            throw new Error(result.message || 'Erro na requisição');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==========================================
// AUTENTICAÇÃO
// ==========================================

// Cadastro
async function apiRegister(data) {
    return await apiRequest('/auth/register', 'POST', data, false);
}

// Login
async function apiLogin(data) {
    return await apiRequest('/auth/login', 'POST', data, false);
}

// Verificar token
async function apiVerifyToken() {
    return await apiRequest('/auth/verify', 'GET', null, true);
}

// ==========================================
// USUÁRIO
// ==========================================

// Buscar perfil
async function apiGetProfile() {
    return await apiRequest('/users/profile', 'GET', null, true);
}

// Atualizar perfil
async function apiUpdateProfile(data) {
    return await apiRequest('/users/profile', 'PUT', data, true);
}

// Buscar cursos do usuário
async function apiGetUserCourses() {
    return await apiRequest('/users/courses', 'GET', null, true);
}

// Matricular em curso
async function apiEnrollCourse(courseId) {
    return await apiRequest('/users/enroll', 'POST', { courseId }, true);
}

// ==========================================
// EXPORTAR FUNÇÕES (para uso no navegador)
// ==========================================

// Tornar funções globais
window.apiRequest = apiRequest;
window.apiRegister = apiRegister;
window.apiLogin = apiLogin;
window.apiVerifyToken = apiVerifyToken;
window.apiGetProfile = apiGetProfile;
window.apiUpdateProfile = apiUpdateProfile;
window.apiGetUserCourses = apiGetUserCourses;
window.apiEnrollCourse = apiEnrollCourse;
