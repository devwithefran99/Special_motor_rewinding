/* =========================================================
   MOTOR SERVICE — MAIN JAVASCRIPT
   ========================================================= */

$(function () {

    /* ============ AOS INIT ============ */
    AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true
    });


    /* ============ DESKTOP NAV — SLIDING PILL INDICATOR ============ */
    const $navList = $('#mainNavList');
    const $navLinks = $navList.find('[data-nav-link]');
    const $navPill = $navList.find('.main-nav-list__pill');

    function movePillTo($link) {
        if (!$link.length) return;
        const linkEl = $link[0];
        $navPill.css({
            left: linkEl.offsetLeft + 'px',
            width: linkEl.offsetWidth + 'px'
        }).addClass('is-visible');
    }

    function resetPillToActive() {
        const $active = $navLinks.filter('.is-active');
        if ($active.length) {
            movePillTo($active);
        } else {
            $navPill.removeClass('is-visible');
        }
    }

    // Position pill on initial load (after fonts/layout settle)
    setTimeout(resetPillToActive, 100);

    $navLinks.on('mouseenter', function () {
        movePillTo($(this));
    });

    $navList.on('mouseleave', function () {
        resetPillToActive();
    });

    // Re-calculate pill position on resize (desktop only)
    let resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resetPillToActive, 150);
    });


    /* ============ MOBILE SIDEBAR TOGGLE ============ */
    const $body = $('body');
    const $sidebar = $('#mobileSidebar');
    const $overlay = $('#sidebarOverlay');
    const $toggleBtn = $('#navbarToggleBtn');
    const $closeBtn = $('#sidebarCloseBtn');

    function openSidebar() {
        $sidebar.addClass('is-open').attr('aria-hidden', 'false');
        $overlay.addClass('is-active');
        $toggleBtn.attr('aria-expanded', 'true');
        $body.css('overflow', 'hidden');
    }

    function closeSidebar() {
        $sidebar.removeClass('is-open').attr('aria-hidden', 'true');
        $overlay.removeClass('is-active');
        $toggleBtn.attr('aria-expanded', 'false');
        $body.css('overflow', '');
    }

    $toggleBtn.on('click', openSidebar);
    $closeBtn.on('click', closeSidebar);
    $overlay.on('click', closeSidebar);
    $sidebar.find('[data-nav-link]').on('click', closeSidebar);

    // Close sidebar on ESC key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && $sidebar.hasClass('is-open')) {
            closeSidebar();
        }
    });


    /* ============ HERO CAROUSEL — FADE + SWIPE CONFIG ============ */
    const heroCarouselEl = document.getElementById('heroCarousel');
    if (heroCarouselEl) {
        heroCarouselEl.classList.add('carousel-fade');
        new bootstrap.Carousel(heroCarouselEl, {
            interval: 5000,
            pause: 'hover',
            touch: true,
            ride: 'carousel'
        });
    }


      /* ============ PROCESS SECTION — SYNCED STAT COUNTERS ============ */
    const statsCard = document.getElementById('processStatsCard');
 
    function runStatsCounters() {
        const counters = statsCard.querySelectorAll('[data-count-to]');
        const duration = 1800; // all counters start + finish together
        const startTime = performance.now();
 
        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
 
            counters.forEach(function (counter) {
                const target = parseInt(counter.dataset.countTo, 10);
                counter.textContent = Math.floor(eased * target);
            });
 
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                counters.forEach(function (counter) {
                    counter.textContent = counter.dataset.countTo;
                });
            }
        }
 
        requestAnimationFrame(tick);
    }
 
    if (statsCard && 'IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    runStatsCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
 
        statsObserver.observe(statsCard);
    } else if (statsCard) {
        runStatsCounters();
    }
 
});