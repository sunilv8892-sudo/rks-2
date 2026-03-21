// ========== PARTICLE SYSTEM ==========
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = `hsla(${Math.random() * 60 + 40}, 100%, 50%, 0.8)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// ========== TRAIL SYSTEM ==========
class Trail {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.age = 0;
        this.maxAge = 30;
        this.size = 8;
    }

    update() {
        this.age++;
    }

    draw(ctx) {
        ctx.globalAlpha = 1 - (this.age / this.maxAge);
        ctx.fillStyle = `rgba(255, 215, 0, 0.6)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (1 - this.age / this.maxAge), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

let particles = [];
let trails = [];

// Create canvas for particle effects
function createParticleCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    document.body.appendChild(canvas);
    return canvas;
}

const particleCanvas = createParticleCanvas();
const ctx = particleCanvas.getContext('2d');

window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
});

// Animate particles and trails
function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles = particles.filter(p => p.life > 0);
    trails = trails.filter(t => t.age < t.maxAge);
    
    particles.forEach(p => {
        p.update();
        p.draw(ctx);
    });
    
    trails.forEach(t => {
        t.update();
        t.draw(ctx);
    });
    
    if (particles.length > 0 || trails.length > 0) {
        requestAnimationFrame(animateParticles);
    }
}

document.addEventListener('click', (e) => {
    if (e.target.matches('.btn')) {
        for (let i = 0; i < 35; i++) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
        animateParticles();
    }
});

// Mouse trail effect
let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime > 20) {
        trails.push(new Trail(e.clientX, e.clientY));
        lastTrailTime = now;
        animateParticles();
    }
});

// ========== ADVANCED SCROLL ANIMATIONS ==========
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Observe all elements for scroll reveal
document.querySelectorAll('section, .service-card, .gallery-item, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    scrollObserver.observe(el);
});

// ========== FLOATING ICONS ==========
function createFloatingIcons() {
    const icons = ['✨', '🎾', '⭐', '💫', '🏆'];
    const container = document.createElement('div');
    container.id = 'floating-icons';
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '5';
    document.body.appendChild(container);
    
    icons.forEach((icon, index) => {
        const el = document.createElement('div');
        el.textContent = icon;
        el.style.position = 'absolute';
        el.style.fontSize = '2rem';
        el.style.opacity = '0.6';
        el.style.left = Math.random() * window.innerWidth + 'px';
        el.style.top = Math.random() * window.innerHeight + 'px';
        el.style.animation = `floatingShapes ${8 + index * 2}s ease-in-out infinite`;
        el.style.animationDelay = index * 1 + 's';
        container.appendChild(el);
    });
}

createFloatingIcons();

// ========== RANDOM FLOATING PARTICLES ON SCROLL ==========
let lastParticleSpawn = 0;
window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastParticleSpawn > 100) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        if (Math.random() > 0.7) {
            particles.push(new Particle(x, y));
            animateParticles();
        }
        lastParticleSpawn = now;
    }
}, { passive: true });

// ========== SMOOTH SCROLL NAVIGATION ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== ADVANCED OBSERVER ==========
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                entry.target.classList.add('animated');
            }, index * 50);
        }
    });
}, observerOptions);

// Observe all dynamic elements
document.querySelectorAll('.service-card, .gallery-item, .testimonial-card, .feature-item, .stat').forEach(el => {
    observer.observe(el);
});

// ========== NAVBAR INTELLIGENCE ==========
const navbar = document.querySelector('.navbar');
if (navbar) {
    navbar.style.background = 'rgba(10, 24, 15, 0.12)';
    navbar.style.backdropFilter = 'blur(10px)';
    navbar.style.boxShadow = 'none';
}

// ========== HERO REVEAL ON USER ACTION ==========
const revealHero = () => {
    document.body.classList.add('hero-revealed');
};

['pointermove', 'mousemove', 'click', 'scroll', 'touchstart', 'keydown'].forEach((eventName) => {
    window.addEventListener(eventName, revealHero, { passive: true, once: true });
});

// ========== MOBILE VIDEO DEFER + PLAY BUTTON ==========
const heroVideo = document.querySelector('.hero-video');
const heroPoster = document.querySelector('.hero-poster');
const playBtn = document.querySelector('.hero-play');

