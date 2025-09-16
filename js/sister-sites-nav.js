/**
 * Sister Sites Dynamic Navigation System
 * Renders navigation based on sister_sites_nav_config.json
 */

class SisterSitesNav {
    constructor() {
        this.config = null;
        this.currentSite = this.detectCurrentSite();
        this.isAdmin = this.checkAdminAccess();
    }

    async init() {
        try {
            await this.loadConfig();
            this.renderNavigation();
            this.setupDropdowns();
        } catch (error) {
            console.error('Failed to initialize sister sites navigation:', error);
            this.renderFallbackNav();
        }
    }

    async loadConfig() {
        const response = await fetch('/config/sister_sites_nav_config.json');
        if (!response.ok) {
            throw new Error(`Failed to load config: ${response.status}`);
        }
        this.config = await response.json();
    }

    detectCurrentSite() {
        const path = window.location.pathname;
        if (path.startsWith('/kingdom-konnect')) return 'kingdom-konnect';
        if (path.startsWith('/urban-build-crew')) return 'urban-build-crew';
        if (path.startsWith('/serene-comfort-care')) return 'serene-comfort-care';
        if (path.startsWith('/elevate-brain')) return 'elevate-brain';
        return 'elevate-for-humanity'; // Default/main site
    }

    checkAdminAccess() {
        // Check for admin authentication
        // This could be JWT token, session, IP check, etc.
        const adminToken = localStorage.getItem('admin_token');
        const isLocalhost = window.location.hostname === 'localhost';
        return adminToken || isLocalhost || this.hasAdminRole();
    }

    hasAdminRole() {
        // Check if user has admin role from your auth system
        // Placeholder - implement based on your auth system
        return false;
    }

    renderNavigation() {
        const navContainer = document.querySelector('.nav-links');
        if (!navContainer) return;

        // Clear existing navigation
        navContainer.innerHTML = '';

        // Add main site (Elevate for Humanity)
        const mainSiteLink = this.createNavLink('Elevate', '/', this.currentSite === 'elevate-for-humanity');
        navContainer.appendChild(mainSiteLink);

        // Add sister sites from config
        Object.entries(this.config).forEach(([siteKey, siteConfig]) => {
            // Skip private sites if user doesn't have admin access
            if (siteConfig.private && !this.isAdmin) {
                return;
            }

            const navItem = this.createNavDropdown(siteKey, siteConfig);
            navContainer.appendChild(navItem);
        });

        // Add CTA button
        const ctaButton = this.createCTAButton();
        navContainer.appendChild(ctaButton);
    }

    createNavLink(text, href, isActive = false) {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = text;
        link.className = `nav-tab ${isActive ? 'active' : ''}`;
        if (isActive) {
            link.style.color = '#22c55e';
        }
        return link;
    }

    createNavDropdown(siteKey, siteConfig) {
        const dropdown = document.createElement('div');
        dropdown.className = 'nav-dropdown';
        
        const isActive = this.currentSite === siteKey;
        
        dropdown.innerHTML = `
            <a href="${siteConfig.landing_url}" class="nav-tab dropdown-trigger ${isActive ? 'active' : ''}" 
               style="${isActive ? 'color: #22c55e;' : ''}">
                ${siteConfig.display_name}
                <span class="dropdown-arrow">▼</span>
            </a>
            <div class="dropdown-menu">
                <a href="${siteConfig.landing_url}" class="dropdown-item">
                    ${siteConfig.landing_title}
                </a>
                ${siteConfig.drop_down_pages.map(page => `
                    <a href="${siteConfig.landing_url}/${page}" class="dropdown-item">
                        ${this.formatPageName(page)}
                    </a>
                `).join('')}
            </div>
        `;

        return dropdown;
    }

    createCTAButton() {
        const cta = document.createElement('a');
        cta.href = '/apply';
        cta.textContent = 'Apply Now';
        cta.className = 'nav-cta';
        return cta;
    }

    formatPageName(page) {
        return page.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    setupDropdowns() {
        // Add dropdown functionality
        document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const menu = dropdown.querySelector('.dropdown-menu');

            trigger.addEventListener('mouseenter', () => {
                menu.style.display = 'block';
            });

            dropdown.addEventListener('mouseleave', () => {
                menu.style.display = 'none';
            });
        });
    }

    renderFallbackNav() {
        // Fallback navigation if config fails to load
        const navContainer = document.querySelector('.nav-links');
        if (!navContainer) return;

        navContainer.innerHTML = `
            <a href="/" class="nav-tab">Elevate</a>
            <a href="/healthcare-services.html" class="nav-tab">Healthcare</a>
            <a href="/connect.html" class="nav-tab">Community</a>
            <a href="/lms.html" class="nav-tab">Learning</a>
            <a href="/apply" class="nav-cta">Apply Now</a>
        `;
    }
}

// CSS for dropdown functionality
const dropdownCSS = `
    .nav-dropdown {
        position: relative;
        display: inline-block;
    }
    
    .dropdown-trigger {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .dropdown-arrow {
        font-size: 0.8rem;
        transition: transform 0.3s ease;
    }
    
    .nav-dropdown:hover .dropdown-arrow {
        transform: rotate(180deg);
    }
    
    .dropdown-menu {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        min-width: 200px;
        z-index: 1000;
        padding: 0.5rem 0;
        margin-top: 0.5rem;
    }
    
    .dropdown-item {
        display: block;
        padding: 0.75rem 1rem;
        color: #374151;
        text-decoration: none;
        transition: background-color 0.2s ease;
    }
    
    .dropdown-item:hover {
        background-color: #f3f4f6;
        color: #1e40af;
    }
    
    .nav-tab.active {
        color: #22c55e !important;
    }
    
    @media (max-width: 768px) {
        .dropdown-menu {
            position: static;
            display: block;
            box-shadow: none;
            background: rgba(255,255,255,0.1);
            margin: 0.5rem 0;
        }
        
        .nav-dropdown {
            display: block;
            width: 100%;
        }
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = dropdownCSS;
document.head.appendChild(style);

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const sisterSitesNav = new SisterSitesNav();
    sisterSitesNav.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SisterSitesNav;
}