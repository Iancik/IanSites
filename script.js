// IanSites - Modern Portfolio Landing Page
// JavaScript pentru interactivitate și animații

document.addEventListener('DOMContentLoaded', function() {
    // Ascunde elementele cu typing effect din start pentru a preveni flash-ul
    const typingElements = document.querySelectorAll('.typing-effect');
    typingElements.forEach(element => {
        element.style.opacity = '0';
    });
    
    // Variabile globale
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const contactForm = document.querySelector('.contact-form');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading';
    loadingScreen.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loadingScreen);
    
    // Ascunde loading screen-ul după 1.5 secunde
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 1500);

    // Smooth scrolling pentru linkurile de navigare
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Închide meniul mobil dacă este deschis
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adaugă clasa 'scrolled' când utilizatorul face scroll
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Activează link-ul corespunzător secțiunii vizibile
        updateActiveNavLink();
        
        lastScrollTop = scrollTop;
    });

    // Actualizează link-ul activ din navigare
    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 50;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Toggle meniul mobil
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Închide meniul mobil când se face click pe un link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Închide meniul mobil când se face click în afara lui
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // Animații la scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll', 'animated');
            }
        });
    }, observerOptions);

    // Observă elementele pentru animații
    const animatedElements = document.querySelectorAll('.portfolio-item, .contact-item, .stat, .skill-circle');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Animație pentru numerele din secțiunea About
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (stat.textContent.includes('%')) {
                    stat.textContent = Math.floor(current) + '%';
                } else if (stat.textContent.includes('+')) {
                    stat.textContent = Math.floor(current) + '+';
                } else if (stat.textContent.includes('/')) {
                    stat.textContent = '24/7';
                }
            }, 30);
        });
    }

    // Activează animația pentru numere când secțiunea About devine vizibilă
    const aboutSection = document.querySelector('#about');
    const aboutObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }

    // Efect parallax pentru hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-card');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Formular de contact
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Colectează datele din formular
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Validare simplă
            if (!name || !email || !subject || !message) {
                showNotification('Vă rugăm să completați toate câmpurile!', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Vă rugăm să introduceți un email valid!', 'error');
                return;
            }
            
            // Simulează trimiterea mesajului
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Se trimite...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Mesajul a fost trimis cu succes! Vă voi contacta în curând.', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Validare email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Sistem de notificări
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Stiluri pentru notificare
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Animație de intrare
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Buton de închidere
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        // Auto-remove după 5 secunde
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);
    }

    function removeNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Efecte hover pentru portfolio items
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Typing effect pentru titlul principal
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // După ce se termină de scris, restituie formatarea originală
                setTimeout(() => {
                    element.innerHTML = text;
                }, 500);
            }
        }
        
        type();
    }

    // Typing effect îmbunătățit cu păstrarea formatării
    function advancedTypeWriter(element, speed = 100) {
        const originalHTML = element.innerHTML;
        
        // Extrage doar textul fără taguri HTML pentru typing effect
        const textContent = element.textContent;
        
        // Salvează dimensiunile originale
        const originalHeight = element.offsetHeight;
        const originalWidth = element.offsetWidth;
        
        // Fixează dimensiunile pentru a preveni schimbarea poziției
        element.style.minHeight = originalHeight + 'px';
        element.style.minWidth = originalWidth + 'px';
        element.style.display = 'block';
        
        // Ascunde elementul inițial
        element.style.opacity = '0';
        element.innerHTML = '';
        
        setTimeout(() => {
            element.style.opacity = '1';
            
            let i = 0;
            function type() {
                if (i < textContent.length) {
                    element.innerHTML += textContent.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    // După ce se termină de scris, restituie formatarea originală cu animație
                    setTimeout(() => {
                        element.style.transition = 'all 0.5s ease';
                        element.innerHTML = originalHTML;
                        element.style.opacity = '1';
                        
                        // Adaugă un efect de "flash" pentru a arăta că s-a terminat
                        element.style.transform = 'scale(1.05)';
                        setTimeout(() => {
                            element.style.transform = 'scale(1)';
                            
                            // Restaurează stilurile originale
                            setTimeout(() => {
                                element.style.minHeight = '';
                                element.style.minWidth = '';
                            }, 500);
                        }, 200);
                    }, 800);
                }
            }
            type();
        }, 500);
    }

    // Typing effect cu cursor care clipăiește
    function typeWriterWithCursor(element, speed = 100) {
        const originalHTML = element.innerHTML;
        const textContent = element.textContent;
        
        // Salvează stilurile originale
        const originalHeight = element.offsetHeight;
        const originalWidth = element.offsetWidth;
        
        // Fixează dimensiunile elementului pentru a preveni schimbarea poziției
        element.style.minHeight = originalHeight + 'px';
        element.style.minWidth = originalWidth + 'px';
        element.style.display = 'block';
        element.style.marginBottom = '0'; // Elimină marginea de jos
        
        // Descrierea este mereu vizibilă, nu o gestionăm
        const nextElement = element.nextElementSibling;
        const parentElement = element.parentElement;
        
        // Elimină gap-ul din container în timpul typing-ului
        if (parentElement) {
            parentElement.style.gap = '0';
        }
        
        // Elementul este deja ascuns prin CSS, doar resetăm conținutul
        element.innerHTML = '';
        
        setTimeout(() => {
            element.style.opacity = '1';
            
            let i = 0;
            function type() {
                if (i < textContent.length) {
                    element.innerHTML = textContent.substring(0, i + 1) + '<span class="typing-cursor">|</span>';
                    i++;
                    setTimeout(type, speed);
                } else {
                    // Elimină cursorul și restituie formatarea
                    setTimeout(() => {
                        element.innerHTML = originalHTML;
                        element.style.opacity = '1';
                        
                        // Descrierea este mereu vizibilă, nu trebuie să o afișăm
                        
                        // Restaurează stilurile originale după ce s-a terminat
                        setTimeout(() => {
                            element.style.minHeight = '';
                            element.style.minWidth = '';
                            element.style.marginBottom = '';
                            
                            // Restaurează gap-ul din container
                            if (parentElement) {
                                parentElement.style.gap = '';
                            }
                        }, 1000);
                    }, 1000);
                }
            }
            type();
        }, 500);
    }

    // Activează typing effect-ul pentru hero title
    const heroTitle = document.querySelector('.hero-title');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroDescription = document.querySelector('.hero-description');
    
    if (heroTitle) {
        // Asigură-te că titlul este ascuns din start
        heroTitle.style.opacity = '0';
        
        // Afișează butoanele și descrierea imediat
        if (heroButtons) {
            heroButtons.style.opacity = '1';
        }
        if (heroDescription) {
            heroDescription.style.opacity = '1';
        }
        
        setTimeout(() => {
            typeWriterWithCursor(heroTitle, 40);
        }, 2000);
    }

    // Smooth reveal pentru elemente
    function revealElements() {
        const reveals = document.querySelectorAll('.animate-on-scroll');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('animated');
            }
        });
    }

    window.addEventListener('scroll', revealElements);
    revealElements(); // Verifică la încărcare

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Easter egg activat!
            document.body.style.animation = 'rainbow 2s infinite';
            showNotification('🎉 Easter egg activat! Felicitări pentru că ai găsit codul secret!', 'success');
            
            setTimeout(() => {
                document.body.style.animation = '';
            }, 10000);
            
            konamiCode = [];
        }
    });

    // CSS pentru animația rainbow (easter egg)
    const rainbowCSS = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = rainbowCSS;
    document.head.appendChild(style);

    // Performanță: Lazy loading pentru imagini
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Preload pentru performanță mai bună
    function preloadImages() {
        const images = [
            // Adaugă aici URL-urile imaginilor pe care vrei să le preload
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    preloadImages();

    console.log('🚀 IanSites portfolio loaded successfully!');
    console.log('💡 Tip: Încearcă codul Konami pentru un easter egg special!');
});