const mobileQuery = window.matchMedia('(max-width: 768px)');
function setupMobileVideo() {
    if (mobileQuery.matches) {
        if (heroVideo) {
            try { heroVideo.pause(); } catch (e) {}
            heroVideo.preload = 'metadata';
            heroVideo.style.display = 'none';
        }
        if (heroPoster) heroPoster.style.display = 'flex';
    } else {
        if (heroVideo) {
            heroVideo.preload = 'auto';
            heroVideo.style.display = 'block';
        }
        if (heroPoster) heroPoster.style.display = 'none';
    }
}
setupMobileVideo();
if (mobileQuery.addEventListener) mobileQuery.addEventListener('change', setupMobileVideo);
else mobileQuery.addListener(setupMobileVideo);

if (playBtn) {
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        revealHero();
        if (heroPoster) heroPoster.style.display = 'none';
        if (heroVideo) {
            heroVideo.style.display = 'block';
            const p = heroVideo.play();
            if (p && p.catch) p.catch(() => {});
        }
    });
}

// ========== ADVANCED 3D CARD EFFECTS ==========
document.querySelectorAll('.service-card, .testimonial-card, .feature-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;
        card.style.boxShadow = `${-rotateY * 10}px ${-rotateX * 10}px 50px rgba(255, 215, 0, 0.2)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
    });
});

// ========== MORPHING BUTTONS ==========
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.animation = 'magneticPull 0.6s ease-out infinite';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.animation = 'none';
    });

    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        ripple.style.animation = 'rippleAnimation 0.6s ease-out';
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        pointer-events: none;
    }
    
    @keyframes rippleAnimation {
        to {
            transform: scale(5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(dynamicStyle);

// ========== ADVANCED SECTION REVEALS ==========
document.querySelectorAll('section').forEach((section, idx) => {
    section.style.position = 'relative';
    section.setAttribute('data-section', idx);
});

// ========== HERO SECTION EFFECTS ==========
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    heroTitle.style.animation = 'slideInRight 0.8s ease-out';
}

// ========== SHAPE MORPHING ==========
const shapes = document.querySelectorAll('.shape');
shapes.forEach((shape, index) => {
    const randomDuration = 6 + Math.random() * 4;
    shape.style.animationDuration = `${randomDuration}s`;
    
    if (index === 0) {
        shape.style.animation = 'smoothFloat 8s ease-in-out infinite';
    } else if (index === 1) {
        shape.style.animation = 'liquidSwirl 7s ease-in-out infinite';
    } else {
        shape.style.animation = 'morphShape 9s ease-in-out infinite';
    }
});

// ========== MAGNETIC CURSOR EFFECT ==========
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    document.querySelectorAll('.service-card, .testimonial-card, .gallery-item, .stat').forEach(el => {
        const rect = el.getBoundingClientRect();
        const elementX = rect.left + rect.width / 2;
        const elementY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(Math.pow(mouseX - elementX, 2) + Math.pow(mouseY - elementY, 2));
        const maxDistance = 500;
        
        if (distance < maxDistance) {
            const intensity = (1 - distance / maxDistance);
            const intensity2 = intensity * intensity;
            
            // Pull effect toward mouse
            const dx = (elementX - mouseX) * intensity * 0.08;
            const dy = (elementY - mouseY) * intensity * 0.08;
            
            el.style.transform = `translateX(${dx}px) translateY(${dy}px) scale(${1 + intensity * 0.08})`;
            el.style.boxShadow = `0 0 ${50 * intensity2}px rgba(255, 215, 0, ${0.5 * intensity2}),
                                  inset 0 0 ${30 * intensity2}px rgba(255, 215, 0, ${0.2 * intensity2}),
                                  ${dx}px ${dy}px 40px rgba(255, 215, 0, ${0.3 * intensity})`;
            
            // Enhanced glow
            el.style.filter = `brightness(${1 + intensity * 0.2}) saturate(${1 + intensity * 0.3}) drop-shadow(0 0 ${20 * intensity}px rgba(255, 215, 0, 0.6))`;
        } else {
            el.style.transform = '';
            el.style.boxShadow = '';
            el.style.filter = '';
        }
    });
});

// ========== CONTACT FORM DYNAMICS ==========
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.animation = 'heartbeat 0.6s ease-out';
            this.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.style.animation = 'none';
            this.style.transform = 'scale(1)';
        });
        
        input.addEventListener('input', function() {
            this.style.borderBottom = `3px solid rgba(255, 215, 0, 0.6)`;
            this.style.boxShadow = `0 5px 20px rgba(255, 215, 0, 0.1)`;
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const button = contactForm.querySelector('button');
        const originalText = button.textContent;
        
        button.style.animation = 'pulse 0.5s ease-out';
        button.textContent = '✓ Sending...';
        
        setTimeout(() => {
            button.textContent = '✓✓ Message Sent!';
            button.style.background = '#4CAF50';
            button.style.animation = 'zoomBounce 0.8s ease-out';
        }, 800);
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            button.style.animation = 'none';
            contactForm.reset();
        }, 2500);
    });
}

// ========== ADVANCED COUNTER ANIMATION ==========
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2500;
    const start = Date.now();
    let hasAnimated = false;
    
    const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(target * easeOut);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else if (!hasAnimated) {
            element.textContent = target;
            element.style.animation = 'heartbeat 0.6s ease-out';
            hasAnimated = true;
        }
    };
    
    animate();
}

const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statsNumbers = entry.target.querySelectorAll('.stat h3');
            statsNumbers.forEach((stat, idx) => {
                if (!stat.dataset.animated) {
                    setTimeout(() => {
                        animateCounter(stat);
                        stat.style.animation = 'neonGlow 2s ease-in-out infinite';
                    }, idx * 200);
                    stat.dataset.animated = 'true';
                }
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statObserver.observe(statsSection);
}

// ========== HAMBURGER MENU ==========
const hamburger = document.querySelector('.hamburger');
if (hamburger) {
    hamburger.addEventListener('click', function() {
        const navLinks = document.querySelector('.nav-links');
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            navLinks.style.display = 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '60px';
            navLinks.style.flexDirection = 'column';
            navLinks.style.gap = '1rem';
            navLinks.style.padding = '2rem';
            navLinks.style.background = 'rgba(26, 71, 42, 0.98)';
            navLinks.style.borderRadius = '0 0 15px 15px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.backdropFilter = 'blur(20px)';
            navLinks.style.animation = 'slideDownFade 0.4s ease-out';
        } else {
            navLinks.style.animation = 'slideInComplete 0.4s ease-in reverse';
            setTimeout(() => {
                navLinks.style.display = 'none';
            }, 400);
        }
    });
}

// ========== SCROLL PARALLAX ADVANCED ==========
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    document.querySelectorAll('.shape').forEach((shape, i) => {
        shape.style.transform = `translateY(${scrollY * (0.3 + i * 0.2)}px)`;
    });
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrollY < window.innerHeight) {
        heroContent.style.opacity = Math.max(0, 1 - scrollY / window.innerHeight);
    }
}, { passive: true });

// ========== ANIMATION STAGGER ==========
document.addEventListener('DOMContentLoaded', () => {
    let delay = 0;
    document.querySelectorAll('.service-card, .gallery-item, .testimonial-card').forEach((elem) => {
        elem.style.animationDelay = `${delay * 0.08}s`;
        delay++;
    });
    
    // Animate gallery items on scroll
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'scaleIn 0.6s ease-out forwards';
                galleryObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    galleryItems.forEach(item => galleryObserver.observe(item));
});

// ========== PARTICLE ANIMATION LOOP ==========
function updateParticles() {
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => p.update());
    
    if (particles.length > 0) {
        requestAnimationFrame(updateParticles);
    }
}

// Start particle animation
updateParticles();

// ========== NEON GLOW EFFECT ON HOVER ==========
document.querySelectorAll('.section-title').forEach(title => {
    title.addEventListener('mouseenter', function() {
        this.style.animation = 'neonGlow 1.5s ease-in-out infinite';
    });
    
    title.addEventListener('mouseleave', function() {
        this.style.animation = 'none';
    });
});

// ========== DYNAMIC BACKGROUND ANIMATION ==========
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.body.style.backgroundPosition = `${scrollPercent}% 0%`;
}, { passive: true });

console.log('Garden Tennis Club - Video-led landing page loaded.');
