/**
 * Luxe Salon - Main JavaScript File
 * Handles interactions, animations, and functionality
 */

(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    /**
     * Initialize all application functionality
     */
    function initializeApp() {
        initNavbarScroll();
        initSmoothScroll();
        initGalleryFilters();
        initContactForm();
        initAnimations();
        setActiveNavLink();
        handleImageLoading();
    }

    /**
     * Navbar scroll effect - adds background and shadow on scroll
     */
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        
        if (navbar) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }

    /**
     * Smooth scrolling for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;
                
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, href);
                }
            });
        });
    }

    /**
     * Gallery filtering functionality
     */
    function initGalleryFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (filterButtons.length === 0 || galleryItems.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter gallery items
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.classList.remove('hidden');
                        // Add fade-in animation
                        item.style.animation = 'fadeInUp 0.5s ease-out';
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    /**
     * Contact form handling with Formspree integration
     */
    function initContactForm() {
        const bookingForm = document.getElementById('bookingForm');
        
        if (!bookingForm) return;
        
        bookingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Get form data
                const formData = new FormData(this);
                
                // NOTE: Replace 'your-formspree-id' with your actual Formspree endpoint
                // For demo purposes, we'll simulate a successful submission
                // In production, uncomment the fetch call and use your Formspree ID
                
                /*
                const response = await fetch('https://formspree.io/f/your-formspree-id', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    showFormSuccess(bookingForm);
                } else {
                    throw new Error('Form submission failed');
                }
                */
                
                // Simulate API call for demo
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Show success message
                showFormSuccess(bookingForm);
                
                // Reset form
                bookingForm.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                alert('There was an error submitting your request. Please try again or call us directly.');
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    /**
     * Show form success message
     */
    function showFormSuccess(form) {
        const successMessage = document.getElementById('formSuccess');
        
        if (successMessage) {
            successMessage.style.display = 'block';
            
            // Scroll to success message
            successMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Hide success message after 10 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 10000);
        }
    }

    /**
     * Initialize scroll-based animations
     */
    function initAnimations() {
        const animatedElements = document.querySelectorAll(
            '.feature-card, .service-card, .team-card, .value-card, .gallery-card'
        );
        
        if (animatedElements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Set active navigation link based on current page
     */
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === '/' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Handle image loading with lazy loading
     */
    function handleImageLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    /**
     * Mobile menu handling - close menu on link click
     */
    document.addEventListener('click', function(e) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        const navbarToggler = document.querySelector('.navbar-toggler');
        
        if (!navbarCollapse || !navbarToggler) return;
        
        // Check if menu is open and clicked element is a nav link
        if (navbarCollapse.classList.contains('show') && 
            (e.target.classList.contains('nav-link') || e.target.classList.contains('btn'))) {
            
            // Close the menu
            navbarToggler.click();
        }
    });

    /**
     * Add current year to footer copyright
     */
    function updateCopyrightYear() {
        const yearSpans = document.querySelectorAll('.current-year');
        const currentYear = new Date().getFullYear();
        
        yearSpans.forEach(span => {
            span.textContent = currentYear;
        });
    }

    // Update copyright year
    updateCopyrightYear();

    /**
     * Handle form date input - set min date to today
     */
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        
        dateInput.min = `${year}-${month}-${day}`;
        
        // Set max date to 3 months from now
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        const maxYear = maxDate.getFullYear();
        const maxMonth = String(maxDate.getMonth() + 1).padStart(2, '0');
        const maxDay = String(maxDate.getDate()).padStart(2, '0');
        
        dateInput.max = `${maxYear}-${maxMonth}-${maxDay}`;
    }

    /**
     * Phone number formatting
     */
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 3 && value.length < 7) {
                value = `(${value.slice(0,3)}) ${value.slice(3)}`;
            } else if (value.length >= 7) {
                value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
            }
            
            e.target.value = value;
        });
    }

    /**
     * Prevent form resubmission on page refresh
     */
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }

})();

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker for offline capabilities
        /*
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
        */
    });
}

// Performance monitoring
window.addEventListener('load', () => {
    // Report performance metrics
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        console.log(`Page loaded in ${loadTime}ms`);
    }
});