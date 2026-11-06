/* ==========================================================================
   works-wall.js —— 作品墙交互（点击放大灯箱 + 分类卡跳转）
   --------------------------------------------------------------------------
   设计约束：
     1. 不依赖任何库，不修改站点原有 JS / DOM 结构（只往 .wk_frame 里插一个按钮）；
     2. 滚动锁复用站点自带的 stopLenisForModal() / startLenisAfterModalClose()，
        退化情况下用 html.scroll_none（站点自己的类，common.css 里是 overflow:hidden）；
     3. 一切取不到元素都安静退出，不抛错、不阻塞站点脚本。
   ========================================================================== */
(function () {
    'use strict';

    var LB = null;        // 灯箱根节点
    var items = [];       // 当前面板的作品项
    var cur = 0;
    var lastFocus = null;
    var ctaDelegated = false;

    /* ---------------------------------------------------------- 工具 */

    function visiblePanel() {
        var panels = document.querySelectorAll('.wk_panel');
        for (var i = 0; i < panels.length; i++) {
            if (getComputedStyle(panels[i]).display !== 'none') return panels[i];
        }
        return panels[0] || null;
    }

    function collect(panel) {
        if (!panel) return [];
        var cards = panel.querySelectorAll('.wk_card');
        var out = [];
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var media = card.querySelector('img, video');
            if (!media) continue;
            var name = card.querySelector('.wk_name');
            var meta = card.querySelector('.wk_meta');
            out.push({
                isVideo: !!card.querySelector('video') || card.className.indexOf('wk_card--video') >= 0,
                src: media.getAttribute('src') || '',
                poster: media.getAttribute('poster') || '',
                title: name ? (name.textContent || '').trim() : '',
                meta: meta ? (meta.textContent || '').trim() : ''
            });
        }
        return out;
    }

    function lockScroll() {
        try {
            if (typeof window.stopLenisForModal === 'function') { window.stopLenisForModal(); return; }
        } catch (e) { /* 忽略，走退化路径 */ }
        document.documentElement.classList.add('scroll_none');
        document.body.classList.add('scroll_none');
    }

    function unlockScroll() {
        try {
            if (typeof window.startLenisAfterModalClose === 'function') { window.startLenisAfterModalClose(); return; }
        } catch (e) { /* 忽略 */ }
        document.documentElement.classList.remove('scroll_none');
        document.body.classList.remove('scroll_none');
    }

    /* ---------------------------------------------------------- 灯箱 DOM */

    function build() {
        if (LB) return LB;
        LB = document.createElement('div');
        LB.className = 'wk_lb';
        LB.setAttribute('role', 'dialog');
        LB.setAttribute('aria-modal', 'true');
        LB.setAttribute('aria-label', '作品放大查看');
        LB.innerHTML =
            '<div class="wk_lb_backdrop" data-wk-close></div>' +
            '<div class="wk_lb_body">' +
            '<div class="wk_lb_top">' +
            '<div class="wk_lb_info"><span class="wk_lb_title"></span>' +
            '<span class="wk_lb_meta"></span></div>' +
            '<span class="wk_lb_count"></span>' +
            '<button type="button" class="wk_lb_btn wk_lb_close" aria-label="关闭（Esc）">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6L18 18M18 6L6 18" ' +
            'stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>' +
            '</div>' +
            '<div class="wk_lb_stage"><div class="wk_lb_media"></div></div>' +
            '<button type="button" class="wk_lb_nav wk_lb_prev" aria-label="上一张（←）">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5L8 12l7 7" ' +
            'stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" ' +
            'stroke-linejoin="round"/></svg></button>' +
            '<button type="button" class="wk_lb_nav wk_lb_next" aria-label="下一张（→）">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" ' +
            'stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" ' +
            'stroke-linejoin="round"/></svg></button>' +
            '</div>';
        document.body.appendChild(LB);

        LB.querySelector('[data-wk-close]').addEventListener('click', close);
        LB.querySelector('.wk_lb_close').addEventListener('click', close);
        LB.querySelector('.wk_lb_prev').addEventListener('click', function (e) { e.stopPropagation(); go(-1); });
        LB.querySelector('.wk_lb_next').addEventListener('click', function (e) { e.stopPropagation(); go(1); });

        // 点「媒体之外的空白」关闭。.wk_lb_body 铺满全屏，backdrop 其实点不到，
        // 所以关闭的落点放在 stage / media 自身（命中图片或视频时不关闭）。
        LB.querySelector('.wk_lb_stage').addEventListener('click', function (e) {
            if (e.target === this || e.target.classList.contains('wk_lb_media')) close();
        });

        // 触屏左右滑动
        var x0 = null;
        LB.addEventListener('touchstart', function (e) {
            x0 = e.touches.length === 1 ? e.touches[0].clientX : null;
        }, { passive: true });
        LB.addEventListener('touchend', function (e) {
            if (x0 === null) return;
            var dx = (e.changedTouches[0] ? e.changedTouches[0].clientX : x0) - x0;
            x0 = null;
            if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
        }, { passive: true });

        document.addEventListener('keydown', onKey);
        return LB;
    }

    function onKey(e) {
        if (!LB || !LB.classList.contains('is_open')) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    }

    function render() {
        var it = items[cur];
        if (!it) return;
        var media = LB.querySelector('.wk_lb_media');
        media.innerHTML = '';
        var node;
        if (it.isVideo) {
            node = document.createElement('video');
            node.src = it.src;
            if (it.poster) node.poster = it.poster;
            node.controls = true;
            node.autoplay = true;
            node.playsInline = true;
            node.preload = 'metadata';
        } else {
            node = document.createElement('img');
            node.src = it.src;
            node.alt = it.title;
            node.decoding = 'async';
        }
        node.className = 'wk_lb_el';
        media.appendChild(node);

        LB.querySelector('.wk_lb_title').textContent = it.title;
        LB.querySelector('.wk_lb_meta').textContent = it.meta;
        LB.querySelector('.wk_lb_count').textContent = (cur + 1) + ' / ' + items.length;

        var many = items.length > 1;
        LB.classList.toggle('is_single', !many);
    }

    function go(step) {
        if (!items.length) return;
        cur = (cur + step + items.length) % items.length;
        render();
    }

    function open(index) {
        var panel = visiblePanel();
        items = collect(panel);
        if (!items.length) return;
        cur = Math.max(0, Math.min(index, items.length - 1));
        lastFocus = document.activeElement;
        build();
        LB.classList.add('is_open');
        document.documentElement.classList.add('wk_lb_locked');
        render();
        lockScroll();
        var closeBtn = LB.querySelector('.wk_lb_close');
        if (closeBtn) closeBtn.focus({ preventScroll: true });
    }

    function close() {
        if (!LB) return;
        var v = LB.querySelector('video');
        if (v) { try { v.pause(); } catch (e) { /* 忽略 */ } }
        LB.classList.remove('is_open');
        document.documentElement.classList.remove('wk_lb_locked');
        unlockScroll();
        items = [];
        if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* 忽略 */ } }
    }

    /* ---------------------------------------------------------- 绑定卡片 */

    function decorate(card, index, list) {
        var frame = card.querySelector('.wk_frame');
        if (!frame) return;

        if (!frame.querySelector('.wk_expand')) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'wk_expand';
            btn.setAttribute('aria-label', '放大查看');
            btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' +
                '<path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" fill="none" ' +
                'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
                'stroke-linejoin="round"/></svg>';
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                open(index);
            });
            frame.appendChild(btn);
        }

        var isVideo = !!card.querySelector('video');
        card.style.cursor = 'zoom-in';
        card.addEventListener('click', function (e) {
            // 点在原生播放器（<video>）或放大按钮上时不拦截，让控件正常工作
            if (e.target && e.target.closest && e.target.closest('video, .wk_expand')) return;
            e.preventDefault();
            open(index);
        });
        if (isVideo) card.dataset.wkVideo = '1';
    }

    function bindCards() {
        var panels = document.querySelectorAll('.wk_panel');
        for (var p = 0; p < panels.length; p++) {
            var cards = panels[p].querySelectorAll('.wk_card');
            for (var i = 0; i < cards.length; i++) {
                if (cards[i].dataset.wkBound) continue;
                cards[i].dataset.wkBound = '1';
                decorate(cards[i], i, cards);
            }
        }
    }

    /* ------------------------------------------- 分类卡 → 作品墙对应分类 */

    var RULES = [
        ['海报', 'poster'],
        ['一致性', 'portrait'],
        ['角色', 'portrait'],
        ['分镜', 'aiart'],
        ['prompt', 'aiart'],
        ['生图', 'aiart'],
        ['短剧', 'video'],
        ['广告', 'video'],
        ['混剪', 'video'],
        ['卡点', 'video'],
        ['配音', 'video']
    ];

    function pickTab(text) {
        var t = (text || '').toLowerCase();
        for (var i = 0; i < RULES.length; i++) {
            if (t.indexOf(RULES[i][0].toLowerCase()) >= 0) return RULES[i][1];
        }
        return null;
    }

    function jumpTo(tabId) {
        var cont = document.querySelector('.wk_cont');
        if (!cont) return false;
        var radio = document.getElementById('wk-t-' + tabId);
        if (!radio) return false;

        // 先在稳定的位置上算目标：tabs 上方的标题区
        var y = cont.getBoundingClientRect().top + (window.pageYOffset || window.scrollY || 0) - 90;
        radio.checked = true;                       // 纯 CSS 的 :checked 会立刻切换面板
        radio.dispatchEvent(new Event('change', { bubbles: true }));

        try {
            window.scrollTo({ top: y, behavior: 'smooth' });
        } catch (e) {
            window.scrollTo(0, y);
        }
        // 站点用平滑滚动库时直接 scrollTo 可能被接管，兜底硬跳一次
        setTimeout(function () {
            var now = window.pageYOffset || window.scrollY || 0;
            if (Math.abs(now - y) > 160) window.scrollTo(0, y);
        }, 700);
        return true;
    }

    function bindCategoryCards() {
        var links = document.querySelectorAll('.portfolio_sect .cont_box .cont');
        for (var i = 0; i < links.length; i++) {
            var a = links[i];
            if (a.dataset.wkJump) continue;
            var tit = a.querySelector('.tit');
            var tabId = pickTab(tit ? tit.textContent : a.textContent);
            if (!tabId) continue;
            a.dataset.wkJump = tabId;
            a.setAttribute('title', '查看对应的真实作品');
            a.addEventListener('click', function (e) {
                if (jumpTo(this.dataset.wkJump)) e.preventDefault();
            });
        }
    }

    /* ------------------------------- 顶栏死链修复（「联系我」「作品集」） */

    // 模板把这两个主按钮写成 href="javascript:;"，点了完全没反应。
    // 对求职站来说「联系我」是最关键的入口，必须能到联系区。
    var CTA_TARGETS = [
        ['联系我', '.footer'],
        ['作品集', '.wk_cont']
    ];

    function scrollToSelector(sel) {
        var el = document.querySelector(sel);
        if (!el) return false;

        // 目标位置随懒加载图片"长高"会漂移，所以每次都重新测量
        function targetY() {
            return el.getBoundingClientRect().top + (window.pageYOffset || window.scrollY || 0) - 80;
        }
        function jump(smooth) {
            var y = targetY();
            try {
                window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' });
            } catch (e) {
                window.scrollTo(0, y);
            }
        }

        jump(true);
        // 平滑滚动库可能接管 scrollTo；图片解码后布局还会变，所以校正两次
        [700, 1600].forEach(function (delay) {
            setTimeout(function () {
                var y = targetY();
                var now = window.pageYOffset || window.scrollY || 0;
                if (Math.abs(now - y) > 160) jump(false);
            }, delay);
        });
        return true;
    }

    /* 原站的「查看全部 / 查看更多 / 查看」全是跳二级页的入口，本站没有二级页，
       点了完全没反应。统一改接到作品墙——访客点「想看更多」，就真的能看到她的作品，
       而不是撞一堵墙。要改行为只需动这一张表。 */
    var MORE_TARGETS = [
        ['查看全部', '.wk_cont'],
        ['查看更多', '.wk_cont'],
        ['查看', '.wk_cont']
    ];

    function bindOne(a, target, title) {
        a.dataset.wkCta = target;
        a.setAttribute('title', title);
    }

    /* 事件委托，而不是逐个 addEventListener —— 站点用 Swiper 的 loop 模式，
       会把幻灯片 cloneNode 一份：**属性会被复制，事件监听器不会**。
       逐节点绑定时，克隆出来的那个按钮虽然带着 data-wk-cta，点了却没反应。
       委托挂在 document 上，克隆节点冒泡上来照样能命中。 */
    function delegateCtaClicks() {
        if (ctaDelegated) return;
        ctaDelegated = true;
        document.addEventListener('click', function (e) {
            var a = e.target && e.target.closest ? e.target.closest('[data-wk-cta]') : null;
            if (!a) return;
            e.preventDefault();
            scrollToSelector(a.dataset.wkCta);
        });
    }

    function bindDeadCtas() {
        var links = document.querySelectorAll('a[href="javascript:;"], a[href="#"], a[href=""]');
        for (var i = 0; i < links.length; i++) {
            var a = links[i];
            if (a.dataset.wkCta) continue;
            var t = (a.textContent || '').replace(/\s+/g, '');
            var hit = null;
            for (var j = 0; j < CTA_TARGETS.length; j++) {
                if (t === CTA_TARGETS[j][0]) { hit = [CTA_TARGETS[j][1], CTA_TARGETS[j][0] === '联系我' ? '跳到联系方式' : '跳到作品墙']; break; }
            }
            if (!hit) {
                for (var k = 0; k < MORE_TARGETS.length; k++) {
                    if (t === MORE_TARGETS[k][0]) { hit = [MORE_TARGETS[k][1], '跳到作品墙']; break; }
                }
            }
            if (hit) bindOne(a, hit[0], hit[1]);
        }

        /* 开屏弹窗的两张海报：一张「新作连载中」→ 毕业短片；一张「求职中」→ 作品墙。
           原来是 javascript:; 死链，点了什么都没发生。 */
        var posters = document.querySelectorAll('.main-popup-slide a');
        for (var p = 0; p < posters.length; p++) {
            if (posters[p].dataset.wkCta) continue;
            var img = posters[p].querySelector('img');
            var alt = img ? (img.getAttribute('alt') || '') : '';
            bindOne(posters[p], alt.indexOf('新作') === 0 ? '.wk_feature' : '.wk_cont',
                    alt.indexOf('新作') === 0 ? '查看《毕业》' : '跳到作品墙');
        }
    }

    /* ---------------------------------------------------------- 启动 */

    function init() {
        delegateCtaClicks();     // 委托先挂上：克隆出来的节点也能命中
        bindDeadCtas();          // 不依赖作品墙是否存在，先接上
        // Swiper 可能在 DOMContentLoaded 之后才 clone 幻灯片：
        // 隔一会儿再扫两遍，给后生成的按钮补上 data-wk-cta
        setTimeout(bindDeadCtas, 1200);
        setTimeout(bindDeadCtas, 3000);
        if (!document.querySelector('.wk_cont')) return;
        bindCards();
        bindCategoryCards();

        // 切换分类后，卡片集合变了：因为卡片是同一批（只是显示/隐藏），无需重新绑定，
        // 但 open() 每次都重新 collect()，所以索引始终与当前面板一致。
        var radios = document.querySelectorAll('.wk_radio');
        for (var i = 0; i < radios.length; i++) {
            radios[i].addEventListener('change', function () { /* 仅用于占位：CSS 已完成切换 */ });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
