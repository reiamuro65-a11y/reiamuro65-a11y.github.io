let lenis;
let lenisRafId;
let lenisWheelBurstCount = 0;
let lenisLastWheelAt = 0;


 
 
 
function initLenis() {

    if (typeof Lenis === 'undefined') return;



    if (!lenis && window.innerWidth > 768) {
        lenisWheelBurstCount = 0;
        lenisLastWheelAt = 0;

        lenis = new Lenis({
            duration: 1.0,
            easing: t => 1 - Math.pow(1 - t, 4),
            infinite: false,
            gestureOrientation: "vertical",
            normalizeWheel: true,     
            wheelMultiplier:1.5,       
            smoothTouch: true,
            smoothWheel: true,
            virtualScroll: (data) => {
                const absY = Math.abs(data.deltaY);

                 
                if (absY <= 40) return;

                 
                const sign = Math.sign(data.deltaY);
                const extra = absY - 40;

                 
                data.deltaY = sign * (40 + extra * 0.6);
            }
        });

        lenis.options.virtualScroll = (data) => {
            if (!data.event || !data.event.type || data.event.type.indexOf('wheel') === -1) return;

            const absY = Math.abs(data.deltaY);
            const sign = Math.sign(data.deltaY) || 1;
            const now = Date.now();
            const wheelGap = now - lenisLastWheelAt;

            if (wheelGap < 120) {
                lenisWheelBurstCount = Math.min(lenisWheelBurstCount + 1, 6);
            } else {
                lenisWheelBurstCount = 0;
            }

            lenisLastWheelAt = now;

            if (absY <= 28) return;

            const baseDelta = 28;
            const overflow = absY - baseDelta;
            const overflowRatio = lenisWheelBurstCount >= 2 ? 0.08 : 0.18;
            const maxDelta = lenisWheelBurstCount >= 2 ? 46 : 60;
            const adjustedDelta = Math.min(baseDelta + overflow * overflowRatio, maxDelta);

            data.deltaY = sign * adjustedDelta;
        };

        function raf(time) {
            lenis.raf(time);
            lenisRafId = requestAnimationFrame(raf);
        }

        lenisRafId = requestAnimationFrame(raf);
    }


    // if (!lenis && window.innerWidth > 1240) {
    //     lenis = new Lenis({
    //         duration: 1.0,
    //         infinite: false,
    //         gestureOrientation: "vertical",
    //         normalizeWheel: false,
    //         smoothTouch: true,

    //     });

    //     function raf(time) {
    //         lenis.raf(time);
    //         lenisRafId = requestAnimationFrame(raf);
    //     }

    //     lenisRafId = requestAnimationFrame(raf);

    // }


}

 
function destroyLenis() {

    if (lenis) {
        cancelAnimationFrame(lenisRafId);
        lenis.destroy();
        lenis = null;
        lenisRafId = null;

        // removeScrollEventListeners();
    }
}

// lenis.stop();



 
initLenis();

 
window.addEventListener("resize", () => {
     
     
     
    if (document.documentElement.classList.contains("intro-gate-lock")) return;

    if (window.innerWidth > 768) {
        initLenis();  
    }else {
        destroyLenis();  
    }
});



let realVhWidth = window.innerWidth;
let realVhOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
let realVhResizeTimer = null;

function setRealVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    realVhWidth = window.innerWidth;
    realVhOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

function shouldUpdateRealVh() {
    const isMobile = window.innerWidth <= 768;
    const currentOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    const widthChanged = Math.abs(window.innerWidth - realVhWidth) > 1;
    const orientationChanged = currentOrientation !== realVhOrientation;

    return !isMobile || widthChanged || orientationChanged;
}

 
setRealVh();
window.addEventListener('load', () => {
    if (shouldUpdateRealVh()) {
        setRealVh();
    }
});

window.addEventListener('resize', () => {
    clearTimeout(realVhResizeTimer);

    realVhResizeTimer = setTimeout(() => {
         
        if (!shouldUpdateRealVh()) {
            return;
        }

        setRealVh();
    }, 150);
});

window.addEventListener('orientationchange', () => {
    clearTimeout(realVhResizeTimer);
    realVhResizeTimer = setTimeout(setRealVh, 300);
});

