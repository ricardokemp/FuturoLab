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
