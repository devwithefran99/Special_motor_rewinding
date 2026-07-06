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
/*  FAQ ACCORDION (service detail pages) — single-open behaviour  */
    var faqToggles = document.querySelectorAll('[data-faq-toggle]');
    if (faqToggles.length) {
        faqToggles.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = btn.closest('.sd-faq-item');
                if (!item) return;
                var answer = item.querySelector('.sd-faq-item__a');
                var isOpen = item.classList.contains('is-open');

                // close all
                document.querySelectorAll('.sd-faq-item').forEach(function (other) {
                    other.classList.remove('is-open');
                    var a = other.querySelector('.sd-faq-item__a');
                    if (a) a.style.maxHeight = null;
                });

                // open clicked (if it wasn't already open)
                if (!isOpen) {
                    item.classList.add('is-open');
                    if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

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
     observeCounters(document.getElementById('statsBandInner'));   
    observeCounters(document.getElementById('storyBadge'));       

});

/*  TESTIMONIALS SLIDER (homepage) — step one card every 2.5s, all screens  */
    var $track = $('#tstTrack');
    if ($track.length) {
        var $cards = $track.children();
        $track.append($cards.clone());                     // clone once for seamless loop

        var pos = 0, paused = false, half = 0;

        function measure() {                               // width of ONE real set
            half = 0;
            $track.children().slice(0, $cards.length).each(function () {
                half += $(this).outerWidth() + parseFloat($(this).css('margin-right'));
            });
        }
        function step() {
            var $c = $track.children().first();
            return $c.outerWidth() + parseFloat($c.css('margin-right'));
        }

        // measure after images/fonts settle, and on resize
        $(window).on('load', measure);
        setTimeout(measure, 300);
        $(window).on('resize', measure);
        measure();

        function slide(dir) {                              // dir: -1 next, +1 prev
            pos += dir * step();

            // animate the move
            $track.css({ 'transition': 'transform 0.6s ease',
                         'transform': 'translateX(' + pos + 'px)' });

            // AFTER the animation ends, if we've passed one full set,
            // silently snap back with NO transition (invisible reset)
            setTimeout(function () {
                $track.css('transition', 'none');
                if (pos <= -half) pos += half;
                if (pos > 0)      pos -= half;
                $track.css('transform', 'translateX(' + pos + 'px)');
            }, 620);
        }

        setInterval(function () { if (!paused) slide(-1); }, 2500);

        $('#tstMarquee').on('mouseenter touchstart', function () { paused = true; })
                        .on('mouseleave touchend',  function () { paused = false; });

        $('#tstNext').on('click', function () { slide(-1); });
        $('#tstPrev').on('click', function () { slide(1); });
    }