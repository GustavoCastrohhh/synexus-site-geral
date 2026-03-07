/**
 * ui.js
 * Responsável por: navegação suave, menu mobile, scroll do header e animações de entrada.
 */

// Smooth scroll
function scrollToSection(id) {
    var element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('navMobile').classList.remove('active');
    }
}

// Mobile menu toggle
function toggleMenu() {
    document.getElementById('navMobile').classList.toggle('active');
}

// Header scroll effect
window.addEventListener('scroll', function () {
    var header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Intersection Observer — animate-on-scroll
(function () {
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
        observer.observe(el);
    });
})();
