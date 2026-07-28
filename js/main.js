// ==========================================
// FUTUROLAB - MAIN
// JavaScript Principal
// ==========================================

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. NAVBAR - Efeito de Scroll
    // ==========================================

    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ==========================================
    // 2. SCROLL SUAVE para links internos
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const destino = document.querySelector(href);
            
            if (destino) {
                const offsetTop = destino.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 3. CONTADORES ANIMADOS (página inicial)
    // ==========================================

    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length > 0) {
        let animated = false;
        
        function animateCounters() {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function para suavizar
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(easeOutQuart * target);
                    
                    counter.textContent = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }
                
                requestAnimationFrame(updateCounter);
            });
        }
        
        function checkCountersVisibility() {
            if (animated) return;
            
            const heroStats = document.querySelector('.hero-stats');
            if (!heroStats) return;
            
            const rect = heroStats.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                animated = true;
                animateCounters();
            }
        }
        
        window.addEventListener('scroll', checkCountersVisibility);
        window.addEventListener('load', checkCountersVisibility);
        setTimeout(checkCountersVisibility, 500);
    }

    // ==========================================
    // 4. BOTÃO "VOLTAR AO TOPO"
    // ==========================================

    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 5. ANIMAÇÕES DE REVELAÇÃO (Scroll Reveal)
    // ==========================================

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (revealElements.length > 0) {
        function checkReveal() {
            revealElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
                
                if (isVisible) {
                    element.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', checkReveal);
        window.addEventListener('load', checkReveal);
        window.addEventListener('resize', checkReveal);
        setTimeout(checkReveal, 300);
    }

    // ==========================================
    // 6. FILTRO DE CURSOS (página cursos.html)
    // ==========================================

    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseItems = document.querySelectorAll('.curso-item');
    const noResults = document.getElementById('noResults');

    if (filterButtons.length > 0 && courseItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline-light');
                });

                this.classList.remove('btn-outline-light');
                this.classList.add('btn-primary');

                const filter = this.dataset.filter;
                let visibleCount = 0;

                courseItems.forEach(item => {
                    if (filter === 'todos' || item.dataset.categoria === filter) {
                        item.style.display = 'block';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });

                if (noResults) {
                    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
                }
            });
        });
    }

    // ==========================================
    // 7. CLOSE MOBILE MENU
    // ==========================================

    const navbarNav = document.getElementById('navbarNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    if (navbarNav && navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                const isMobile = window.innerWidth < 992;
                if (isMobile && navbarNav.classList.contains('show')) {
                    const toggler = document.querySelector('.navbar-toggler');
                    if (toggler) {
                        toggler.click();
                    }
                }
            });
        });
    }

    // ==========================================
    // 8. VALIDAÇÃO DE FORMULÁRIOS (geral)
    // ==========================================

    document.querySelectorAll('form[novalidate]').forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
                const firstInvalid = this.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    });

    console.log('🚀 FuturoLab - Site carregado com sucesso!');
});
// ==========================================
// FUTUROLAB - MAIN
// JavaScript Principal
// ==========================================