// Utilitare globale
window.IanSites = {
    // Funcție pentru actualizarea link-urilor GitHub
    updateGitHubLinks: function(site1, site2, site3) {
        const links = document.querySelectorAll('.portfolio-link');
        if (links.length >= 3) {
            if (site1) links[0].href = site1;
            if (site2) links[1].href = site2;
            if (site3) links[2].href = site3;
        }
    },
    
    // Funcție pentru actualizarea informațiilor de contact
    updateContactInfo: function(email, phone, location) {
        const contactItems = document.querySelectorAll('.contact-item p');
        if (contactItems.length >= 3) {
            if (email) contactItems[0].textContent = email;
            if (phone) contactItems[1].textContent = phone;
            if (location) contactItems[2].textContent = location;
        }
    },
    
    // Funcție pentru adăugarea unui nou proiect în portfolio
    addPortfolioItem: function(title, description, tech, githubLink) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        const newItem = document.createElement('div');
        newItem.className = 'portfolio-item';
        newItem.innerHTML = `
            <div class="portfolio-image">
                <div class="portfolio-placeholder">
                    <i class="fas fa-laptop-code"></i>
                </div>
                <div class="portfolio-overlay">
                    <a href="${githubLink}" class="portfolio-link" target="_blank">
                        <i class="fab fa-github"></i>
                        <span>GitHub</span>
                    </a>
                </div>
            </div>
            <div class="portfolio-content">
                <h3 class="portfolio-title">${title}</h3>
                <p class="portfolio-description">${description}</p>
                <div class="portfolio-tech">
                    ${tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
            </div>
        `;
        portfolioGrid.appendChild(newItem);
    },
    
    // Funcție pentru activarea typing effect-ului pe orice element
    startTypingEffect: function(selector, speed = 80, delay = 0) {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                typeWriterWithCursor(element, speed);
            }, delay);
        }
    },
    
    // Funcție pentru activarea typing effect-ului fără cursor
    startTypingEffectNoCursor: function(selector, speed = 80, delay = 0) {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                advancedTypeWriter(element, speed);
            }, delay);
        }
    }
};
