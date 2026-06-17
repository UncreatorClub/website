// Smooth scroll implementation or interaction effects
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            targetEl.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Simple scroll observer for nav shadow
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (!nav) return;
    if (window.scrollY > 20) {
        nav.classList.add('shadow-xl', 'bg-background');
        nav.classList.remove('bg-background/80');
    } else {
        nav.classList.remove('shadow-xl', 'bg-background');
        nav.classList.add('bg-background/80');
    }
});