document.addEventListener('DOMContentLoaded', function() {

    console.log('🚀 FuturoLab - Inicializando...');

    // ==========================================
    // 1. NAVBAR - Efeito de Scroll
    // ==========================================

    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        console.log('✅ Navbar configurada');
    }

    // ==========================================
    // 2. SCROLL SUAVE para links internos
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const destino = document.querySelector(href);
            
            if (destino) {
                const offsetTop = destino.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                console.log(`📜 Scroll suave para: ${href}`);
            }
        });
    });

    // ==========================================
    // 3. CONTADORES ANIMADOS (página inicial)
    // ==========================================

    const counters = document.querySelectorAll('.stat-number');
    
    if (counters.length > 0) {
        console.log(`📊 ${counters.length} contadores encontrados`);
        let animated = false;
        
        function animateCounters() {
            if (animated) return;
            animated = true;
            console.log('🔄 Iniciando animação dos contadores...');
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function para suavizar
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(easeOutQuart * target);
                    
                    counter.textContent = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                        console.log(`✅ Contador finalizado: ${target}`);
                    }
                }
                
                requestAnimationFrame(updateCounter);
            });
        }
        
        function checkCountersVisibility() {
            if (animated) return;
            
            const heroStats = document.querySelector('.hero-stats');
            if (!heroStats) return;
            
            const rect = heroStats.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                console.log('👁️ Contadores visíveis, iniciando animação...');
                animateCounters();
            }
        }
        
        window.addEventListener('scroll', checkCountersVisibility);
        window.addEventListener('load', checkCountersVisibility);
        setTimeout(checkCountersVisibility, 500);
    }

    // ==========================================
    // 4. BOTÃO "VOLTAR AO TOPO"
    // ==========================================

    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            console.log('⬆️ Voltar ao topo');
        });
        console.log('✅ Back to Top configurado');
    }

    // ==========================================
    // 5. ANIMAÇÕES DE REVELAÇÃO (Scroll Reveal)
    // ==========================================

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (revealElements.length > 0) {
        console.log(`🎬 ${revealElements.length} elementos de revelação encontrados`);
        
        function checkReveal() {
            revealElements.forEach(element => {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;
                
                if (isVisible) {
                    element.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', checkReveal);
        window.addEventListener('load', checkReveal);
        window.addEventListener('resize', checkReveal);
        setTimeout(checkReveal, 300);
    }

    // ==========================================
    // 6. FILTRO DE CURSOS (página cursos.html)
    // ==========================================

    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseItems = document.querySelectorAll('.curso-item');
    const noResults = document.getElementById('noResults');

    if (filterButtons.length > 0 && courseItems.length > 0) {
        console.log(`🔍 ${filterButtons.length} botões de filtro encontrados`);
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline-light');
                });

                this.classList.remove('btn-outline-light');
                this.classList.add('btn-primary');

                const filter = this.dataset.filter;
                let visibleCount = 0;

                courseItems.forEach(item => {
                    if (filter === 'todos' || item.dataset.categoria === filter) {
                        item.style.display = 'block';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });

                console.log(`🔍 Filtro: ${filter} → ${visibleCount} cursos visíveis`);

                if (noResults) {
                    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
                }
            });
        });
    }

    // ==========================================
    // 7. CLOSE MOBILE MENU
    // ==========================================

    const navbarNav = document.getElementById('navbarNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    if (navbarNav && navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                const isMobile = window.innerWidth < 992;
                if (isMobile && navbarNav.classList.contains('show')) {
                    const toggler = document.querySelector('.navbar-toggler');
                    if (toggler) {
                        toggler.click();
                        console.log('📱 Menu mobile fechado');
                    }
                }
            });
        });
    }

    // ==========================================
    // 8. FILTRO DO BLOG
    // ==========================================

    const blogFilterButtons = document.querySelectorAll('.blog .filter-btn');
    const blogItems = document.querySelectorAll('.blog-item');

    if (blogFilterButtons.length > 0 && blogItems.length > 0) {
        console.log(`📝 ${blogFilterButtons.length} botões de filtro do blog encontrados`);
        
        blogFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                blogFilterButtons.forEach(btn => {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline-light');
                });

                this.classList.remove('btn-outline-light');
                this.classList.add('btn-primary');

                const filter = this.dataset.filter;
                let visibleCount = 0;

                blogItems.forEach(item => {
                    if (filter === 'todos' || item.dataset.categoria === filter) {
                        item.style.display = 'block';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });

                console.log(`📝 Filtro blog: ${filter} → ${visibleCount} artigos visíveis`);

                const noBlogResults = document.getElementById('noBlogResults');
                if (noBlogResults) {
                    noBlogResults.style.display = visibleCount === 0 ? 'block' : 'none';
                }
            });
        });
    }

    // ==========================================
    // 9. PRELOADER
    // ==========================================

    const preloader = document.querySelector('.preloader-premium');
    if (preloader) {
        console.log('⏳ Preloader encontrado, aguardando carregamento...');
        window.addEventListener('load', function() {
            setTimeout(function() {
                preloader.classList.add('hidden');
                console.log('✅ Preloader removido');
            }, 500);
        });
    }

    // ==========================================
    // 10. VERIFICAR AUTENTICAÇÃO (Menu)
    // ==========================================

    const navLogin = document.getElementById('navLogin');
    const navCadastro = document.getElementById('navCadastro');
    const navUser = document.getElementById('navUser');
    const userNameNav = document.getElementById('userNameNav');

    // Verificar se o usuário está logado
    if (typeof getToken === 'function') {
        const token = getToken();
        
        if (token && navUser) {
            console.log('👤 Usuário logado detectado');
            
            if (navLogin) navLogin.style.display = 'none';
            if (navCadastro) navCadastro.style.display = 'none';
            if (navUser) navUser.classList.remove('d-none');

            // Buscar nome do usuário
            if (typeof apiGetProfile === 'function') {
                apiGetProfile().then(perfil => {
                    if (perfil.success && userNameNav) {
                        userNameNav.textContent = perfil.user.nome.split(' ')[0];
                        console.log(`👤 Nome do usuário: ${perfil.user.nome}`);
                    }
                }).catch(() => {
                    console.warn('⚠️ Não foi possível buscar o perfil do usuário');
                });
            }

            // Logout
            const logoutNav = document.getElementById('logoutNav');
            if (logoutNav && typeof logout === 'function') {
                logoutNav.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('🔓 Logout solicitado');
                    logout();
                });
            }
        } else {
            console.log('👤 Usuário não logado');
        }
    }

    // ==========================================
    // 11. FORMULÁRIO DE CONTATO
    // ==========================================

    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        console.log('📝 Formulário de contato encontrado');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (formMessage) formMessage.style.display = 'none';

            // Validação simples
            const nome = document.getElementById('nome')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const assunto = document.getElementById('assunto')?.value;
            const mensagem = document.getElementById('mensagem')?.value.trim();

            if (!nome || !email || !assunto || !mensagem) {
                if (formMessage) {
                    formMessage.className = 'alert-custom alert-danger';
                    formMessage.textContent = '⚠️ Preencha todos os campos obrigatórios.';
                    formMessage.style.display = 'block';
                }
                console.warn('⚠️ Formulário de contato incompleto');
                return;
            }

            console.log('📝 Enviando formulário de contato...');

            // Simula envio
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
            }

            setTimeout(function() {
                if (formMessage) {
                    formMessage.className = 'alert-custom alert-success';
                    formMessage.innerHTML = '✅ Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    formMessage.style.display = 'block';
                }
                
                if (contactForm) contactForm.reset();
                
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Enviar Mensagem';
                }
                
                console.log('✅ Mensagem enviada com sucesso');
                
                setTimeout(function() {
                    if (formMessage) formMessage.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }

    // ==========================================
    // 12. VALIDAÇÃO DE FORMULÁRIOS (geral)
    // ==========================================

    document.querySelectorAll('form[novalidate]').forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('is-invalid');
                    isValid = false;
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            if (!isValid) {
                e.preventDefault();
                const firstInvalid = this.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                console.warn('⚠️ Formulário inválido');
            }
        });
    });

    // ==========================================
    // 13. ANIMAÇÃO DO HAMBURGUER (opcional)
    // ==========================================

    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) {
        toggler.addEventListener('click', function() {
            const isOpen = this.classList.contains('collapsed') === false;
            if (isOpen) {
                this.classList.add('hamburger-animated');
                setTimeout(() => {
                    this.classList.remove('hamburger-animated');
                }, 400);
            }
        });
    }

    console.log('✅ FuturoLab - Site carregado com sucesso!');
    console.log('🚀 Versão: 2.0.0');
});