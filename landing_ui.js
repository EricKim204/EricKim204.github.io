// Smooth scroll for anchor links
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

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-gray-600', 'border-gray-900');
        link.classList.add('border-transparent');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-gray-600', 'border-gray-900');
            link.classList.remove('border-transparent');
        }
    });
});

// Sidebar collapse/expand functionality
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('main-content');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarBrand = document.getElementById('sidebar-brand');
const toggleIcon = document.getElementById('toggle-icon');

// Check localStorage for saved state
let isExpanded = localStorage.getItem('sidebarExpanded') === 'true';

function updateSidebarState() {
    if (isExpanded) {
        // Expanded state
        sidebar.classList.remove('w-16');
        sidebar.classList.add('w-64');
        sidebar.classList.remove('px-3');
        sidebar.classList.add('px-6');
        mainContent.classList.remove('ml-16');
        mainContent.classList.add('ml-64');
        
        // Show brand
        sidebarBrand.classList.remove('opacity-0', 'w-0');
        sidebarBrand.classList.add('opacity-100', 'w-auto');
        
        // Update toggle icon to show collapse (X)
        toggleIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    } else {
        // Collapsed state
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-16');
        sidebar.classList.remove('px-6');
        sidebar.classList.add('px-3');
        mainContent.classList.remove('ml-64');
        mainContent.classList.add('ml-16');
        
        // Hide brand
        sidebarBrand.classList.remove('opacity-100', 'w-auto');
        sidebarBrand.classList.add('opacity-0', 'w-0');
        
        // Update toggle icon to show expand (hamburger)
        toggleIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    }
    
    // Save state to localStorage
    localStorage.setItem('sidebarExpanded', isExpanded);
}

// Initialize sidebar state
updateSidebarState();

// Toggle sidebar on button click
sidebarToggle.addEventListener('click', () => {
    isExpanded = !isExpanded;
    updateSidebarState();
});

// Optional: Collapse sidebar on mobile by default
if (window.innerWidth < 768) {
    isExpanded = false;
    updateSidebarState();
}