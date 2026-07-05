/* =========
   MOTOR SERVICE — MAIN JAVASCRIPT (all pages)
   Bootstrap handles the offcanvas sidebar — no sidebar JS needed.
   Guards (if el exists) keep every block safe on pages that
   don't have that element.
   ========= */

$(function () {

    /*  AOS INIT (all pages)  */
    AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true
    });

    /*  MOBILE SIDEBAR — link click করলে navigate হবে  */
document.querySelectorAll('#mobileNavList .mobile-nav-list__link').forEach(function (link) {
    link.addEventListener('click', function () {
        const sidebar = document.getElementById('mobileSidebar');
        const instance = bootstrap.Offcanvas.getInstance(sidebar);
        if (instance) instance.hide();
    });
});

    /*  FOOTER YEAR (all pages)  */
    var yearEl = document.getElementById('footerYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /*  HERO CAROUSEL — FADE + SWIPE (homepage only)  */
    const heroCarouselEl = document.getElementById('heroCarousel');
    if (heroCarouselEl) {
        heroCarouselEl.classList.add('carousel-fade');
        new bootstrap.Carousel(heroCarouselEl, {
            interval: 4000,
            pause: 'hover',
            touch: true,
            ride: 'carousel'
        });
    }

    /*  STAT COUNTERS (process + service-area cards)  */
    function runCounters(scopeEl) {
        const counters = scopeEl.querySelectorAll('[data-count-to]');
        const duration = 1800;
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

    function observeCounters(el) {
        if (!el) return;
        if ('IntersectionObserver' in window) {
            const obs = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        runCounters(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            obs.observe(el);
        } else {
            runCounters(el);
        }
    }

    observeCounters(document.getElementById('processStatsCard'));
    observeCounters(document.getElementById('areaTrustGrid'));

});