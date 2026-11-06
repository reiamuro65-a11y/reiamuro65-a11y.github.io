/*
 * Portfolio sticker interaction (vanilla JavaScript, no dependencies).
 * Replace only REMOTE_SETS paths when local sticker assets are ready.
 */
(function (global) {
    'use strict';

    const REMOTE_SETS = [
        {
            id: 'a',
            width: 280,
            height: 175,
            front: '/inc/img/main/sticker/sticker1_front.svg',
            back: '/inc/img/main/sticker/sticker1_back.svg'
        },
        {
            id: 'b',
            width: 168,
            height: 107,
            front: '/inc/img/main/sticker/sticker4_front.svg',
            back: '/inc/img/main/sticker/sticker4_back.svg'
        },
        {
            id: 'c',
            width: 200,
            height: 324,
            front: '/inc/img/main/sticker/sticker5_front.svg',
            back: '/inc/img/main/sticker/sticker5_back.svg'
        },
        {
            id: 'd',
            width: 160,
            height: 160,
            front: '/inc/img/main/sticker/sticker6_front.svg',
            back: '/inc/img/main/sticker/sticker6_back.svg'
        },
        {
            id: 'e',
            width: 180,
            height: 160,
            front: '/inc/img/main/sticker/sticker7_front.svg',
            back: '/inc/img/main/sticker/sticker7_back.svg'
        },
        {
            id: 'f',
            width: 176,
            height: 197,
            front: '/inc/img/main/sticker/sticker8_front.svg',
            back: '/inc/img/main/sticker/sticker8_back.svg'
        },
        {
            id: 'g',
            width: 184,
            height: 184,
            front: '/inc/img/main/sticker/sticker10_front.svg',
            back: '/inc/img/main/sticker/sticker10_back.svg'
        },
        {
            id: 'h',
            width: 164,
            height: 164,
            front: '/inc/img/main/sticker/sticker11_front.svg',
            back: '/inc/img/main/sticker/sticker11_back.svg'
        },
        {
            id: 'i',
            width: 200,
            height: 200,
            front: '/inc/img/main/sticker/sticker12_front.svg',
            back: '/inc/img/main/sticker/sticker12_back.svg'
        },
        {
            id: 'j',
            width: 200,
            height: 196,
            front: '/inc/img/main/sticker/sticker13_front.svg',
            back: '/inc/img/main/sticker/sticker13_back.svg'
        },
        {
            id: 'k',
            width: 190,
            height: 142,
            front: '/inc/img/main/sticker/sticker14_front.svg',
            back: '/inc/img/main/sticker/sticker14_back.svg'
        },
        {
            id: 'l',
            width: 210,
            height: 105,
            front: '/inc/img/main/sticker/sticker15_front.svg',
            back: '/inc/img/main/sticker/sticker15_back.svg'
        },
        {
            id: 'm',
            width: 176,
            height: 185,
            front: '/inc/img/main/sticker/sticker16_front.svg',
            back: '/inc/img/main/sticker/sticker16_back.svg'
        },
        {
            id: 'n',
            width: 152,
            height: 152,
            front: '/inc/img/main/sticker/sticker17_front.svg',
            back: '/inc/img/main/sticker/sticker17_back.svg'
        },
        {
            id: 'o',
            width: 214,
            height: 62,
            front: '/inc/img/main/sticker/sticker18_front.svg',
            back: '/inc/img/main/sticker/sticker18_back.svg'
        },
        {
            id: 'p',
            width: 188,
            height: 124,
            front: '/inc/img/main/sticker/sticker19_front.svg',
            back: '/inc/img/main/sticker/sticker19_back.svg'
        },
        {
            id: 'q',
            width: 206,
            height: 88,
            front: '/inc/img/main/sticker/sticker20_front.svg',
            back: '/inc/img/main/sticker/sticker20_back.svg'
        }

    ];

    const CHARACTER_EL_SETS = [
        {
            selector: '.el.left1',
            id: 'left1',
            width: 188,
            height: 126,
            front: '/inc/img/main/basic_sticker/basic-sticker7_front.svg',
            back: '/inc/img/main/basic_sticker/basic-sticker7_back.svg',
            motionDelay: '0.94s'
        },
        {
            selector: '.el.left2',
            id: 'left2',
            width: 168,
            height: 116,
            front: '/inc/img/main/basic_sticker/basic-sticker8_front.svg',
            back: '/inc/img/main/basic_sticker/basic-sticker8_back.svg',
            motionDelay: '1.28s'
        },
        {
            selector: '.el.left3',
            id: 'left3',
            width: 148,
            height: 108,
            front: '/inc/img/main/basic_sticker/basic-sticker4_front.svg',
            back: '/inc/img/main/basic_sticker/basic-sticker4_back.svg',
            motionDelay: '1.16s'
        },
        {
            selector: '.el.left4',
            id: 'left4',
            width: 196,
            height: 134,
            front: '/inc/img/main/basic_sticker/basic-sticker3_front.svg',
            back: '/inc/img/main/basic_sticker/basic-sticker3_back.svg',
            motionDelay: '1.28s'
        },
        {
            selector: '.el.right1',
            id: 'right1',
            width: 228,
            height: 156,
            front: '/inc/img/main/basic_sticker/basic-sticker1_front.svg',
            back: '/inc/img/main/basic_sticker/basic-sticker1_back.svg',
            motionDelay: '1.14s'
        },
        {
            selector: '.el.right2',
            id: 'right2',
            width: 224,
            height: 80,
            front: '/inc/img/main/basic_sticker/basic-sticker5_front.svg',
            back: '/inc/img/main/basic_sticker/basic-sticker5_back.svg',
            motionDelay: '1.32s'
        },
        {
            selector: '.el.right3',
            id: 'right3',
            width: 160,
            height: 114,
            front: '/inc/img/main/basic_sticker/basic-sticker6_front.svg',
            back: '/inc/img/main/basic_sticker/basic-sticker6_back.svg',
            motionDelay: '1.26s'
        },
        {
            selector: '.el.right4',
            id: 'right4',
            width: 200,
            height: 136,
            front: '/inc/img/main/basic_sticker/basic-sticker2_front.svg',
            back: '/inc/img/main/basic_sticker/basic-sticker2_back.svg',
            motionDelay: '1.52s'
        }
    ];

    const DEFAULTS = {
        selector: '.character_wrap[data-area="sticker"], .character_wrap [data-area="sticker"], .portfolio_sect[data-area="sticker"], .portfolio_sect [data-area="sticker"]',
        sets: REMOTE_SETS,
        maxStickers: 16,
        mobileRatio: 0.75,
        initialCount: 5,
        initialCountMobile: 3,
        initialAreaSelector: null,
        rotation: [-60, 60],
        scale: [1, 1.2],
        flipDelay: 300,
        removeDuration: 300,
        avoidRepeat: 4,
        ignoreSelector: 'a,button,input,select,textarea,label,summary,[data-no-sticker]',
        moveSlop: 10,
        mobileBreakpoint: 768,
        preload: true,
        autoReset: false
    };

    let activeApi = null;

    function pxToEm(value) {
        const rootFontSize = parseFloat(global.getComputedStyle(document.documentElement).fontSize) || 10;
        return (value / rootFontSize).toFixed(4).replace(/\.?0+$/, '') + 'em';
    }

    function initPortfolioStickerEffect(userOptions) {
        if (activeApi) return activeApi;

        const options = Object.assign({}, DEFAULTS, userOptions || {});
        const roots = Array.prototype.slice.call(document.querySelectorAll(options.selector));
        const noop = { add: function () {}, reset: function () {}, clear: function () {}, destroy: function () {}, roots: [] };

        if (!roots.length || !options.sets.length) return noop;

        const boards = new Map();
        let sizeFactor = calculateSizeFactor();
        let pointer = null;
        let lastAddStamp = 0;
        let resizeTimer = null;
        let resetTimer = null;
        let destroyed = false;

        roots.forEach(function (root) {
            boards.set(root, { items: [], recent: [], z: 4, cursor: createCursor(root), enabled: false });
        });

        if (options.preload) preloadImages();

        function isMobile() {
            return global.innerWidth < options.mobileBreakpoint;
        }

        function calculateSizeFactor() {
            const width = global.innerWidth;
            if (width < 576) return 0.6;
            if (width < 768) return 0.75;
            if (width < 992) return 0.85;
            if (width < 1200) return 0.9;
            return 1;
        }

        function maxCount() {
            const limit = isMobile()
                ? Math.floor(options.maxStickers * options.mobileRatio)
                : options.maxStickers;
            return Math.max(1, limit);
        }

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        function clamp(value, min, max) {
            if (max < min) return (min + max) / 2;
            return Math.min(Math.max(value, min), max);
        }

        function preloadImages() {
            options.sets.forEach(function (set) {
                [set.front, set.back].forEach(function (src) {
                    if (!src) return;
                    const image = new Image();
                    image.decoding = 'async';
                    image.referrerPolicy = 'no-referrer';
                    image.src = src;
                });
            });
        }

        function createCursor(root) {
            const host = root.querySelector('.character_cont') || root;
            const cursor = document.createElement('div');
            cursor.className = 'portfolio-sticker-cursor';
            cursor.setAttribute('aria-hidden', 'true');
            cursor.setAttribute('data-no-sticker', '');
            cursor._cursorHost = host;
            cursor.innerHTML = '<span class="ico"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.26432 6.96159C4.90088 5.90726 5.93439 4.89842 6.97982 5.28906H6.98047L14 7.73372L14.0267 7.74349C15.1795 8.20099 15.1083 9.82323 13.9668 10.222L11.1914 11.1908L10.0508 14.2077C9.62305 15.3384 8.00063 15.3686 7.57227 14.2051C7.56886 14.1958 7.56549 14.1865 7.5625 14.1771L5.26367 6.96224L5.26432 6.96159ZM6.5345 6.55729L8.81315 13.7116L10.0553 10.4277L10.0846 10.3607C10.1622 10.2087 10.2961 10.0914 10.459 10.0345L13.502 8.97201L6.54167 6.54818C6.53752 6.54673 6.53342 6.54515 6.5293 6.54362C6.53087 6.54821 6.53303 6.55267 6.5345 6.55729ZM3.27474 7.81966C3.53509 7.55931 3.95775 7.55931 4.2181 7.81966C4.47832 8.07992 4.47817 8.50201 4.2181 8.76237L3.36589 9.61458C3.10555 9.87492 2.68353 9.8749 2.42318 9.61458C2.16283 9.35423 2.16283 8.93222 2.42318 8.67188L3.27474 7.81966ZM2.80534 5.35221C3.17351 5.35223 3.47201 5.6507 3.47201 6.01888C3.47192 6.38698 3.17346 6.68553 2.80534 6.68555H1.60026C1.23213 6.68555 0.933683 6.38699 0.933594 6.01888C0.933594 5.65069 1.23207 5.35221 1.60026 5.35221H2.80534ZM2.42318 2.42318C2.68354 2.16298 3.10559 2.16288 3.36589 2.42318L4.2181 3.27539C4.47824 3.5357 4.47825 3.95779 4.2181 4.2181C3.95775 4.47845 3.53509 4.47845 3.27474 4.2181L2.42318 3.36589C2.16283 3.10554 2.16283 2.68353 2.42318 2.42318ZM8.67187 2.42318C8.93224 2.16297 9.35428 2.16288 9.61458 2.42318C9.87485 2.68348 9.87478 3.10554 9.61458 3.36589L8.76237 4.2181C8.50203 4.47844 8.08001 4.47841 7.81966 4.2181C7.55931 3.95775 7.55931 3.53574 7.81966 3.27539L8.67187 2.42318ZM5.35221 2.80534V1.60026C5.35221 1.2321 5.65073 0.933644 6.01888 0.933594C6.38707 0.933594 6.68555 1.23207 6.68555 1.60026V2.80534C6.68553 3.17351 6.38706 3.47201 6.01888 3.47201C5.65074 3.47195 5.35223 3.17348 5.35221 2.80534Z" fill="black"/></svg></span><span class="txt">click</span>';
            host.appendChild(cursor);
            return cursor;
        }

        function moveCursor(root, event) {
            const board = boards.get(root);
            if (!board || !board.cursor || event.pointerType !== 'mouse') return;
            if (!board.enabled) {
                hideCursor(root);
                return;
            }

            const host = board.cursor._cursorHost || root;
            const rect = host.getBoundingClientRect();
            board.cursor.style.setProperty('--sticker-cursor-x', (event.clientX - rect.left).toFixed(3) + 'px');
            board.cursor.style.setProperty('--sticker-cursor-y', (event.clientY - rect.top).toFixed(3) + 'px');
            host.classList.add('is-sticker-cursor-active');
        }

        function moveCursorByPoint(root, clientX, clientY) {
            const board = boards.get(root);
            if (!board || !board.cursor) return;
            if (!board.enabled) {
                hideCursor(root);
                return;
            }

            const host = board.cursor._cursorHost || root;
            const rect = host.getBoundingClientRect();
            const isInside = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

            if (!isInside) {
                hideCursor(root);
                return;
            }

            board.cursor.style.setProperty('--sticker-cursor-x', (clientX - rect.left).toFixed(3) + 'px');
            board.cursor.style.setProperty('--sticker-cursor-y', (clientY - rect.top).toFixed(3) + 'px');
            host.classList.add('is-sticker-cursor-active');
        }

        function hideCursor(root) {
            const board = boards.get(root);
            const host = board && board.cursor ? (board.cursor._cursorHost || root) : root;
            host.classList.remove('is-sticker-cursor-active');
        }

        function pickSet(board) {
            const available = options.sets.filter(function (set) {
                return board.recent.indexOf(set.id) === -1;
            });
            const pool = available.length ? available : options.sets;
            const set = pool[Math.floor(Math.random() * pool.length)];

            board.recent.push(set.id);
            if (board.recent.length > options.avoidRepeat) board.recent.shift();
            return set;
        }

        function layout(box, root) {
            const rect = root.getBoundingClientRect();
            const width = Number(box.dataset.bw) * Number(box.dataset.rs) * sizeFactor;
            const height = Number(box.dataset.bh) * Number(box.dataset.rs) * sizeFactor;
            const rawX = Number(box.dataset.nx) * rect.width;
            const rawY = Number(box.dataset.ny) * rect.height;
            const x = clamp(rawX, width / 2, rect.width - width / 2);
            const y = clamp(rawY, height, rect.height - height);

            box.style.width = pxToEm(width);
            box.style.height = pxToEm(height * 2);
            box.style.left = (x - width / 2) + 'px';
            box.style.top = (y - height) + 'px';
        }

        function createImage(src, fallbackSrc, onMissing) {
            const image = document.createElement('img');
            image.src = src;
            image.alt = '';
            image.setAttribute('aria-hidden', 'true');
            image.setAttribute('draggable', 'false');
            image.decoding = 'async';
            image.referrerPolicy = 'no-referrer';

            image.addEventListener('error', function handleError() {
                if (fallbackSrc && image.src !== fallbackSrc) {
                    image.removeEventListener('error', handleError);
                    image.src = fallbackSrc;
                    return;
                }
                if (typeof onMissing === 'function') onMissing();
            });

            return image;
        }

        function createFace(className, image) {
            const face = document.createElement('div');
            face.className = 'sticker ' + className;
            face.appendChild(image);
            return face;
        }

        function add(root, x, y) {
            const board = boards.get(root);
            if (!board || destroyed || !board.enabled) return null;

            while (board.items.length >= maxCount()) removeOldest(board);

            const rect = root.getBoundingClientRect();
            if (!rect.width || !rect.height) return null;

            const set = pickSet(board);
            const rotation = random(options.rotation[0], options.rotation[1]);
            const randomScale = random(options.scale[0], options.scale[1]);
            const box = document.createElement('div');

            box.className = 'sticker-box';
            box.setAttribute('aria-hidden', 'true');
            box.style.setProperty('--rot', rotation.toFixed(2) + 'deg');
            box.style.zIndex = String(++board.z);
            box.dataset.bw = String(set.width);
            box.dataset.bh = String(set.height);
            box.dataset.rs = String(randomScale);
            box.dataset.nx = String(rect.width ? x / rect.width : 0.5);
            box.dataset.ny = String(rect.height ? y / rect.height : 0.5);

            const removeMissingSticker = function () {
                removeSticker(board, box);
            };
            const backImage = createImage(set.back, set.front, removeMissingSticker);
            const frontImage = createImage(set.front, '', removeMissingSticker);

            box.appendChild(createFace('sticker-back', backImage));
            box.appendChild(createFace('sticker-front', frontImage));
            layout(box, root);
            root.appendChild(box);
            board.items.push(box);

            global.requestAnimationFrame(function () {
                if (!box.parentNode || box._removing) return;
                box.classList.add('mounted');
                box._flipTimer = global.setTimeout(function () {
                    box.classList.add('active');
                }, options.flipDelay);
            });

            return box;
        }

        function removeOldest(board) {
            if (!board.items.length) return;
            destroySticker(board.items.shift());
        }

        function removeSticker(board, box) {
            const index = board.items.indexOf(box);
            if (index !== -1) board.items.splice(index, 1);
            destroySticker(box);
        }

        function destroySticker(box) {
            if (!box || box._removing) return;
            box._removing = true;
            global.clearTimeout(box._flipTimer);
            box.classList.add('remove');
            box._removeTimer = global.setTimeout(function () {
                if (box.parentNode) box.parentNode.removeChild(box);
            }, options.removeDuration);
        }

        function clear(root) {
            const targets = root ? [root] : roots;
            targets.forEach(function (target) {
                const board = boards.get(target);
                if (!board) return;
                board.items.slice().forEach(destroySticker);
                board.items.length = 0;
                board.recent.length = 0;
            });
        }

        function initialBounds(root) {
            const rootRect = root.getBoundingClientRect();
            const initialArea = options.initialAreaSelector
                ? root.querySelector(options.initialAreaSelector)
                : null;

            if (!initialArea) {
                return { left: 0, top: 0, width: rootRect.width, height: rootRect.height };
            }

            const areaRect = initialArea.getBoundingClientRect();
            return {
                left: areaRect.left - rootRect.left,
                top: areaRect.top - rootRect.top,
                width: areaRect.width,
                height: areaRect.height
            };
        }

        function randomCoordinate(start, length, margin) {
            if (length <= margin * 2) return start + length / 2;
            return random(start + margin, start + length - margin);
        }

        function scatter(root) {
            if (!boards.has(root) || destroyed) return;

            const bounds = initialBounds(root);
            if (!bounds.width || !bounds.height) return;

            const count = Math.min(
                isMobile() ? options.initialCountMobile : options.initialCount,
                options.sets.length
            );
            const largestSize = options.sets.reduce(function (max, set) {
                return Math.max(max, set.width, set.height);
            }, 0) * sizeFactor;

            for (let index = 0; index < count; index += 1) {
                add(
                    root,
                    randomCoordinate(bounds.left, bounds.width, largestSize),
                    randomCoordinate(bounds.top, bounds.height, largestSize)
                );
            }
        }

        function reset(root) {
            global.clearTimeout(resetTimer);
            clear(root);
            resetTimer = global.setTimeout(function () {
                sizeFactor = calculateSizeFactor();
                (root ? [root] : roots).forEach(scatter);
            }, options.removeDuration);
        }

        function onPointerDown(event) {
            pointer = null;
            if (event.isPrimary === false) return;
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            if (!(event.target instanceof Element)) return;
            if (event.target.closest(options.ignoreSelector)) return;

            const root = event.target.closest(options.selector);
            if (!root || !boards.has(root)) return;
            if (!boards.get(root).enabled) return;

            pointer = {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                root: root
            };
        }

        function onPointerUp(event) {
            if (!pointer || event.pointerId !== pointer.id) return;

            const start = pointer;
            pointer = null;

            if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > options.moveSlop) return;
            if (!(event.target instanceof Element)) return;
            if (event.target.closest(options.ignoreSelector)) return;
            if (!boards.has(start.root) || !boards.get(start.root).enabled) return;

            const rect = start.root.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

            lastAddStamp = event.timeStamp || 0;
            add(start.root, x, y);
        }

        function onPointerCancel() {
            pointer = null;
        }

        function onRootClick(event) {
            if (!(event.target instanceof Element)) return;
            if (event.target.closest(options.ignoreSelector)) return;

            const root = event.currentTarget;
            const board = boards.get(root);
            if (!board || !board.enabled) return;

            if (lastAddStamp && Math.abs((event.timeStamp || 0) - lastAddStamp) < 40) {
                return;
            }

            const rect = root.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;

            lastAddStamp = event.timeStamp || 0;
            add(root, x, y);
        }

        function onResize() {
            global.clearTimeout(resizeTimer);
            resizeTimer = global.setTimeout(function () {
                sizeFactor = calculateSizeFactor();
                boards.forEach(function (board, root) {
                    while (board.items.length > maxCount()) removeOldest(board);
                    board.items.forEach(function (box) {
                        layout(box, root);
                    });
                });
            }, 200);
        }

        function onCursorMove(event) {
            pointer = {
                x: event.clientX,
                y: event.clientY,
                pointerType: event.pointerType || 'mouse'
            };
            moveCursor(event.currentTarget, event);
        }

        function onCursorLeave(event) {
            hideCursor(event.currentTarget);
        }

        document.addEventListener('pointerdown', onPointerDown, true);
        document.addEventListener('pointerup', onPointerUp, true);
        document.addEventListener('pointercancel', onPointerCancel, true);
        roots.forEach(function (root) {
            root.addEventListener('pointerenter', onCursorMove);
            root.addEventListener('pointermove', onCursorMove);
            root.addEventListener('pointerleave', onCursorLeave);
            root.addEventListener('click', onRootClick);
        });
        global.addEventListener('resize', onResize, { passive: true });
        global.addEventListener('scroll', function () {
            if (!pointer || pointer.pointerType !== 'mouse') return;

            roots.forEach(function (root) {
                moveCursorByPoint(root, pointer.x, pointer.y);
            });
        }, { passive: true });

        if (options.autoReset) roots.forEach(scatter);

        const api = {
            roots: roots,
            add: function (x, y, root) {
                return add(root || roots[0], x, y);
            },
            reset: reset,
            clear: clear,
            setEnabled: function (enabled, root) {
                const targets = root ? [root] : roots;
                targets.forEach(function (target) {
                    const board = boards.get(target);
                    if (!board) return;
                    board.enabled = !!enabled;
                    if (!board.enabled) {
                        hideCursor(target);
                    }
                });
            },
            destroy: function () {
                destroyed = true;
                pointer = null;
                document.removeEventListener('pointerdown', onPointerDown, true);
                document.removeEventListener('pointerup', onPointerUp, true);
                document.removeEventListener('pointercancel', onPointerCancel, true);
                global.removeEventListener('resize', onResize);
                global.clearTimeout(resizeTimer);
                global.clearTimeout(resetTimer);

                roots.forEach(function (root) {
                    root.removeEventListener('pointerenter', onCursorMove);
                    root.removeEventListener('pointermove', onCursorMove);
                    root.removeEventListener('pointerleave', onCursorLeave);
                    root.removeEventListener('click', onRootClick);
                    hideCursor(root);
                    Array.prototype.slice.call(root.children).forEach(function (child) {
                        if (!child.classList.contains('sticker-box')) return;
                        global.clearTimeout(child._flipTimer);
                        global.clearTimeout(child._removeTimer);
                        root.removeChild(child);
                    });

                    const board = boards.get(root);
                    if (board && board.cursor && board.cursor.parentNode) {
                        board.cursor.parentNode.removeChild(board.cursor);
                    }
                });

                boards.clear();
                activeApi = null;
                if (global.portfolioStickerBoard === api) global.portfolioStickerBoard = null;
                if (global.resetPortfolioStickers === api.reset) global.resetPortfolioStickers = null;
            }
        };

        activeApi = api;
        global.portfolioStickerBoard = api;
        global.resetPortfolioStickers = api.reset;
        return api;
    }

    function setupCharacterStickerEls() {
        const root = document.querySelector('.character_sect .character_cont');
        if (!root) return;

        function flipDelayFromMotionDelay(motionDelay) {
            const seconds = parseFloat(motionDelay);
            if (Number.isNaN(seconds)) return '0.3s';
            return Math.max(0, seconds - 0.75).toFixed(2) + 's';
        }

        function createCharacterImage(src) {
            const image = document.createElement('img');
            image.src = src;
            image.alt = '';
            image.setAttribute('aria-hidden', 'true');
            image.setAttribute('draggable', 'false');
            image.decoding = 'async';
            image.referrerPolicy = 'no-referrer';
            return image;
        }

        function replayStickerEnterTransition(item) {
            const back = item.querySelector('.sticker-back');
            const front = item.querySelector('.sticker-front');
            const backImage = back ? back.querySelector('img') : null;
            const frontImage = front ? front.querySelector('img') : null;
            if (!back || !front || !backImage || !frontImage) return;

            global.clearTimeout(item._replayStickerEnterTimer);
            item.classList.remove('is-motion-ready');

            back.style.transform = 'translateY(0)';
            front.style.transform = 'translateY(0)';
            backImage.style.transform = 'translateY(0)';
            frontImage.style.transform = 'translateY(100%)';

            item.offsetHeight;

            item._replayStickerEnterTimer = global.setTimeout(function () {
                if (!root.classList.contains('active')) return;

                back.style.removeProperty('transform');
                front.style.removeProperty('transform');
                backImage.style.removeProperty('transform');
                frontImage.style.removeProperty('transform');
            }, 34);
        }

        CHARACTER_EL_SETS.forEach(function (set) {
            const item = root.querySelector(set.selector);
            if (!item || item.dataset.characterStickerReady === 'Y') return;

            const motion = document.createElement('div');
            const box = document.createElement('div');
            const back = document.createElement('div');
            const front = document.createElement('div');

            motion.className = 'el-sticker-motion';
            box.className = 'character-sticker-box';
            back.className = 'sticker sticker-back';
            front.className = 'sticker sticker-front';
            back.appendChild(createCharacterImage(set.back));
            front.appendChild(createCharacterImage(set.front));
            box.appendChild(back);
            box.appendChild(front);
            motion.appendChild(box);

            item.textContent = '';
            item.appendChild(motion);
            item.classList.add('character-sticker');
            item.dataset.characterStickerReady = 'Y';
            item.dataset.stickerId = set.id;
            item.style.setProperty('--el-motion-delay', set.motionDelay);
            item.style.setProperty('--el-flip-delay', flipDelayFromMotionDelay(set.motionDelay));
            item.style.setProperty('--el-ratio', set.width + ' / ' + (set.height * 2));

            if (root.classList.contains('active')) {
                replayStickerEnterTransition(item);
            }
        });

        function enableMotionAfterStickerTransition(item) {
            const front = item.querySelector('.sticker-front');
            if (!front) {
                item.classList.add('is-motion-ready');
                return;
            }

            global.clearTimeout(item._motionReadyTimer);
            front.addEventListener('transitionend', function handleTransitionEnd(event) {
                if (event.propertyName && event.propertyName !== 'transform') return;
                front.removeEventListener('transitionend', handleTransitionEnd);
                global.clearTimeout(item._motionReadyTimer);
                if (!root.classList.contains('active')) return;
                item.classList.add('is-motion-ready');
            });
            item._motionReadyTimer = global.setTimeout(function () {
                if (!root.classList.contains('active')) return;
                item.classList.add('is-motion-ready');
            }, 3000);
        }

        function syncMotionReadyState() {
            const active = root.classList.contains('active');
            root.querySelectorAll('.el.character-sticker').forEach(function (item) {
                if (!active) {
                    global.clearTimeout(item._motionReadyTimer);
                    global.clearTimeout(item._replayStickerEnterTimer);
                    item.classList.remove('is-motion-ready');
                    return;
                }
                if (!item.classList.contains('is-motion-ready')) {
                    enableMotionAfterStickerTransition(item);
                }
            });
        }

        syncMotionReadyState();

        const observer = new MutationObserver(syncMotionReadyState);
        observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    }

    function bootstrapPortfolioStickerEffect() {
        const root = document.querySelector('.character_wrap[data-area="sticker"], .character_wrap [data-area="sticker"], .portfolio_sect[data-area="sticker"], .portfolio_sect [data-area="sticker"]');
        if (!root) return;
        const characterCont = root.querySelector('.character_cont');

        setupCharacterStickerEls();

        if (!root.hasAttribute('data-area')) {
            root.setAttribute('data-area', 'sticker');
        }

        const api = initPortfolioStickerEffect({
            autoReset: false
        });

        if (api && typeof api.setEnabled === 'function') {
            api.setEnabled(!!(characterCont && characterCont.classList.contains('active')), root);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrapPortfolioStickerEffect, { once: true });
    } else {
        bootstrapPortfolioStickerEffect();
    }

    global.initPortfolioStickerEffect = initPortfolioStickerEffect;
})(window);
