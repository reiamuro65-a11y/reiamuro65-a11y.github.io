

















(function () {
	'use strict';

	






	var LOG_ON = /[?&]log=1\b/.test(window.location.search);

	











	var TASKS = {
		doc: 30,
		model: 35,
		decode: 10,
		warm: 25,
		desk: 20,
		 
		 
		glow: 5,
	};

	 
	var HARD_TIMEOUT_MS = 30000;
	 
	var MIN_DURATION = 0.6;

	var tasks = {};
	for (var k in TASKS) tasks[k] = { weight: TASKS[k], p: 0, settled: false, creep: null };

	var shown = 0;             
	var complete = false;
	var callbacks = [];
	var startedAt = now();
	var rafId = null;
	var dom = null;           // { root, fill, pct, bar, shutter, frontLogo }

	function now() {
		return (window.performance && performance.now) ? performance.now() : Date.now();
	}

	function clamp01(v) {
		return v < 0 ? 0 : v > 1 ? 1 : v;
	}

	 
	function target() {
		var sum = 0, total = 0;
		for (var n in tasks) {
			var t = tasks[n];
			if (!t.weight) continue;
			total += t.weight;
			sum += t.weight * (t.settled ? 1 : clamp01(t.p));
		}
		return total > 0 ? sum / total : 1;
	}

	function allSettled() {
		for (var n in tasks) {
			if (tasks[n].weight && !tasks[n].settled) return false;
		}
		return true;
	}

	



	var api = {
		 
		set: function (name, p) {
			var t = tasks[name];
			if (!t || t.settled) return;
			p = clamp01(p);
			if (p > t.p) t.p = p;
		},

		 
		done: function (name) {
			var t = tasks[name];
			if (!t || t.settled) return;
			t.creep = null;
			t.p = 1;
			t.settled = true;
			t.settledAt = now() - startedAt;    
		},

		




		skip: function (name) {
			var t = tasks[name];
			if (!t || t.settled) return;
			t.creep = null;
			t.weight = 0;
			t.settled = true;
			t.settledAt = now() - startedAt;
			t.skipped = true;
		},

		



		creep: function (name, seconds, cap) {
			var t = tasks[name];
			if (!t || t.settled) return;
			t.creep = {
				at: now(), ms: Math.max(1, seconds * 1000),
				from: t.p, cap: cap === undefined ? 0.9 : cap,
			};
		},

		 
		onComplete: function (cb) {
			if (typeof cb !== 'function') return;
			if (complete) { cb(); return; }
			callbacks.push(cb);
		},

		isComplete: function () { return complete; },

		 
		get progress() { return shown; },

		 
		pending: function () {
			var out = [];
			for (var n in tasks) if (tasks[n].weight && !tasks[n].settled) out.push(n + ':' + tasks[n].p.toFixed(2));
			return out;
		},
	};

	window.introLoader = api;

	



	 
	document.documentElement.classList.add('intro-loading');

	function bindDom() {
		var root = document.querySelector('[data-intro-loading]');
		var shutter = root && root.closest ? root.closest('.intro_shutter') : document.querySelector('.intro_shutter');
		var frontLogo = shutter ? shutter.querySelector('.loading_logo.front') : null;
		if (!root && !frontLogo) return;
		dom = {
			root: root,
			fill: root ? root.querySelector('[data-intro-loading-fill]') : null,
			pct: root ? root.querySelector('[data-intro-loading-pct]') : null,
			bar: root ? root.querySelector('[role="progressbar"]') : null,
			shutter: shutter,
			frontLogo: frontLogo,
		};
		 
		 
		root.classList.add('is-ready');
	}

	function paint() {
		if (!dom) return;
		var pct = Math.round(shown * 100);
		if (dom.fill) dom.fill.style.width = (shown * 100).toFixed(2) + '%';
		if (dom.pct) dom.pct.textContent = pct + '%';
		if (dom.bar) dom.bar.setAttribute('aria-valuenow', String(pct));
		if (dom.frontLogo) dom.frontLogo.style.clipPath = 'inset(0 ' + ((1 - shown) * 100).toFixed(2) + '% 0 0)';
	}

	var lastTick = now();

	function tick() {
		rafId = window.requestAnimationFrame(tick);

		 
		 
		if (!dom) bindDom();

		var t = now();
		var dt = Math.min((t - lastTick) / 1000, 0.1);
		lastTick = t;

		 
		for (var n in tasks) {
			var task = tasks[n];
			if (!task.creep || task.settled) continue;
			var c = task.creep;
			var r = c.from + clamp01((t - c.at) / c.ms) * Math.max(0, c.cap - c.from);
			if (r > task.p) task.p = r;
		}

		 
		if (!complete && t - startedAt > HARD_TIMEOUT_MS) {
			var stuck = api.pending();
			if (stuck.length) console.warn('[intro-loader] 加载超时 — 忽略剩余任务继续执行：', stuck);
			for (var m in tasks) { tasks[m].creep = null; tasks[m].p = 1; tasks[m].settled = true; }
		}

		 
		var goal = target();
		if (goal > shown) shown = Math.min(goal, shown + dt / MIN_DURATION);
		paint();

		if (!complete && allSettled() && shown >= 0.9995) {
			shown = 1;
			paint();
			finish();
		}
	}

	function finish() {
		complete = true;
		if (rafId) { window.cancelAnimationFrame(rafId); rafId = null; }

		 
		 
		 
		try {
			var lines = ['[intro-loader] 首屏加载耗时拆解(ms)'];
			lines.push('  总耗时(至快门)  ' + Math.round(now() - startedAt));
			lines.push('  ── 快门任务完成时刻 ──');
			var rows = [];
			for (var tn in tasks) {
				var tt = tasks[tn];
				var v = tt.skipped ? '(已跳过)' : (tt.settledAt !== undefined ? Math.round(tt.settledAt) : '(超时)');
				rows.push({ 阶段: tn, 耗时ms: v });
				lines.push('  ' + (tn + '      ').slice(0, 7) + String(v).padStart(8));
			}
			lines.push('  ── 资源里程碑 ──');
			var nav = performance.getEntriesByType('navigation')[0];
			if (nav) {
				lines.push('  DOMContentLoaded ' + String(Math.round(nav.domContentLoadedEventEnd)).padStart(6));
				lines.push('  window.load      ' + String(nav.loadEventEnd ? Math.round(nav.loadEventEnd) : 0).padStart(6));
			}
			performance.getEntriesByType('resource').forEach(function (e) {
				if (/\.glb|basis_transcoder\.wasm|draco_decoder\.wasm|three\.module|robot-3d\.core/.test(e.name)) {
					var nm = e.name.split('/').pop().split('?')[0];
					lines.push('  ' + (nm + '                              ').slice(0, 32)
						+ String(Math.round(e.startTime)).padStart(6) + ' → ' + String(Math.round(e.responseEnd)).padStart(6));
				}
			});
			window.__introTiming = { tasks: rows, total: Math.round(now() - startedAt) };
			if (LOG_ON) console.info(lines.join('\n'));
		} catch (e) { }

		document.documentElement.classList.remove('intro-loading');
		document.documentElement.classList.add('intro-loaded');
		if (dom) {
			if (dom.shutter) dom.shutter.classList.add('is-loaded');
			if (dom.bar) dom.bar.setAttribute('aria-valuenow', '100');
			if (dom.root) dom.root.setAttribute('aria-hidden', 'true');
			if (dom.frontLogo) dom.frontLogo.style.clipPath = 'inset(0 0% 0 0)';
		}

		var list = callbacks;
		callbacks = [];
		for (var i = 0; i < list.length; i++) {
			try { list[i](); } catch (e) { console.warn('[intro-loader] onComplete 回调错误：', e); }
		}
	}

	rafId = window.requestAnimationFrame(tick);

	








	 
	api.creep('doc', 6, 0.85);
	 
	var docCreep2 = window.setTimeout(function () { api.creep('doc', 40, 0.97); }, 6200);

	function onDocDone() {
		window.clearTimeout(docCreep2);
		window.clearTimeout(docSoft);
		api.done('doc');
	}

	 
	 
	var DOC_SOFT_TIMEOUT_MS = 15000;
	var docSoft = window.setTimeout(function () {
		console.warn('[intro-loader] window.load 在 ' + (DOC_SOFT_TIMEOUT_MS / 1000) +
			' 秒内未触发，视为文档加载完成（可能有外部脚本无响应）。');
		onDocDone();
	}, DOC_SOFT_TIMEOUT_MS);

	if (document.readyState === 'complete') {
		onDocDone();
	} else {
		window.addEventListener('load', onDocDone, { once: true });
	}

	



	 
	 
	var robotClaimed = false;
	api.claimRobot = function () { robotClaimed = true; };
	api.skipRobot = function () {
		robotClaimed = true;
		api.skip('model');
		api.skip('decode');
		api.skip('warm');
		 
		api.skip('desk');
		api.skip('glow');
	};

	function settleRobot() {
		if (!robotClaimed) {
			console.warn('[intro-loader] 未收到 3D 覆盖层信号，已从加载进度中排除。');
			api.skipRobot();
		}
	}

	function onDomReady() {
		if (!dom) bindDom();
		settleRobot();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', onDomReady, { once: true });
	} else {
		onDomReady();
	}
})();
