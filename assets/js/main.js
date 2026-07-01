document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       MOBILE SIDEBAR TOGGLE
       ============================================================ */
    var menuBtn = document.getElementById('mobile-menu-btn');
    var closeBtn = document.getElementById('sidebar-close-btn');
    var sidebar = document.getElementById('mobile-sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    var body = document.body;

    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        body.classList.add('sidebar-open');
        menuBtn.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('sidebar-open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', openSidebar);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar with ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    /* ============================================================
       SLIDING NAV PILL INDICATOR
       ============================================================ */
    var navLinksList = document.getElementById('nav-links');
    var pillIndicator = document.getElementById('nav-pill-indicator');

    if (navLinksList && pillIndicator) {
        var navLinkEls = navLinksList.querySelectorAll('.nav-link');
        var activeLinkEl = navLinksList.querySelector('.nav-link.active') || navLinkEls[0];

        function movePillTo(linkEl, scaled) {
            if (!linkEl) return;
            var scaleValue = scaled ? 1.1 : 1;
            pillIndicator.style.width = linkEl.offsetWidth + 'px';
            pillIndicator.style.transform =
                'translateX(' + linkEl.offsetLeft + 'px) scale(' + scaleValue + ')';
        }

        // Position the pill under the active link on load (no animation on first paint)
        pillIndicator.style.transition = 'none';
        movePillTo(activeLinkEl, true);
        // Re-enable smooth transition for subsequent hovers
        requestAnimationFrame(function () {
            pillIndicator.style.transition = '';
        });

        navLinkEls.forEach(function (link) {
            link.addEventListener('mouseenter', function () {
                movePillTo(link, true);
            });
        });

        navLinksList.addEventListener('mouseleave', function () {
            movePillTo(activeLinkEl, true);
        });

        // Keep the pill aligned correctly if the window is resized
        window.addEventListener('resize', function () {
            pillIndicator.style.transition = 'none';
            movePillTo(navLinksList.querySelector('.nav-link:hover') || activeLinkEl, true);
            requestAnimationFrame(function () {
                pillIndicator.style.transition = '';
            });
        });
    }

    /* ============================================================
       DAY / NIGHT MODE TOGGLE
       ============================================================ */
    var htmlEl = document.documentElement;
    var themeBtnDesktop = document.getElementById('theme-toggle-btn');
    var themeBtnMobile = document.getElementById('theme-toggle-btn-mobile');

    function applyTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('motorservice-theme', theme);
    }

    function toggleTheme() {
        var current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    }

    // Load saved theme, or fall back to system preference
    var savedTheme = localStorage.getItem('motorservice-theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    }

    if (themeBtnDesktop) {
        themeBtnDesktop.addEventListener('click', toggleTheme);
    }
    if (themeBtnMobile) {
        themeBtnMobile.addEventListener('click', toggleTheme);
    }

});