function applyAppleRobotVideoSource() {
    var ua = navigator.userAgent || '';
    var platform = navigator.platform || '';
    var maxTouchPoints = navigator.maxTouchPoints || 0;
    var isAppleDevice = /iPad|iPhone|iPod/.test(ua)
        || /Mac/.test(platform)
        || (/Macintosh/.test(ua) && maxTouchPoints > 1);

    if (!isAppleDevice) return;

    document.querySelectorAll('video[data-robot-appear="acer"], .news_robot video').forEach(function (video) {
        var source = video.querySelector('source');

        if (source && source.getAttribute('src') && /\.webm($|\?)/i.test(source.getAttribute('src'))) {
            source.setAttribute('src', source.getAttribute('src').replace(/\.webm($|\?)/i, '.mp4$1'));
            source.setAttribute('type', 'video/mp4');
            video.load();
            return;
        }

        if (video.getAttribute('src') && /\.webm($|\?)/i.test(video.getAttribute('src'))) {
            video.setAttribute('src', video.getAttribute('src').replace(/\.webm($|\?)/i, '.mp4$1'));
            video.load();
        }
    });
}




$(document).ready(function () {
    applyAppleRobotVideoSource();



     
    $('.sub_tab_top .tab_box').each(function () {
        var tabBox = this;
        var startX = 0;
        var startScrollLeft = 0;
        var hasDragged = false;
        var activePointerId = null;

        tabBox.addEventListener('pointerdown', function (event) {
            if (tabBox.scrollWidth <= tabBox.clientWidth) return;

            startX = event.clientX;
            startScrollLeft = tabBox.scrollLeft;
            hasDragged = false;
            activePointerId = event.pointerId;
        });

        tabBox.addEventListener('pointermove', function (event) {
            if (activePointerId !== event.pointerId) return;

            var distance = event.clientX - startX;
            if (Math.abs(distance) > 4) {
                hasDragged = true;
                if (!tabBox.hasPointerCapture(event.pointerId)) tabBox.setPointerCapture(event.pointerId);
                tabBox.classList.add('is-dragging');
            }
            tabBox.scrollLeft = startScrollLeft - distance;
            if (hasDragged) event.preventDefault();
        });

        tabBox.addEventListener('pointerup', function (event) {
            if (activePointerId !== event.pointerId) return;
            if (tabBox.hasPointerCapture(event.pointerId)) tabBox.releasePointerCapture(event.pointerId);
            tabBox.classList.remove('is-dragging');
            activePointerId = null;
            if (!hasDragged) return;
            setTimeout(function () {
                hasDragged = false;
            }, 0);
        });

        tabBox.addEventListener('pointercancel', function (event) {
            if (activePointerId !== event.pointerId) return;
            if (tabBox.hasPointerCapture(event.pointerId)) tabBox.releasePointerCapture(event.pointerId);
            tabBox.classList.remove('is-dragging');
            activePointerId = null;
            hasDragged = false;
        });

        tabBox.addEventListener('click', function (event) {
            if (!hasDragged) return;
            event.preventDefault();
            event.stopPropagation();
            hasDragged = false;
        }, true);

        tabBox.addEventListener('click', function (event) {
            var clickedTab = event.target.closest('.tab');
            if (!clickedTab || !tabBox.contains(clickedTab)) return;

            setTimeout(function () {
                var activeTab = tabBox.querySelector('.tab.active');
                if (!activeTab) return;

                var boxRect = tabBox.getBoundingClientRect();
                var tabRect = activeTab.getBoundingClientRect();
                var tabBoxStyle = window.getComputedStyle(tabBox);
                var leftPadding = parseFloat(tabBoxStyle.paddingLeft) || 0;
                var nextScrollLeft = tabBox.scrollLeft + tabRect.left - boxRect.left - leftPadding;
                var maxScrollLeft = tabBox.scrollWidth - tabBox.clientWidth;
                nextScrollLeft = Math.max(0, Math.min(nextScrollLeft, maxScrollLeft));

                if (nextScrollLeft !== tabBox.scrollLeft) {
                    tabBox.scrollTo({ left: nextScrollLeft, behavior: 'smooth' });
                }
            }, 0);
        });
    });

    
        $('.faq_sect .faq_list .que_box').on('click', function (event) {
            event.preventDefault();

            var $item = $(this).closest('li');
            var $answer = $item.find('.answer_box');
            var isActive = $item.hasClass('active');

            $('.faq_sect .faq_list li').not($item).each(function () {
                var $otherItem = $(this);
                $otherItem.find('.answer_box').stop(true, true).slideUp(300, function () {
                    $otherItem.removeClass('active');
                });
            });

            if (isActive) {
                $answer.stop(true, true).slideUp(300, function () {
                    $item.removeClass('active');
                });
            } else {
                $item.addClass('active');
                $answer.stop(true, true).slideDown(250);
            }
        });

       
       
        $('.faq_sect .faq_more_btn').on('click', function () {
            var $btn = $(this);
            var $faqSect = $btn.closest('.faq_sect');
            var isExpanded = $faqSect.hasClass('is-expanded');

            $faqSect.toggleClass('is-expanded', !isExpanded);
            $btn.attr('aria-expanded', !isExpanded).text(isExpanded ? '查看更多' : '收起');

            if (isExpanded) {
                $faqSect.find('.faq_list li:nth-child(n+6)').each(function () {
                    var $item = $(this);
                    $item.find('.answer_box').stop(true, true).slideUp(300, function () {
                        $item.removeClass('active');
                    });
                });
            }
        });



    

     
     
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    function wrapSubVisualBigTitleChars() {
        document.querySelectorAll('.sub_visual_top .sect_tit_box .big_tit').forEach(function (title) {
            title.querySelectorAll('p > span').forEach(function (target) {
                if (!target || target.querySelector('.line-inner')) return;

                var text = target.textContent || '';
                var fragment = document.createDocumentFragment();

                target.textContent = '';

                text.split('').forEach(function (char) {
                    if (char === ' ') {
                        fragment.appendChild(document.createTextNode(' '));
                        return;
                    }

                    var span = document.createElement('span');
                    span.className = 'line-inner';
                    span.textContent = char;
                    fragment.appendChild(span);
                });

                target.appendChild(fragment);
            });
        });
    }

    wrapSubVisualBigTitleChars();

    function wrapSubInfoSectWords(root) {
        if (!root) return [];

        var innerSpans = [];

        function saveOriginalHtml(textEl) {
            if (!textEl.dataset.originalHtml) {
                textEl.dataset.originalHtml = textEl.innerHTML;
            }
        }

        function restoreOriginalHtml(textEl) {
            saveOriginalHtml(textEl);
            textEl.innerHTML = textEl.dataset.originalHtml;
        }

        function wrapWordsForMeasurement(textEl) {
            function wrapTextNode(textNode) {
                var text = textNode.nodeValue;
                if (!text || !text.trim()) return;

                var fragment = document.createDocumentFragment();
                var parts = text.split(/(\s+)/);

                parts.forEach(function (part) {
                    if (!part) return;

                    if (/^\s+$/.test(part)) {
                        fragment.appendChild(document.createTextNode(part));
                        return;
                    }

                    var outer = document.createElement('span');
                    outer.className = 'word-mask';
                    outer.setAttribute('data-line-token', 'Y');
                    outer.textContent = part;
                    fragment.appendChild(outer);
                });

                textNode.parentNode.replaceChild(fragment, textNode);
            }

            function walk(node) {
                Array.prototype.slice.call(node.childNodes).forEach(function (child) {
                    if (child.nodeType === 3) {
                        wrapTextNode(child);
                        return;
                    }

                    if (child.nodeType !== 1 || child.tagName === 'BR') return;
                    walk(child);
                });
            }

            walk(textEl);
        }

        function rebuildByVisualLine(textEl) {
            restoreOriginalHtml(textEl);
            wrapWordsForMeasurement(textEl);

            var tokens = Array.prototype.slice.call(textEl.querySelectorAll('[data-line-token="Y"]'));
            if (!tokens.length) return;

            var lines = [];
            var currentLine = [];
            var prevTop = null;

            tokens.forEach(function (token) {
                var top = Math.round(token.offsetTop);

                if (prevTop === null || Math.abs(top - prevTop) <= 1) {
                    currentLine.push(token.textContent);
                } else {
                    if (currentLine.length) lines.push(currentLine.join(' '));
                    currentLine = [token.textContent];
                }

                prevTop = top;
            });

            if (currentLine.length) {
                lines.push(currentLine.join(' '));
            }

            textEl.innerHTML = '';

            lines.forEach(function (lineText, index) {
                var outer = document.createElement('span');
                var inner = document.createElement('span');

                outer.className = 'word-mask';
                inner.className = 'word-inner';
                inner.textContent = lineText;
                outer.appendChild(inner);
                textEl.appendChild(outer);
                innerSpans.push(inner);

                if (index < lines.length - 1) {
                    textEl.appendChild(document.createElement('br'));
                }
            });
        }

        root.querySelectorAll('.tit, .txt').forEach(function (textEl) {
            rebuildByVisualLine(textEl);
        });

        return innerSpans;
    }

    function resetSubInfoSectWordReveal(infoSect) {
        if (!infoSect) return;

        if (infoSect._subInfoWordRevealTimeline) {
            infoSect._subInfoWordRevealTimeline.kill();
            infoSect._subInfoWordRevealTimeline = null;
        }

        infoSect.querySelectorAll('.tit, .txt').forEach(function (textEl) {
            if (!textEl.dataset.originalHtml) return;
            textEl.innerHTML = textEl.dataset.originalHtml;
        });
    }

    function initSubInfoSectWordReveal() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        var infoSects = Array.prototype.slice.call(document.querySelectorAll('.sub .info_sect'));
        if (!infoSects.length) return;

        infoSects.forEach(function (infoSect) {
            if (!infoSect) return;

            resetSubInfoSectWordReveal(infoSect);

            if (window.innerWidth <= 768) return;

            var wordInners = wrapSubInfoSectWords(infoSect);
            if (!wordInners.length) return;

            gsap.set(wordInners, {
                yPercent: 110
            });

            infoSect._subInfoWordRevealTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: infoSect,
                    start: 'top 75%',
                    end: 'bottom 50%',
                    scrub: false,
                    invalidateOnRefresh: true
                }
            }).to(wordInners, {
                yPercent: 0,
                duration: 0.6,
                stagger: 0.1
            });
        });
    }

     
    if (document.querySelector('.sub .info_sect')) {
        initSubInfoSectWordReveal();

        var subInfoSectWordRevealResizeTimer = null;
         
         
         
         
         
        var lastResizeW = window.innerWidth;
        var lastResizeOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        window.addEventListener('resize', function () {
            var w = window.innerWidth;
            var orientation = w > window.innerHeight ? 'landscape' : 'portrait';
            if (Math.abs(w - lastResizeW) <= 1 && orientation === lastResizeOrientation) return;
            lastResizeW = w;
            lastResizeOrientation = orientation;

            clearTimeout(subInfoSectWordRevealResizeTimer);
            subInfoSectWordRevealResizeTimer = setTimeout(function () {
                initSubInfoSectWordReveal();

                if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.refresh) {
                    ScrollTrigger.refresh();
                }
            }, 120);
        });
    }

    function updateEssentialSelectFilled($box, val, optionIndex) {
        const hasValue = val !== undefined && val !== null && String(val) !== '';
        const hasSelectedOption = optionIndex !== undefined && optionIndex > 0;

        $box.toggleClass('is-filled filled', hasValue || hasSelectedOption);
    }

    $('.select.sel_ess').each(function () {
        const $box = $(this);
        const $select = $box.find('select');

        updateEssentialSelectFilled($box, $select.val(), $select.prop('selectedIndex'));
    });

    $(document).on('click', '.select.sel_ess .nice-select .option', function () {
        const $option = $(this);
        const $box = $option.closest('.select.sel_ess');
        const val = $option.data('value');  

        updateEssentialSelectFilled($box, val, $option.index());

        const $select = $box.find('select');
        if ($select.attr('id') === 'quickBranchIdx' && (val !== '' || $option.index() > 0)) {
            $select.trigger('change');
        }
    });

    
    $("select").niceSelect();
    $('.nice-select .list').attr('data-lenis-prevent', '');


    $('textarea').on('input', function () {
        const el = this;
         
        if (el.scrollHeight > el.clientHeight) {
            $(el).attr('data-lenis-prevent', '');
        } else {
            $(el).removeAttr('data-lenis-prevent');
        }
    });

    



    // Select Form placeholder
    $(document).on('click', '.form_box .nice-select .option:not(.disabled)', function () {
        const $niceSelect = $(this).closest('.nice-select');
        const selectedText = $(this).text().trim();
        if (selectedText && selectedText !== '请选择') {
            $niceSelect.find('.current').css('opacity', 1);
        } else {
            $niceSelect.find('.current').css('opacity', 0);
        }
    });

    
    $('.form_box select').on('change', function () {
        const $wrap = $(this).closest('.select');
        if ($(this).val()) {
            $wrap.find('.placeholder').css('opacity', 0);
        } else {
            $wrap.find('.placeholder').css('opacity', 1);
        }
    });

    $('.form_box .inp input').on('input change', function () {
        const $wrap = $(this).closest('.inp');
        if ($(this).val().trim()) {
            $wrap.find('.placeholder').css('opacity', 0);
        } else {
            $wrap.find('.placeholder').css('opacity', 1);
        }
    }).trigger('change');

    $('.sub_nav button').on('click', function(){
        $('.sub_nav button').not($(this)).removeClass('open')
        $(this).toggleClass('open')
    })

    var noticeShareSelector = '.notice_view .notice_view01_sect .view_top .share_box';
    $(noticeShareSelector + ' .btn').off('click.noticeViewShareBox');
    $(document)
        .off('click.noticeViewShareBoxBasic', noticeShareSelector + ' .btn')
        .on('click.noticeViewShareBoxBasic', noticeShareSelector + ' .btn', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $shareBox = $(this).closest('.share_box');
            var isOpen = !$shareBox.find('.sns_list').hasClass('show');

            $(noticeShareSelector + ' .btn').removeClass('on');
            $(noticeShareSelector + ' .sns_list').removeClass('show');

            if (isOpen) {
                $(this).addClass('on');
                $shareBox.find('.sns_list').addClass('show');
            }
        });

    $(document)
        .off('click.noticeViewShareBoxBasicClose')
        .on('click.noticeViewShareBoxBasicClose', function (e) {
            if ($(e.target).closest(noticeShareSelector).length) return;
            $(noticeShareSelector + ' .btn').removeClass('on');
            $(noticeShareSelector + ' .sns_list').removeClass('show');
        });

    $(".over_modal").click(function (e){
        var target = e.target;
        if ($(target).hasClass("scroll_box") || $(target).hasClass("over_modal") ) {
            overModalClose();
            if (lenis) lenis.start();
        }
    });

    const options = {
        root: null,  
        threshold: 0.1  
    };

    // const observer = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //         const video = entry.target;
    //         if (entry.isIntersecting) {
     
    //         } else {
    //             video.pause();
    //         }
    //     });
    // }, options);

     
    // document.querySelectorAll('video').forEach(video => {
    //     if (video.getAttribute('data-video-observe') === 'off') return;
    //     observer.observe(video);
    // });

    



     
     




    
     
     
     
     
     
     
     
     
     
     
    //
     
     
     
     
     
    //
     
     
     
     
     
     
    var programScrollSeq = 0;
    var programScrollReleaseTimer = null;
    function releaseProgramScroll() {
        clearTimeout(programScrollReleaseTimer);
        programScrollReleaseTimer = null;
        window.isScrollJumping = false;
    }
     
     
    function makeProgramScrollRelease(seq, nextFrame) {
        return function () {
            if (seq !== programScrollSeq) return;
             
             
             
             
             
            if (!nextFrame) return releaseProgramScroll();
            requestAnimationFrame(function () {
                if (seq !== programScrollSeq) return;
                releaseProgramScroll();
            });
        };
    }
     
    function programScrollTo(y, seconds) {
         
         
         
         
        if (!window.isScrollJumping && Math.abs(y - window.scrollY) < 2) return;
        var seq = ++programScrollSeq;
        window.isScrollJumping = true;
        clearTimeout(programScrollReleaseTimer);
         
        programScrollReleaseTimer = setTimeout(makeProgramScrollRelease(seq, false), seconds * 1000 + 400);

        if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(y, {
                duration: seconds,
                 
                 
                lock: true,
                 
                force: true,
                onComplete: makeProgramScrollRelease(seq, true)
            });
            return;
        }
         
        $('html, body').stop(true).animate({ scrollTop: y }, {
            duration: seconds * 1000,
            complete: makeProgramScrollRelease(seq, true)
        });
    }

    $(".page_top_btn").click(function () {
        programScrollTo(0, 0.4);
        return false;
    });

     
    const siteNavBtns = document.querySelectorAll('.site_nav .btn[data-sect]');
    function getSiteNavTarget(sect) {
        return Array.from(document.querySelectorAll('[data-sect="' + sect + '"]'))
            .find((el) => !el.closest('.site_nav'));
    }

     
     
     
     
     
     
     
    function siteNavDocTop(el) {
        if (getComputedStyle(el).position !== 'sticky') return el.getBoundingClientRect().top + window.scrollY;
        var prevPosition = el.style.position;
        var prevTop = el.style.top;
        el.style.position = 'static';
        var y = el.getBoundingClientRect().top + window.scrollY;
        el.style.position = prevPosition;
        el.style.top = prevTop;
        return y;
    }

    const siteNavSections = Array.from(siteNavBtns)
        .map((btn) => getSiteNavTarget(btn.dataset.sect))
        .filter(Boolean);

    siteNavBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
            const target = getSiteNavTarget(this.dataset.sect);
            if (!target) return;

             
            var resolvedTop = typeof target.siteNavScrollY === 'function' ? target.siteNavScrollY() : null;
            var targetTop = (typeof resolvedTop === 'number' && isFinite(resolvedTop)) ? resolvedTop : siteNavDocTop(target);

             
            programScrollTo(targetTop, 0.5);
        });
    });

     
     
    let siteNavTops = [];
    let siteNavActiveSect = null;

    function measureSiteNav() {
         
         
        siteNavTops = siteNavSections.map((section) => siteNavDocTop(section));
    }

    function updateSiteNavActive() {
        if (siteNavSections.length < 2) return;
        if (siteNavTops.length !== siteNavSections.length) measureSiteNav();

        const checkPoint = window.scrollY + window.innerHeight * 0.45;
        let activeSect = siteNavSections[0].getAttribute('data-sect');

        siteNavSections.forEach((section, i) => {
            if (checkPoint >= siteNavTops[i]) {
                activeSect = section.getAttribute('data-sect');
            }
        });

         
        if (activeSect === siteNavActiveSect) return;
        siteNavActiveSect = activeSect;

        siteNavBtns.forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.sect === activeSect);
        });
    }

    let siteNavMeasureTimer = null;
    function scheduleSiteNavMeasure() {
        clearTimeout(siteNavMeasureTimer);
        siteNavMeasureTimer = setTimeout(() => {
            measureSiteNav();
            siteNavActiveSect = null;    
            updateSiteNavActive();
        }, 60);
    }
    window.addEventListener('resize', scheduleSiteNavMeasure);
    window.addEventListener('load', scheduleSiteNavMeasure, { once: true });
    if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.addEventListener) {
         
        ScrollTrigger.addEventListener('refresh', scheduleSiteNavMeasure);
    }

    measureSiteNav();
    updateSiteNavActive();
    window.addEventListener('scroll', updateSiteNavActive, { passive: true });

    var scrollingElement = document.scrollingElement;
    var scrollWidth = window.innerWidth - scrollingElement.clientWidth
    var root = document.querySelector(':root');
    let styles = getComputedStyle(root);
    styles.getPropertyValue('--scroll-width');
    root.style.setProperty('--scroll-width', scrollWidth+'px');


    var previousScroll;
    var windowScroll = window.pageYOffset || document.documentElement.scrollTop;
    var scrollPosition;


    $(".header").removeClass("down")

    scrollPosition = window.scrollY || window.pageYOffset;
    if (scrollPosition > 100) {
        $(".header").addClass("header_down")
    }else {
        $(".header").removeClass("header_down")
    }

     
    var headerDownOn = null;
    var bodyDownOn = null;
    var scrollHeader = document.querySelector('.header');
    var menuButton = scrollHeader ? scrollHeader.querySelector('.btn.ham.menu_toggle') : null;
    var menuBox = scrollHeader ? scrollHeader.querySelector('.right_box') : null;

     
     
    var pageTopGateSect = document.querySelector('.order_sect');
    function shouldShowPageTopBtn(y) {
        if (pageTopGateSect) return pageTopGateSect.classList.contains('is-bg-light');
        return y > 50;
    }
    function updatePageTopBtn() {
        $(".page_top_btn").toggleClass("active", shouldShowPageTopBtn(window.scrollY || window.pageYOffset || 0));
    }
     
    if (pageTopGateSect && typeof MutationObserver !== 'undefined') {
        new MutationObserver(updatePageTopBtn).observe(pageTopGateSect, { attributes: true, attributeFilter: ['class'] });
    }

    $(window).on('scroll', function () {
        scrollPosition = window.scrollY || window.pageYOffset;

        var wantHeaderDown = scrollPosition > 100;
        if (wantHeaderDown !== headerDownOn) {
            headerDownOn = wantHeaderDown;
            $(".header").toggleClass("header_down", wantHeaderDown)
        }

        if ($(".nav").hasClass('on')){
            return
        }

        updatePageTopBtn();

        var currentScroll = $(this).scrollTop();
        if (currentScroll > previousScroll) {
            if (scrollPosition > 10 && bodyDownOn !== true) {
                bodyDownOn = true;
                $(".header").addClass("down")
                $("body").addClass("down")

                if (scrollHeader) scrollHeader.classList.remove('open');
                if (menuButton) {
                    menuButton.setAttribute('aria-expanded', 'false');
                    menuButton.setAttribute('aria-label', '打开全屏菜单');
                }
                if (menuBox) menuBox.setAttribute('aria-hidden', 'true');

            }
        } else {
            if (bodyDownOn !== false) {
                bodyDownOn = false;
                $(".header").removeClass("down")
                $("body").removeClass("down")
            }
        }
        previousScroll = currentScroll;
    });




    $("select").niceSelect()


  




     
    if (window.innerWidth >= 768) {
        const ioSlideUp = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const $target = entry.target;
                if (entry.isIntersecting) {
                    $target.classList.add("active");
                }
            });
        },{threshold: .2});

        const $itemsSlideUp = document.querySelectorAll(".slideUp_sect .cont_wrap .cont")
        $itemsSlideUp.forEach((item) => {
            ioSlideUp.observe(item);
        });
    }


     
    $(".modal").on('click', function (e){
        if ($(this).find('.no-bg-close').length > 0) return;
        const target = e.target;
        if ($(target).hasClass("scroll_box") || $(target).hasClass("modal") ) {
            closeModal();
        }
    });

    $(".over_modal").on('click', function (e){
        if ($(this).find('.no-bg-close').length > 0) return;
        const target = e.target;
        if ($(target).hasClass("scroll_box") || $(target).hasClass("over_modal") ) {
            closeOoverModal();
        }
    });


    ComContObserver('.com_top_sect', 0.5)
    ComContObserver('.com_graph_sect .graph_cont', 0.5)
    ComContObserver('.com_graph_sect .cont2', 0.5)
    ComContObserver('.sect_tit_box', 0.5, false, 0.3)
    ComContObserver('.sub_visual_top .top_tit_box', 0.5, false, 0.3)
    ComContObserver('.sub .cont_tit_box', 0.5, false, 0.3)
    ComContObserver('.faq_sect', 0.5, false, 0.3)

    
});





