const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');

toggle?.addEventListener('click', () => menu.classList.toggle('active'));

document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('active'));
});

/* NAVBAR SHADOW ON SCROLL */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 50 ? '0 2px 12px rgba(0,0,0,0.06)' : 'none';
});

/* SCROLL PROGRESS BAR */
const progressBar = document.querySelector('.scroll-progress');
const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollable) * 100;
    if (progressBar) progressBar.style.width = scrolled + '%';
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* CURSOR GLOW FOLLOWING MOUSE */
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let active = false;

    document.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        if (!active) {
            cursorGlow.classList.add('active');
            active = true;
        }
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.classList.remove('active');
        active = false;
    });

    const animateGlow = () => {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;
        cursorGlow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateGlow);
    };
    animateGlow();
}

/* MAGNETIC BUTTONS */
document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
    });
});

/* STAT COUNTER ANIMATION */
const animateCounter = (element, target, duration = 1600, suffix = '') => {
    const start = 0;
    const startTime = performance.now();
    const step = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(start + (target - start) * eased);
        element.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else element.textContent = target + suffix;
    };
    requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const raw = el.dataset.count;
            if (raw) {
                const target = parseInt(raw, 10);
                const suffix = el.dataset.suffix || '';
                animateCounter(el, target, 1600, suffix);
            }
            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(.*)$/);
    if (match) {
        el.dataset.count = match[1];
        el.dataset.suffix = match[2];
        el.textContent = '0' + match[2];
        statsObserver.observe(el);
    }
});

/* REVEAL ON SCROLL */
const revealElements = document.querySelectorAll('.section-header, .about-text, .about-card, .timeline-item, .skill-card, .lang-item, .contact-action, .contact-pill, .contact-lead, .testimonial, .google-badge');
revealElements.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 60);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* SKILL CARD TILT */
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/* HERO TITLE SPLIT ANIMATION */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.innerHTML;
    if (!heroTitle.dataset.split) {
        const split = text.replace(/(\S+)/g, '<span class="word"><span class="word-inner">$1</span></span>');
        heroTitle.innerHTML = split;
        heroTitle.dataset.split = '1';

        const style = document.createElement('style');
        style.textContent = `
            .hero-title .word { display: inline-block; }
            .hero-title .word-inner {
                display: inline-block;
                opacity: 0;
                transform: translateY(40%);
                animation: reveal-up 1s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
            }
            .hero-title .word:nth-child(1) .word-inner { animation-delay: 0.1s; }
            .hero-title .word:nth-child(2) .word-inner { animation-delay: 0.3s; }
            @keyframes reveal-up {
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
}
