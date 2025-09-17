// Elevate for Humanity - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
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
    
    // Form submission handling
    const forms = document.querySelectorAll('form[data-netlify]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
        });
    });
    
    // Funding eligibility form enhancement
    const fundingForm = document.querySelector('form[name="funding-eligibility"]');
    if (fundingForm) {
        fundingForm.addEventListener('submit', function(e) {
            // Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    form_name: 'funding_eligibility',
                    engagement_time_msec: Date.now()
                });
            }
            
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Lead', {
                    content_name: 'Funding Eligibility Check'
                });
            }
        });
    }
    
    // Contact form tracking
    const contactForm = document.querySelector('form[name="contact"]');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    form_name: 'contact',
                    engagement_time_msec: Date.now()
                });
            }
            
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact');
            }
        });
    }
    
    // Program card click tracking
    document.querySelectorAll('.program-card').forEach(card => {
        card.addEventListener('click', function() {
            const programName = this.querySelector('h3')?.textContent || 'Unknown';
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'program_interest', {
                    program_name: programName
                });
            }
        });
    });
    
    // CTA button tracking
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cta_click', {
                    button_text: buttonText,
                    page_location: window.location.href
                });
            }
        });
    });
    
    // Phone number click tracking
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    phone_number: this.getAttribute('href')
                });
            }
            
            if (typeof fbq !== 'undefined') {
                fbq('track', 'Contact', {
                    content_name: 'Phone Call'
                });
            }
        });
    });
    
    // Email click tracking
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    email_address: this.getAttribute('href')
                });
            }
        });
    });
    
    // Scroll tracking for engagement
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        maxScroll = Math.max(maxScroll, scrollPercent);
        
        // Track milestone scrolls
        if (scrollPercent >= 25 && !window.scroll25Tracked) {
            window.scroll25Tracked = true;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll', {
                    percent_scrolled: 25
                });
            }
        }
        
        if (scrollPercent >= 50 && !window.scroll50Tracked) {
            window.scroll50Tracked = true;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll', {
                    percent_scrolled: 50
                });
            }
        }
        
        if (scrollPercent >= 75 && !window.scroll75Tracked) {
            window.scroll75Tracked = true;
            if (typeof gtag !== 'undefined') {
                gtag('event', 'scroll', {
                    percent_scrolled: 75
                });
            }
        }
    });
    
    // Page exit tracking
    window.addEventListener('beforeunload', function() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_exit', {
                max_scroll_percent: maxScroll,
                time_on_page: Math.round((Date.now() - window.pageLoadTime) / 1000)
            });
        }
    });
    
    // Track page load time
    window.pageLoadTime = Date.now();
    
    // Success message display for forms
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showSuccessMessage();
    }
    
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <div class="success-content">
                <h3>Thank You!</h3>
                <p>We've received your information and will contact you within 24 hours.</p>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(message);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 5000);
    }
    
    // Lazy loading for images
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
});

// Utility functions
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
    }
    
    if (typeof fbq !== 'undefined') {
        fbq('trackCustom', eventName, parameters);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}