// ==observer==
window.ComContObserver = function(selector, num, type, moNum ,slide ) {

    if(window.innerWidth < 768){
        if (moNum) num = moNum
    }


    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const target = entry.target;
            const shouldSkipCharacterSectTitle = selector === '.sect_tit_box' && target.closest('.character_sect');

            if (shouldSkipCharacterSectTitle) {
                return;
            }

            if (entry.isIntersecting) {
                target.classList.add("active");
                if (slide?.autoplay?.start) slide.autoplay.start();
            } else if (type) {
                target.classList.remove("active");
            }
        });
    }, { threshold: num });

    document.querySelectorAll(selector).forEach((item) => observer.observe(item));
};









(function () {
    const mq = window.matchMedia('(max-width: 1240px)');
    const links = document.querySelectorAll('.footer a[href^="tel:"]');
    if (!links.length) return;

    const apply = () => {
        links.forEach((a) => {
            if (mq.matches) {
                if (a.dataset.tel) {
                    a.setAttribute('href', a.dataset.tel);
                    delete a.dataset.tel;
                }
            } else if (a.hasAttribute('href')) {
                a.dataset.tel = a.getAttribute('href');
                a.removeAttribute('href');
            }
        });
    };

    apply();
     
     
    mq.addEventListener('change', apply);
    window.addEventListener('resize', apply);
})();
