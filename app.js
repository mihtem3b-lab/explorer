/**
 * Explorer - Modern Blog Navigation & Content Management
 * Features: Navigation, Search, Filtering, Pagination, Newsletter
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const STATE = {
    currentPage: 1,
    itemsPerPage: 3,
    currentFilter: 'all',
    searchQuery: '',
    allCards: [],
    filteredCards: []
};

// ============================================
// DOM ELEMENTS
// ============================================

const DOM = {
    burger: document.querySelector('.burger'),
    menu: document.querySelector('.menu'),
    header: document.querySelector('.header'),
    searchInput: document.getElementById('searchInput'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    contentGrid: document.getElementById('contentGrid'),
    paginationBtns: { prev: document.getElementById('prevBtn'), next: document.getElementById('nextBtn') },
    pageInfo: document.getElementById('pageInfo'),
    noResults: document.getElementById('noResults')
};

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation styles
if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// NAVIGATION FUNCTIONS
// ============================================

/**
 * Toggle navigation menu open/closed
 */
function toggleMenu() {
    if (!DOM.menu || !DOM.burger) return;
    
    const isOpen = DOM.menu.classList.toggle('open');
    DOM.burger.classList.toggle('active');
    DOM.burger.setAttribute('aria-expanded', isOpen);
}

/**
 * Close navigation menu
 */
function closeMenu() {
    if (!DOM.menu || !DOM.burger) return;
    DOM.menu.classList.remove('open');
    DOM.burger.classList.remove('active');
    DOM.burger.setAttribute('aria-expanded', 'false');
}

/**
 * Handle header scroll behavior (sticky header)
 */
function handleScroll() {
    document.body.classList.toggle('scrolled', window.scrollY > 10);
}

// ============================================
// SEARCH & FILTER FUNCTIONS
// ============================================

/**
 * Filter cards based on category and search query
 */
function filterCards() {
    STATE.filteredCards = STATE.allCards.filter(card => {
        const matchesCategory = STATE.currentFilter === 'all' || 
                               card.dataset.category === STATE.currentFilter;
        const text = card.textContent.toLowerCase();
        const matchesSearch = text.includes(STATE.searchQuery.toLowerCase());
        
        return matchesCategory && matchesSearch;
    });
    
    STATE.currentPage = 1;
    renderPagination();
    renderCards();
}

/**
 * Render filtered cards based on current page
 */
function renderCards() {
    if (!DOM.contentGrid) return;
    
    const start = (STATE.currentPage - 1) * STATE.itemsPerPage;
    const end = start + STATE.itemsPerPage;
    const cardsToShow = STATE.filteredCards.slice(start, end);
    
    // Hide all cards
    STATE.allCards.forEach(card => card.style.display = 'none');
    
    // Show paginated cards with animation
    cardsToShow.forEach((card, index) => {
        card.style.display = '';
        card.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
    });
    
    // Show/hide no results message
    if (DOM.noResults) {
        DOM.noResults.hidden = STATE.filteredCards.length > 0;
    }
}

/**
 * Update pagination controls
 */
function renderPagination() {
    const totalPages = Math.ceil(STATE.filteredCards.length / STATE.itemsPerPage);
    
    if (DOM.paginationBtns.prev) {
        DOM.paginationBtns.prev.disabled = STATE.currentPage === 1;
    }
    
    if (DOM.paginationBtns.next) {
        DOM.paginationBtns.next.disabled = STATE.currentPage >= totalPages;
    }
    
    if (DOM.pageInfo) {
        DOM.pageInfo.textContent = `Page ${STATE.currentPage}`;
    }
}

/**
 * Handle pagination button clicks
 */
function handlePagination(direction) {
    const totalPages = Math.ceil(STATE.filteredCards.length / STATE.itemsPerPage);
    
    if (direction === 'prev' && STATE.currentPage > 1) {
        STATE.currentPage--;
    } else if (direction === 'next' && STATE.currentPage < totalPages) {
        STATE.currentPage++;
    }
    
    renderPagination();
    renderCards();
    
    // Scroll to content
    if (DOM.contentGrid) {
        DOM.contentGrid.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// NEWSLETTER SUBSCRIPTION
// ============================================

/**
 * Handle newsletter form submission
 */
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    
    if (!email) {
        showToast('Please enter your email', 'error');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        form.reset();
        showToast(`✓ Thanks for subscribing! Check ${email} for confirmation.`, 'success');
    }, 500);
}

// ============================================
// EVENT LISTENERS - INITIALIZATION
// ============================================

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Navigation
    if (DOM.burger) {
        DOM.burger.addEventListener('click', handleBurgerClick);
    }
    
    document.addEventListener('click', handleDocumentClick);
    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('scroll', handleScroll);
    
    // Search & Filter
    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', handleSearchInput);
    }
    
    if (DOM.filterButtons.length > 0) {
        DOM.filterButtons.forEach(btn => {
            btn.addEventListener('click', handleFilterClick);
        });
    }
    
    // Pagination
    if (DOM.paginationBtns.prev) {
        DOM.paginationBtns.prev.addEventListener('click', () => handlePagination('prev'));
    }
    
    if (DOM.paginationBtns.next) {
        DOM.paginationBtns.next.addEventListener('click', () => handlePagination('next'));
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', handleAnchorClick);
    });
}

// ============================================
// EVENT HANDLERS
// ============================================

function handleBurgerClick(event) {
    event.stopPropagation();
    toggleMenu();
}

function handleDocumentClick(event) {
    if (DOM.header && !DOM.header.contains(event.target)) {
        closeMenu();
    }
}

function handleWindowResize() {
    if (window.innerWidth > 880) {
        closeMenu();
    }
}

function handleSearchInput(event) {
    STATE.searchQuery = event.target.value;
    filterCards();
}

function handleFilterClick(event) {
    const btn = event.target;
    if (!btn.classList.contains('filter-btn')) return;
    
    // Update active state
    DOM.filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
    });
    
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    
    STATE.currentFilter = btn.dataset.filter;
    filterCards();
}

function handleAnchorClick(event) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || !targetId) return;
    
    event.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
    closeMenu();
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the app
 */
function initialize() {
    try {
        // Get all project cards
        STATE.allCards = Array.from(document.querySelectorAll('.project-card'));
        STATE.filteredCards = [...STATE.allCards];
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Initial render
        renderPagination();
        renderCards();
        
        console.log('✨ Explorer app initialized successfully');
    } catch (error) {
        console.error('Error initializing Explorer app:', error);
    }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}