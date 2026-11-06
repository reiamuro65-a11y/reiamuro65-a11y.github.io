 
function alertLayer(msg, title, callback) {
	let targetBody = $('body');
	if ($('#layout_header').length == 0) {
		targetBody = $(parent.document.body);
	}

	const rndStr = generateRandomString(10);

	let html = `
    <div class="msg_layer" id="alert_layer_${rndStr}">
        <div class="modal_wrap">
            <div class="scroll_box">
                <div class="modal_cont">
                    <div class="cont">
                        <p class="alertMessage_${rndStr}"></p>
                        <div class="btn_wrap">
                            <button class="btm_btn small" id="alertBtn_${rndStr}">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

	targetBody.append(html);

	const modal = targetBody.find('#alert_layer_' + rndStr);
	const modalMessage = targetBody.find('.alertMessage_' + rndStr);

	 
	//$(modalTitle).text(title);
	modalMessage.html(msg);

	const alertBtn = targetBody.find('#alertBtn_' + rndStr);
	modal.addClass('open');

	 
	document.activeElement.blur();

	alertBtn.on('click', function () {
		targetBody.find('#alert_layer_' + rndStr).remove();
		if (callback) callback();
	});

	 
	$(document).on('keydown.alertLayer', function (e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			const topModal = $('.msg_layer').last();
			if (topModal.length) {
				topModal.find('.btm_btn').click();
			}
		}
	});

	 
	alertBtn.on('click', function () {
		$(document).off('keydown.alertLayer');
	});
}

function confirmLayer(message, title, yesCallback, noCallback) {
	let targetBody = $('body');
	if ($('#layout_header').length == 0) {
		targetBody = $(parent.document.body);
	}

	const rndStr = generateRandomString(10);

	let html = `
    <div class="msg_layer" id="confirm_layer_${rndStr}">
        <div class="modal_wrap">
            <div class="scroll_box">
                <div class="modal_cont">
                    <div class="cont">
                        <p class="confirmMessage_${rndStr}"></p>
                        <div class="btn_wrap">
                            <button class="btm_btn small" id="confirmBtn_${rndStr}">确定</button>
                            <button class="btm_btn small wh" id="cancelBtn_${rndStr}" >取消</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

	targetBody.append(html);

	 
	const modal = targetBody.find('#confirm_layer_' + rndStr);
	const modalTitle = targetBody.find('.confirmTitle_' + rndStr);
	const modalMessage = targetBody.find('.confirmMessage_' + rndStr);
	const confirmBtn = targetBody.find('#confirmBtn_' + rndStr);
	const cancelBtn = targetBody.find('#cancelBtn_' + rndStr);

	if (title == '') {
		targetBody.find('#confirm_layer_' + rndStr + ' .tit_wrap').hide();
	} else {
		targetBody.find('#confirm_layer' + rndStr + ' .tit_wrap').show();
	}
	 
	modalTitle.text(title);
	modalMessage.html(message);

	 
	targetBody.find('#confirm_layer_' + rndStr).addClass('open');

	 
	document.activeElement.blur();


	 
	confirmBtn.on('click', function () {
		targetBody.find('#confirm_layer_' + rndStr).remove();
		if (yesCallback) yesCallback();
		$(document).off('keydown.confirmLayer');
	});

	 
	cancelBtn.on('click', function () {
		targetBody.find('#confirm_layer_' + rndStr).remove();
		if (noCallback) noCallback();
		$(document).off('keydown.confirmLayer');
	});


	 
	$(document).on('keydown.confirmLayer', function (e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			const topModal = $('.msg_layer').last();
			if (topModal.length) {
				topModal.find('#confirmBtn_' + rndStr).click();
			}
		}
	});
	






	 
	$(window).on('click', function (event) {
		if (event.target == modal[0]) {
			targetBody.find('#confirm_layer_' + rndStr).remove();
			if (noCallback) noCallback();
		}
	});
}

 
 
function promptLayer(message, placeholder, yesCallback, noCallback) {
	let targetBody = $('body');
	if ($('#layout_header').length == 0) {
		targetBody = $(parent.document.body);
	}

	const rndStr = generateRandomString(10);

	let html = `
    <div class="msg_layer" id="prompt_layer_${rndStr}">
        <div class="modal_wrap">
            <div class="scroll_box">
                <div class="modal_cont">
                    <div class="cont">
                        <p class="promptMessage_${rndStr}"></p>
                        <input type="text" class="prompt_input" id="promptInput_${rndStr}" />
                        <div class="btn_wrap">
                            <button class="btm_btn small" id="promptOkBtn_${rndStr}">确定</button>
                            <button class="btm_btn small wh" id="promptCancelBtn_${rndStr}">取消</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

	targetBody.append(html);

	const modal = targetBody.find('#prompt_layer_' + rndStr);
	const input = targetBody.find('#promptInput_' + rndStr);

	targetBody.find('.promptMessage_' + rndStr).html(message);
	if (placeholder) input.attr('placeholder', placeholder);

	modal.addClass('open');
	 
	setTimeout(function () { input.trigger('focus'); }, 50);
	setTimeout(function () {
		if (document.activeElement !== input.get(0)) input.trigger('focus');
	}, 300);

	function closeLayer() {
		modal.remove();
		$(document).off('keydown.promptLayer');
	}

	targetBody.find('#promptOkBtn_' + rndStr).on('click', function () {
		const val = String(input.val() || '').trim();
		closeLayer();
		if (yesCallback) yesCallback(val);
	});

	targetBody.find('#promptCancelBtn_' + rndStr).on('click', function () {
		closeLayer();
		if (noCallback) noCallback();
	});

	 
	$(document).on('keydown.promptLayer', function (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			targetBody.find('#promptOkBtn_' + rndStr).click();
		}
	});
}

var loadingYn = 'Y';
var subMenuViewYn = 'N';

function copyLink() {
	var t = document.createElement("textarea");
	document.body.appendChild(t);
	t.value = '<?=$curUrl?>';
	t.select();
	document.execCommand('copy');
	document.body.removeChild(t);
	alert('已复制到剪贴板');
}

function scrollPage(page, lang) {
	$url = '';
	if (lang != '') {
		$url = '/' + lang;
	}
	location.href = $url + "/?p=" + page + "&sc=" + scrollX;
}

function getCookie(strName) {
	var strArg = new String(strName + "=");
	var nArgLen, nCookieLen, nEnd;
	var i = 0, j;
	nArgLen = strArg.length;
	nCookieLen = document.cookie.length;
	if (nCookieLen > 0) {
		while (i < nCookieLen) {
			j = i + nArgLen;
			if (document.cookie.substring(i, j) == strArg) {
				nEnd = document.cookie.indexOf(";", j);
				if (nEnd == -1) nEnd = document.cookie.length;
				return unescape(document.cookie.substring(j, nEnd));
			}
			i = document.cookie.indexOf(" ", i) + 1;
			if (i == 0) break;
		}
	}
	return ("");
}

function setCookie(name, value, expiredays) {
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + expiredays);
	document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function deleteCookie(cookieName) {
	var expireDate = new Date();
	expireDate.setDate(expireDate.getDate() - 1);
	document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

function fnCheckPassword(upw) {
	regexp = /^[a-zA-Z0-9]{6,20}$/;
	if (!regexp.test(upw)) {
		alert('密码需为 6~12 位数字与字母的组合。');
		return;
	}

	var chk_num = $('#' + upw).val().search(/[0-9]/g);
	var chk_eng = $('#' + upw).val().search(/[a-z]/ig);
	if (chk_num < 0 || chk_eng < 0) {
		alert('密码需同时包含数字和字母。');
		$('#' + upw).val('');
		$('#' + upw).focus();
		return;
	}

	if (/(\w)\1\1\1/.test($('#' + upw).val())) {
		alert('密码中同一字符不能连续出现 4 次以上。');
		$('#' + upw).val('');
		$('#' + upw).focus();
		return;
	}
	return;
}

function CheckPassWord(password) {
	const regex1 = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()\[\]{};:,.<>\/?|_+=\-])[a-zA-Z\d!@#$%^&*()\[\]{};:,.<>\/?|_+=\-]{8,}$/;
	if (regex1.test(password)) {
		const regex2 = /^[^!@#$%^&*()\[\]{};:,.<>\/?|]+$/;
		if (regex2.test(password)) {
			alert('输入了不可用的特殊字符。\n请检查密码。');
			return false;
		} else {
			return true;
		}
	} else {
		alert('密码需包含字母、数字和特殊字符，且不少于 8 位。');
		return false;
	}
}

 
$(document).on("input", ".phoneNumberFormat", function() {
    let value = $(this).val().replace(/[^0-9]/g, "");

	 
	value = value.slice(0, 11);

	if (value.length > 3 && value.length < 8) {
		value = value.replace(/(\d{2,3})(\d{1,4})/, "$1-$2");
	} else if (value.length >= 8) {
		value = value.replace(/(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3");
	}

	$(this).val(value);
});

 
$(document).on("keyup", ".emailFormat", function () {
	if (!(event.keyCode >= 37 && event.keyCode <= 40)) {
		var inputVal = $(this).val();
		$(this).val(inputVal.replace(/[^a-z0-9@_.-]/gi, ''));
	}
});

 
$(document).on("keyup", ".numberFormat", function () {
	$(this).val($(this).val().replace(/[^0-9]/g, ""));
});





const ckEditors = {};

function isFunction(func) {
	return typeof func === "function";
}
 
function uploadAdapterPlugin(editor) {
	editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
		return new uploadAdapter(loader);
	};
}

 
function parseYoutubeVideoId(url) {
	if (!url) return '';
	url = String(url).trim();
	var m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
	if (m) return m[1];
	if (/^[A-Za-z0-9_-]{11}$/.test(url)) return url;
	return '';
}

 
function resolveYoutubeThumb(videoId, callback) {
	var maxres = 'https://i.ytimg.com/vi/' + videoId + '/maxresdefault.jpg';
	var fallback = 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg';
	var img = new Image();
	img.onload = function () { callback(img.naturalWidth > 120 ? maxres : fallback); };
	img.onerror = function () { callback(fallback); };
	img.src = maxres;
}

 
 
function youtubeButtonPlugin(editor) {
	editor.ui.componentFactory.add('youtubeButton', locale => {
		 
		const sampleButton = editor.ui.componentFactory.create('bold');
		const ButtonView = sampleButton.constructor;
		sampleButton.destroy();

		const button = new ButtonView(locale);

		button.set({
			label: '插入视频',
			icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M18.3 5.4a2.2 2.2 0 0 0-1.55-1.56C15.38 3.47 10 3.47 10 3.47s-5.38 0-6.75.37A2.2 2.2 0 0 0 1.7 5.4 23 23 0 0 0 1.33 10a23 23 0 0 0 .37 4.6 2.2 2.2 0 0 0 1.55 1.56c1.37.37 6.75.37 6.75.37s5.38 0 6.75-.37a2.2 2.2 0 0 0 1.55-1.56A23 23 0 0 0 18.67 10a23 23 0 0 0-.37-4.6zM8.27 12.6V7.4L12.8 10l-4.53 2.6z"/></svg>',
			tooltip: true,
			withText: false
		});

		button.on('execute', () => {
			promptLayer('请输入视频地址。', 'https://www.youtube.com/watch?v=...', function (url) {
				if (url === '') return;

				const videoId = parseYoutubeVideoId(url);
				if (!videoId) {
					alertLayer('无法识别该视频地址。<br>请填入 watch?v= / youtu.be / shorts / embed 形式的地址。');
					return;
				}

				insertYoutubeFacade(videoId);
			});
		});

		function insertYoutubeFacade(videoId) {
			resolveYoutubeThumb(videoId, function (thumbUrl) {
				 
				const html =
					'<div class="prd_ytb" data-ytid="' + videoId + '">' +
					'<img class="prd_ytb_thumb" src="' + thumbUrl + '" alt="视频封面">' +
					'</div><p>&nbsp;</p>';
				const viewFragment = editor.data.processor.toView(html);
				const modelFragment = editor.data.toModel(viewFragment);
				editor.model.insertContent(modelFragment);
				editor.editing.view.focus();
			});
		}

		return button;
	});
}









 
var PRD_SWIPER_ASSETS = {
	js:    '/inc/js/swiper.js',
	css:   '/inc/css/swiper.min.css',
	style: '/inc/css/prd-swiper.css'
};

 
 
var SWIPER_BTN_ICONS = {
	'1': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 53" fill="none"><rect opacity="0.3" y="31" width="22" height="22" rx="5" fill="#000000"/><rect opacity="0.3" x="26" y="31" width="22" height="22" rx="5" fill="#000000"/><rect opacity="0.3" x="52" y="31" width="22" height="22" rx="5" fill="#000000"/><rect width="74" height="27" rx="4" fill="#000000"/></svg>',
	'2': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 53" fill="none"><rect y="31" width="22" height="22" rx="5" fill="#000000"/><rect x="26" y="31" width="22" height="22" rx="5" fill="#000000"/><rect x="52" y="31" width="22" height="22" rx="5" fill="#000000"/><rect width="74" height="27" rx="4" fill="#000000" fill-opacity="0.3"/></svg>'
};

 
function parsePrdSwiperImgs(boxEl) {
	var imgs = [];
	boxEl.querySelectorAll('img').forEach(function (im) {
		var s = im.getAttribute('src');
		if (s) imgs.push(s);
	});
	return imgs.filter(function (s) { return typeof s === 'string' && s !== ''; });
}

function resolvePrdSwiperType(boxEl, type) {
	if (type === '2' || type === 2) return '2';
	if (type === '1' || type === 1) return '1';
	if (boxEl.getAttribute('data-type') === '2') return '2';
	return boxEl.classList.contains('prd_swiper_type2') ? '2' : '1';
}

 
 
function getPrdSwiperOptions(boxEl, multi, type) {
	return {
		loop: multi,
		speed: 500,
		slidesPerView: type,
		spaceBetween: type === '2' ? 10 : 0,
		centeredSlides: type === '2' ? true : false,
		observer: true,
		observeParents: true,
		pagination: multi ? { el: boxEl.querySelector('.prd_swiper_pagi'), clickable: true } : false,
		navigation: multi ? { nextEl: boxEl.querySelector('.prd_swiper_next'), prevEl: boxEl.querySelector('.prd_swiper_prev') } : false
	};
}

 
function buildPrdSwiper(boxEl, imgs, type) {
	if (typeof Swiper === 'undefined' || !boxEl) return null;
	imgs = (imgs || []).filter(function (s) { return s; });
	if (!imgs.length) return null;
	var t = resolvePrdSwiperType(boxEl, type), multi = imgs.length > 1, slides = '';
	for (var i = 0; i < imgs.length; i++) {
		slides += '<div class="swiper-slide"><img class="prd_swiper_img" src="' + imgs[i] + '" alt="作品图片 ' + (i + 1) + '"></div>';
	}
	var pagi = multi ? '<div class="prd_swiper_pagi swiper-pagination"></div>' : '';
	var nav  = multi ? '<div class="prd_swiper_prev swiper_prev"></div><div class="prd_swiper_next swiper_next"></div>' : '';
	boxEl.className = 'prd_swiper prd_swiper_type' + t + ' swiper-container is-swiper-init';
	boxEl.innerHTML = '<div class="swiper-wrapper">' + slides + '</div>' + pagi + nav;
	return new Swiper(boxEl, getPrdSwiperOptions(boxEl, multi, t));
}

 
var _prdSwiperAssetState = 'idle', _prdSwiperAssetCbs = [];
function ensurePrdSwiperAssets(cb) {
	[PRD_SWIPER_ASSETS.css, PRD_SWIPER_ASSETS.style].forEach(function (href) {
		if (document.querySelector('link[data-prd-swiper="' + href + '"]')) return;
		var l = document.createElement('link');
		l.rel = 'stylesheet';
		l.href = href;
		l.setAttribute('data-prd-swiper', href);
		document.head.appendChild(l);
	});
	if (typeof Swiper !== 'undefined') { cb(); return; }    
	_prdSwiperAssetCbs.push(cb);
	if (_prdSwiperAssetState === 'loading') return;
	_prdSwiperAssetState = 'loading';
	var s = document.createElement('script');
	s.src = PRD_SWIPER_ASSETS.js;
	s.onload = function () {
		_prdSwiperAssetState = 'ready';
		_prdSwiperAssetCbs.forEach(function (c) { c(); });
		_prdSwiperAssetCbs = [];
	};
	document.head.appendChild(s);
}

 
function collectViewImgSrcs(viewEl) {
	var out = [];
	if (!viewEl || typeof viewEl.getChildren !== 'function') return out;
	for (var it = viewEl.getChildren(), step = it.next(); !step.done; step = it.next()) {
		var child = step.value;
		if (!child) continue;
		if (child.is && child.is('element', 'img')) {
			var s = child.getAttribute('src');
			if (s) out.push(s);
		} else if (child.getChildren) {
			out = out.concat(collectViewImgSrcs(child));
		}
	}
	return out;
}

 
function swiperWidgetPlugin(editor) {
	editor.model.schema.register('prdSwiper', {
		isBlock: true,
		isContent: true,                  
		allowWhere: '$block',
		allowAttributes: ['imgs', 'dataCount', 'dataType', 'fileRef']
	});

	 
	editor.conversion.for('upcast').elementToElement({
		view: { name: 'div', classes: 'prd_swiper' },
		model: function (viewEl, api) {
			var t = viewEl.getAttribute('data-type');
			if (t !== '2') t = (viewEl.hasClass && viewEl.hasClass('prd_swiper_type2')) ? '2' : '1';
			var imgs = collectViewImgSrcs(viewEl);
			return api.writer.createElement('prdSwiper', {
				imgs: imgs,
				dataType: t,
				dataCount: String(imgs.length),
				fileRef: viewEl.getAttribute('data-file-ref') || ''
			});
		},
		converterPriority: 'high'         
	});

	 
	editor.conversion.for('dataDowncast').elementToElement({
		model: 'prdSwiper',
		view: function (modelEl, api) {
			var w = api.writer;
			var t = modelEl.getAttribute('dataType') === '2' ? '2' : '1';
			var arr = modelEl.getAttribute('imgs') || [];
			var ref = String(modelEl.getAttribute('fileRef') || '');
			var attrs = { 'class': 'prd_swiper prd_swiper_type' + t, 'data-type': t, 'data-count': String(arr.length) };
			if (ref) attrs['data-file-ref'] = ref;
			var div = w.createContainerElement('div', attrs);
			for (var i = 0; i < arr.length; i++) {
				w.insert(
					w.createPositionAt(div, 'end'),
					w.createEmptyElement('img', { 'class': 'prd_swiper_img', src: arr[i], alt: '作品图片 ' + (i + 1) })
				);
			}
			return div;
		},
		converterPriority: 'high'
	});

	 
	editor.conversion.for('editingDowncast').elementToElement({
		model: 'prdSwiper',
		view: function (modelEl, api) {
			var w = api.writer;
			var t = modelEl.getAttribute('dataType') === '2' ? '2' : '1';
			var arr = modelEl.getAttribute('imgs') || [];
			var ref = String(modelEl.getAttribute('fileRef') || '');
			return w.createRawElement('div', {
				 
				'class': 'prd_swiper prd_swiper_type' + t + ' swiper-container swiper-container-horizontal is-swiper-init',
				'data-type': t,
				'data-file-ref': ref,
				'data-count': String(arr.length)
			}, function (domEl) {
				if (arr.length && !domEl.querySelector('.swiper-wrapper')) {   
					var s = '';
					for (var i = 0; i < arr.length; i++) {
						s += '<div class="swiper-slide"><img class="prd_swiper_img" src="' + arr[i] + '" alt="作品图片 ' + (i + 1) + '"></div>';
					}
					domEl.innerHTML = '<div class="swiper-wrapper">' + s + '</div>';
				}
				addSwiperEditBtn(domEl, editor, modelEl, t);
				ensurePrdSwiperAssets(function () {
					buildPrdSwiper(domEl, arr, t);
					addSwiperEditBtn(domEl, editor, modelEl, t);
				});
			});
		},
		converterPriority: 'high'
	});
}

 
function registerSwiperButton(editor, name, label, type) {
	editor.ui.componentFactory.add(name, function (locale) {
		var sample = editor.ui.componentFactory.create('bold');
		var ButtonView = sample.constructor;
		sample.destroy();
		var b = new ButtonView(locale);
		b.set({ label: label, icon: SWIPER_BTN_ICONS[type], tooltip: true, withText: false });
		b.on('execute', function () {                           
			_swiperEditState = { editor: editor, model: null, type: type };
			openAdmModal('', 'swiperImageEdit', 'type=' + type + '&fileRef=0');
		});
		return b;
	});
}

function swiperButtonPlugin(editor) {
	registerSwiperButton(editor, 'swiperButton',  '插入轮播图集（样式 1）', '1');
	registerSwiperButton(editor, 'swiperButton2', '插入轮播图集（样式 2）', '2');
}

 
var _swiperEditState = null;

function insertSwiperFacade(editor, type, imgs, fileRef) {
	editor.model.change(function (w) {
		var el = w.createElement('prdSwiper', {
			imgs: imgs,
			dataType: (type === '2' ? '2' : '1'),
			fileRef: String(fileRef || ''),
			dataCount: String(imgs.length)
		});
		editor.model.insertContent(el);
	});
	editor.editing.view.focus();
}

function applySwiperEdit(fileRef, imgs) {
	var st = _swiperEditState;
	_swiperEditState = null;
	if (!st || !st.editor) return;
	imgs = (imgs || []).filter(function (s) { return s; });
	if (st.model) {                                   
		var ed = st.editor;
		if (!st.model.parent) return;
		if (!imgs.length) { ed.model.change(function (w) { w.remove(st.model); }); return; }
		var t = st.model.getAttribute('dataType') === '2' ? '2' : '1';
		ed.model.change(function (w) {                
			var pos = w.createPositionBefore(st.model);
			w.insert(w.createElement('prdSwiper', {
				imgs: imgs, fileRef: String(fileRef || ''), dataType: t, dataCount: String(imgs.length)
			}), pos);
			w.remove(st.model);
		});
		return;
	}
	if (imgs.length) insertSwiperFacade(st.editor, st.type, imgs, fileRef);   
}

 
function addSwiperEditBtn(domEl, editor, modelEl, type) {
	if (!domEl || domEl.querySelector('.prd_swiper_tools')) return;
	function mk(cls, label, onClick) {
		var b = document.createElement('button');
		b.type = 'button';
		b.className = cls;
		b.setAttribute('contenteditable', 'false');
		b.textContent = label;
		 
		['mousedown', 'pointerdown', 'touchstart'].forEach(function (ev) {
			b.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); });
		});
		b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); onClick(); });
		return b;
	}
	var tools = document.createElement('div');
	tools.className = 'prd_swiper_tools';
	tools.setAttribute('contenteditable', 'false');
	tools.appendChild(mk('prd_swiper_edit_btn', '编辑图片', function () {
		_swiperEditState = { editor: editor, model: modelEl, type: type };
		openAdmModal('', 'swiperImageEdit', 'type=' + type + '&fileRef=' + (modelEl.getAttribute('fileRef') || '0'));
	}));
	tools.appendChild(mk('prd_swiper_del_btn', '删除', function () {
		var go = function () { editor.model.change(function (w) { w.remove(modelEl); }); };
		if (typeof confirmLayer === 'function') confirmLayer('确定删除该图集吗？', '', go);
		else if (confirm('确定删除该图集吗？')) go();
	}));
	domEl.appendChild(tools);
}

 
function initPrdSwipers() {
	if (typeof Swiper === 'undefined' || typeof buildPrdSwiper !== 'function') return;
	document.querySelectorAll('.prd_swiper').forEach(function (box) {
		if (box.classList.contains('is-swiper-init')) return;
		if (box.closest('.ck-editor__editable')) return;
		var imgs = parsePrdSwiperImgs(box);
		if (imgs.length) buildPrdSwiper(box, imgs);
	});
}
$(function () { initPrdSwipers(); });
 








var CMS_COLS_ICONS = {
	2: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h7v14H2V3zm9 0h7v14h-7V3z"/></svg>',
	3: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h4.4v14H2V3zm5.8 0h4.4v14H7.8V3zm5.8 0H18v14h-4.4V3z"/></svg>',
	4: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 3h3.1v14H2V3zm4.3 0h3.1v14H6.3V3zm4.3 0h3.1v14h-3.1V3zm4.3 0H18v14h-3.1V3z"/></svg>'
};

 
function insertColumnsBlock(editor, count) {
	var n = (count === 3 || count === 4) ? count : 2;
	var cells = '';
	for (var i = 0; i < n; i++) {
		cells += '<div class="cms-col"><p>&nbsp;</p></div>';
	}
	 
	var html = '<div class="cms-cols cms-cols-' + n + '">' + cells + '</div><p>&nbsp;</p>';
	var viewFragment = editor.data.processor.toView(html);
	var modelFragment = editor.data.toModel(viewFragment);
	editor.model.insertContent(modelFragment);
	editor.editing.view.focus();
}

function registerColumnsButton(editor, name, label, count) {
	editor.ui.componentFactory.add(name, function (locale) {
		var sample = editor.ui.componentFactory.create('bold');
		var ButtonView = sample.constructor;
		sample.destroy();
		var b = new ButtonView(locale);
		b.set({ label: label, icon: CMS_COLS_ICONS[count], tooltip: true, withText: false });
		b.on('execute', function () { insertColumnsBlock(editor, count); });
		return b;
	});
}

function columnsPlugin(editor) {
	registerColumnsButton(editor, 'columns2', '插入两栏布局', 2);
	registerColumnsButton(editor, 'columns3', '插入三栏布局', 3);
	registerColumnsButton(editor, 'columns4', '插入四栏布局', 4);
}
 

//import LineHeight from '/_Ext/ckeditor5/plugins/lineheight.js';
function createCKEditor5(renderTo, options, callback) {
	let plugins = ['Title', 'Markdown', 'MediaEmbed'];
	if (options != null && options == 'Image') {
		plugins = ['Title', 'Markdown', 'MediaEmbed', 'ImageInsert'];
	}
	renderTo = renderTo || "ckeditor";
	return ClassicEditor.create($('#' + renderTo).get(0), {
		//extraPlugins: [uploadAdapterPlugin],
		extraPlugins: [youtubeButtonPlugin, swiperButtonPlugin, swiperWidgetPlugin, columnsPlugin],
		removePlugins: plugins,
		sourceEditing: {
			autoFormat: false,
			keepSourceStructure: true,
			allowedContent: true,
		},
		pasteFilter: null,
		allowedContent: true,
		htmlSupport: {
			allow: [
				{
					name: /.*/,
					attributes: true,
					classes: true,
					elements: true,
					styles: true
				}
			]
		},
		fontSize: {
			options: [13, 14, 15, 16, 17, 20, 25, 30],
			supportAllValues: true
		},
		fontFamily: {
			options: [
				'default',
				'Noto Sans KR, sans-serif',
				'\ub098\ub214\uace0\ub515',
				'\ub098\ub214\ubc14\ub978\uace0\ub515',
				'\ub098\ub214\uba85\uc870,Nanum Myeongjo, serif',
				'\ub098\ub214\uc2a4\ud018\uc5b4,NanumSquare, sans-serif',
				'\uad74\ub9bc,Gulim',
				'\ub3cb\uc6c0,Dotum',
				'\ubc14\ud0d5,Batang',
				'\uad81\uc11c,Gungsuh',
				'\ub9d1\uc740 \uace0\ub515,Malgun',
				'Arial,arial',
			]
		},
		/*
		// full option
		toolbar: {
			items :[
				'Heading','Bold','Italic','Link','BulletedList','NumberedList','|','Outdent','Indent'
				,'ImageUpload','BlockQuote','InsertTable','MediaEmbed','Undo','Redo','Alignment','FontBackgroundColor','FontColor','FontFamily','Highlight','FontSize','HorizontalLine'
				,'CodeBlock','Code','FindAndReplace','HtmlEmbed','ImageInsert','MathType','ChemType','PageBreak','RemoveFormat','SourceEditing','SpecialCharacters','Strikethrough','Style'
				,'Subscript','Superscript','TextPartLanguage','TodoList','Wproofreader','Underline'
			],
			shouldNotGroupWhenFull: true
		},
		*/
		toolbar: {
			items: [
				'SourceEditing', 'Heading', 'Bold', 'Italic', 'Link', 'BulletedList', 'NumberedList', '|'
				, 'ImageInsert', 'youtubeButton', 'swiperButton', 'swiperButton2', 'InsertTable', 'MediaEmbed', 'Alignment', 'columns2', 'columns3', 'columns4', 'FontBackgroundColor', 'FontColor', 'FontFamily', 'FontSize', 'HorizontalLine'
				, 'FindAndReplace', 'Strikethrough'
				, 'Underline'
			],
			shouldNotGroupWhenFull: true
		},
		simpleUpload: {
			// The URL that the images are uploaded to.
			uploadUrl: '/_Ext/ckeditor5/upload.php',

			// Enable the XMLHttpRequest.withCredentials property.
			withCredentials: true,

			// Headers sent along with the XMLHttpRequest to the upload server.
			headers: {
				'X-CSRF-TOKEN': 'CSRF-Token',
				Authorization: 'Bearer <JSON Web Token>'
			}
		}, image: {
			// Configure the available styles.
			styles: ['full',
				'side',
				'alignLeft',
				'alignCenter',
				'alignRight',
				'breakText'],
			// You need to configure the image toolbar, too, so it shows the new style
			// buttons as well as the resize buttons.

			toolbar: [
				'imageStyle:full',
				'imageStyle:side',
				'|',
				'toggleImageCaption',
				'imageTextAlternative',
				'|',
				'imageStyle:alignLeft',
				'imageStyle:alignCenter',
				'imageStyle:alignRight',
				'|',
				'imageStyle:breakText',
				'|',
				'imageResize',
			],
		},
	})
		.then((editor) => {

			editor.on('init', () => {
				 
				$('#ck-editor__aria-label_' + ckEditors[renderTo].id).closest('button').click(function () {
					 
					const data = ckEditors[renderTo].getData();
					if (!ckEditors[renderTo].config.sourceEditing) {
						 
						 
						ckEditors[renderTo].config.sourceEditing = true;
						 
					} else {  
						 
						 
						ckEditors[renderTo].config.sourceEditing = false;
						 
					}
					ckEditors[renderTo].setData(data);
				});
			});
			const editorElement = editor.ui.view.editable.element;
			let previousStyle = editorElement.getAttribute('style') || '';   

			 
			const resizeObserver = new ResizeObserver(() => {
				previousStyle = editorElement.getAttribute('style');   
			});

			resizeObserver.observe(editorElement);   

			editor.ui.focusTracker.on('change:isFocused', (event, name, isFocused) => {
				editorElement.setAttribute('style', previousStyle);   
			});
			ckEditors[renderTo] = editor;
			//target = editor;
			//window.ckeditor = editor;
			if (isFunction(callback)) {
				callback(editor);
			}
		})
		.catch((error) => {
			console.error("There was a problem initializing the editor.", error);
		});
}





















function handleKeyDown(event, maxCount, prefix) {
	if (event.key !== 'Enter') return;
	event.preventDefault();

	maxCount = parseInt(maxCount, 10) || 0;
	prefix   = prefix || '';

	var inputId     = prefix ? (prefix + 'Tag')          : 'tag';
	var containerId = prefix ? (prefix + 'TagContainer') : 'hashtagContainer';
	var hiddenName  = prefix ? (prefix + 'TagList[]')    : 'tagList[]';
	var hiddenIdPfx = prefix ? (prefix + 'Tag_')         : 'tag_';

	var $input     = $('#' + inputId);
	var $container = $('#' + containerId);
	if (!$input.length || !$container.length) return;

	var raw = ($input.val() || '').trim();
	if (raw === '') return;

	 
	var parts = raw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);

	parts.forEach(function (value) {
		if (maxCount > 0 && $container.find('input[type=hidden]').length >= maxCount) return;

		var rdStr = Math.random().toString(36).substr(2, 10);
		var html  = '<span id="' + rdStr + '" style="margin-right:5px;">#' + value
				  + '<a href="javascript:delTag(\'' + rdStr + '\');"><i class="fa-regular fa-xmark"></i></a>'
				  + '<input type="hidden" id="' + hiddenIdPfx + rdStr + '" name="' + hiddenName + '" value="' + value + '">'
				  + '</span>';
		$container.append(html);
	});

	$input.val('');
}

function handleInput(input) {
	 
	input.value = input.value.replace(/[^\w\u3131-\u314e\u314f-\u3163\uac00-\ud7a3,\s]/g, '');
}

function delTag(rdStr) {
	$('#' + rdStr).remove();
}
 


 
 
function reportProc(targetTable, targetId, bbsConfIdx) {
	if (confirm('确定举报该内容吗？')) {
		ajaxProc('', '', '/_Prog/common/report/proc.php', 'targetTable=' + targetTable + '&targetId=' + targetId + '&bbsConfIdx=' + (bbsConfIdx || 0), reportProcEnd);
	}
}
function reportProcEnd(v) {
	var vSplit = v.split('||');
	if (vSplit[0] == 'OK') {
		alert('举报已受理。\n管理员核实后将处理。');
	} else {
		alert(v);
	}
}

function stopLenisForModal() {
	$('html, body').addClass('scroll_none');

	if (typeof destroyLenis === 'function') {
		destroyLenis();
	}
}

function startLenisAfterModalClose() {
	if ($('.modal.open, .over_modal.open').length > 0) {
		return;
	}

	$('html, body').removeClass('scroll_none');

	if (typeof initLenis === 'function') {
		initLenis();
	}
}

function openModal(modalName, params) {
	ajaxProc('modalView', '', '/_Prog/common/modal/' + modalName + '.php', params, function () {
		$('select').niceSelect();
		$('.modal').addClass('open');
		stopLenisForModal();
		initTextareaCounter($('#modalView'));
	});
}


function modalClose(type) {
    if (type != null) {
        if (confirm('确定关闭弹窗吗？已填写的信息将被清空。')) {
            $('.modal').find('input[type=text]').val('');
            $('.modal').find('input[type=tel]').val('');
            $(".modal").removeClass("open");
			startLenisAfterModalClose();
        }
    } else {
        var modalVideo = document.querySelector(".modal_cont video");
        if (modalVideo) {
            modalVideo.pause();
        }

        $('.modal').find('input[type=text]').val('');
        $('.modal').find('input[type=tel]').val('');
        $(".modal").removeClass("open");
		startLenisAfterModalClose();
        $('.modal_cont.video_modal').empty();
    }
}

function openOverModal(modalName, params) {
	ajaxProc('modalOverView', '', '/_Prog/common/modal/' + modalName + '.php', params, function () {
		$('select').niceSelect();
		$('.over_modal').addClass('open');
		stopLenisForModal();
	});
}

function closeOverModal(type) {
	var hasValue = false;
	$('.over_modal').find('input[type=text], input[type=tel]').each(function () {
		if ($(this).val() !== '') { hasValue = true; return false; }
	});

	if (hasValue) {
		confirmLayer('已填写的内容将被清空。', '确定', function () {
			$('.over_modal').find('input[type=text]').val('');
			$('.over_modal').find('input[type=tel]').val('');
			$(".over_modal").removeClass("open");
			startLenisAfterModalClose();
			window.location.hash = "";
		});
	} else {
		$('.over_modal').find('input[type=text]').val('');
		$('.over_modal').find('input[type=tel]').val('');
		$(".over_modal").removeClass("open");
		startLenisAfterModalClose();
		window.location.hash = "";
	}
}

 
function overModalClose(type) {
	closeOverModal(type);
}
 



function generateRandomString(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters.charAt(randomIndex);
	}

	return result;
}

 
function ajaxProc(divid, frmnm, urlLink, pa, returnData) {
	if (frmnm != '') {
		if (pa != '') {
			pa = $('#' + frmnm).serialize() + '&' + pa;
		} else {
			pa = $('#' + frmnm).serialize();
		}
	}
	if (loadingYn == 'Y') {
		$('#loading').show();
	}
	$.ajax({
		url: urlLink
		, type: 'POST'
		, dataType: 'html'
		, contentType: "application/x-www-form-urlencoded;charset=UTF-8"
		, data: pa
		, beforeSend: function () {
		}
		, success: function (data) {
			$('#loading').hide();
			if (divid != '') {
				$('#' + divid).html(data);
			}
			if (returnData != '') {
				returnData(data);
			}
		}
		, error: function (xhr, ajaxOptions, thrownError) {
			$('#loading').hide();
			alert(xhr.status + " : " + thrownError);
		}

	});
}


 
function ajaxJsonProc(divid, frmnm, urlLink, pa, returnData) {
	if (frmnm != '') {
		if (pa != '') {
			pa = $('#' + frmnm).serialize() + '&' + pa;
		} else {
			pa = $('#' + frmnm).serialize();
		}
	}
	if (loadingYn == 'Y') {
		$('#loading').show();
	}
	$.ajax({
		url: urlLink
		, type: 'POST'
		, dataType: 'json'
		, contentType: "application/x-www-form-urlencoded;charset=UTF-8"
		, data: pa
		, beforeSend: function () {
		}
		, success: function (data) {
			$('#loading').hide();
			if (divid != '') {
				$('#' + divid).html(data);
			}
			if (returnData != '') {
				returnData(data);
			}
		}
		, error: function (xhr, ajaxOptions, thrownError) {
			$('#loading').hide();
			alert(xhr.status + " : " + thrownError);
		}

	});
}

 
function ajaxMultiJsonProc(divid, returnData) {
	if (loadingYn == 'Y') {
		$('#loading').show();
	}
	$('#' + divid).ajaxSubmit({
		type: "POST",
		dataType: "json",
		contentType: "application/x-www-form-urlencoded;charset=UTF-8",
		beforeSend: function () {
		},
		uploadProgress: function (event, position, total, percentComplete) {
		},
		success: function (data) {
			$('#loading').hide();
			returnData(data);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			$('#loading').hide();
			alert(xhr.status + " : " + thrownError);
		}
	});
}

 
function ajaxFileUploadProc(divid, fileRef, returnData) {
	loadingYn = 'Y';
	if (loadingYn == 'Y') {
		$('#loading').show();
	}

	var form = new FormData();
	form.append("file", $("#" + divid)[0].files[0]);
	form.append("fileRef", fileRef);

	jQuery.ajax({
		url: "/_Prog/common/fileUpload.php"
		, type: "POST"
		, processData: false
		, contentType: false
		, data: form
		, success: function (data) {
			$('#loading').hide();

			if (returnData != '') {
				returnData(data);
			}
		}
		, error: function (jqXHR) {
			alert(jqXHR.responseText);
		}
	});
}

 
function ajaxMultiProc(divid, returnData, errorCallback) {
	if (loadingYn == 'Y') {
		$('#loading').show();
	}

	let formData = new FormData($('#' + divid)[0]);

	if (!(typeof commonFileUploadArr === 'undefined')) {
		if (commonFileUploadArr[divid] != undefined) {
			var keys = Object.keys(commonFileUploadArr[divid]);
			$.each(keys, function (k, v) {
				 
				 
				 
				 
				const fileField = commonFileUploadArr[divid][v].fileField;
				if (!fileField || fileField === 'undefined') return;

				 
				 
				 
				 
				 
				if ($('#' + divid).find('#' + v + 'FileArea').length === 0) return;

				formData.append("commonFileUploadField[]", fileField);
				formData.append(fileField + "MaxCount", commonFileMaxCount[divid][v]);
				formData.append(fileField + "MaxSize", commonFileMaxSize[divid][v]);

				 
				for (let i = 0; i < commonFileUploadArr[divid][v].files.length; i++) {
					if (commonFileUploadArr[divid][v].files[i] instanceof File) {
						formData.append(fileField + "FileIdx[]", "");
						formData.append(fileField + "[]", commonFileUploadArr[divid][v].files[i]);
						formData.append(fileField + "Type[]", 'SELECTED');
					} else {
						 
						formData.append(fileField + "FileIdx[]", commonFileUploadArr[divid][v].files[i].fileIdx);
						formData.append(fileField + "Type[]", 'UPLOADED');
					}
				}
			});
		}
	}

	return $.ajax({
		url: $('#' + divid).attr('action'),
		type: "POST",
		dataType: "json",
		data: formData,
		processData: false,
		contentType: false,
		beforeSend: function () { },
		uploadProgress: function (event, position, total, percentComplete) { },
		success: function (data) {
			$('#loading').hide();
			returnData(data);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			$('#loading').hide();
			if (typeof errorCallback === 'function') errorCallback(xhr);
			else alert(xhr.status + " : " + thrownError);
		}
	});
}


 
function ajaxMultiProc_new(divid, returnData) {

	// if (imageOCRLoading) {
	 
	// 	return;
	// }

	if (loadingYn == 'Y') {
		$('#loading').show();
	}

	let formData = new FormData($('#' + divid)[0]);

	if (!(typeof commonFileUploadArr === 'undefined')) {
		if (commonFileUploadArr[divid] != undefined) {
			var keys = Object.keys(commonFileUploadArr[divid]);
			$.each(keys, function (k, v) {
				 
				 
				 
				 
				const fileField = commonFileUploadArr[divid][v].fileField;
				if (!fileField || fileField === 'undefined') return;

				 
				 
				 
				 
				 
				if ($('#' + divid).find('#' + v + 'FileArea').length === 0) return;

				formData.append("commonFileUploadField[]", fileField);
				formData.append(fileField + "MaxCount", commonFileMaxCount[divid][v]);
				formData.append(fileField + "MaxSize", commonFileMaxSize[divid][v]);

				 
				for (let i = 0; i < commonFileUploadArr[divid][v].files.length; i++) {
					if (commonFileUploadArr[divid][v].files[i] instanceof File) {
						formData.append(fileField + "FileIdx[]", "");
						formData.append(fileField + "[]", commonFileUploadArr[divid][v].files[i]);
						formData.append(fileField + "Type[]", 'SELECTED');
					} else {
						 
						formData.append(fileField + "FileIdx[]", commonFileUploadArr[divid][v].files[i].fileIdx);
						formData.append(fileField + "Type[]", 'UPLOADED');
					}
				}
			});
		}
	}

	$.ajax({
		url: $('#' + divid).attr('action'),
		type: "POST",
		dataType: "json",
		data: formData,
		processData: false,
		contentType: false,
		beforeSend: function () {
		},
		uploadProgress: function (event, position, total, percentComplete) {
		},
		success: function (data) {
			$('#loading').hide();
			returnData(data);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			$('#loading').hide();
			alert(xhr.status + " : " + thrownError);
		}
	});
}

let commonFileUploadArr = new Array();  







$(document).on('click', '.prd_ytb', function () {
	var $box = $(this);
	if ($box.closest('.ck-editor__editable').length) return;  
	if ($box.hasClass('is-playing')) return;

	var vid = String($box.attr('data-ytid') || '').replace(/[^A-Za-z0-9_-]/g, '');
	if (!vid || vid.length !== 11) return;

	$box.addClass('is-playing');  
	var $iframe = $('<iframe>', {
		src: 'https://www.youtube.com/embed/' + vid + '?autoplay=1&rel=0',
		title: '视频',
		frameborder: '0',
		allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen',
		allowfullscreen: ''
	});
	$box.empty().append($iframe);
});
let commonFileDropZone = new Array();   

let commonFileRef = new Array();    // fileRef
let commonFileField = new Array();    // fileField
let commonFileMaxCount = new Array();     
let commonFileMaxSize = new Array();     
let commonFileSortable = new Array();     
let commonFileThumbnail = new Array();     
let commonFileButtonName = new Array();     

function commonFileCheck(formId, rdStr, files) {
	let readFile = 0;
	let fileInfoArr = new Array();

	let fileCnt = $('#' + formId).find('#' + rdStr + 'FileArea').find('.uploadedCommonFile').length;
	if (commonFileMaxCount[formId][rdStr] < (files.length + fileCnt)) {
		alert('最多可上传 ' + commonFileMaxCount[formId][rdStr] + ' 个文件。');
		return false;
	}

	for (var i = 0; i < files.length; i++) {
		if (files[i].size > commonFileMaxSize[formId][rdStr] * 1024 * 1024) {
			alert("附件大小不能超过 " + commonFileMaxSize[formId][rdStr] + " MB。");
			return false;
		}

		var fileExtension = files[i].name.split('.').pop().toLowerCase();
		var allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'webp', 'mp4', 'zip', 'svg', 'ico', 'hwp', 'xlsx', 'doc', 'docx', 'xls', 'ppt', 'pptx', 'gif', 'bmp', 'tiff'];  

		if (!allowedExtensions.includes(fileExtension)) {
			alert("不允许的文件扩展名。仅支持 jpg, jpeg, png, pdf, webp, mp4, zip, svg, ico, hwp, xlsx, doc, docx, xls, ppt, pptx, gif, bmp, tiff。");
			return false;
		}

	}

	var fileArr = [];

	fileArr = commonFileUploadArr[formId][rdStr]['files'];

	for (var i = 0; i < files.length; i++) {
		fileInfoArr[i] = [];  

		var file = files[i];

		var fileName = file.name;  

		var fileSize = file.size;  
		var fileType = file.type;  

		fileInfoArr[i].fileName = fileName;
		fileInfoArr[i].fileSize = fileSize;
		fileInfoArr[i].status = "SELECTED";
		fileInfoArr[i].uniqId = generateRandomString(10);
		fileArr.push(files[i]);

		 
		 

		if (file.type.startsWith("image/")) {
			var fileReader = new FileReader();

			(function (index) {
				fileReader.onload = function (event) {
					fileInfoArr[index].imgLink = event.target.result;

					readFile++;
					if (readFile == files.length) {
						appendCommonFileList(formId, rdStr, fileInfoArr);
					}
				};
			})(i);

			 
			fileReader.readAsDataURL(file);
		} else {
			// console.log(file.type.split('/')[1]);
			// if(file.type.split('/')[1] == 'pdf') fileInfoArr[0].imgLink = '/inc/img/common/tiff.svg';
			readFile++;
		}

		if (readFile == files.length) {
			appendCommonFileList(formId, rdStr, fileInfoArr);
		}
	}

	commonFileUploadArr[formId][rdStr] = new Array();
	commonFileUploadArr[formId][rdStr]['fileField'] = commonFileField[formId][rdStr];
	commonFileUploadArr[formId][rdStr]['files'] = fileArr;
}

function getUploadedCommonFile(formId, rdStr, fileRef) {
	const pa = 'fileRef=' + fileRef;
	ajaxJsonProc('', '', '/_Ext/commonFileUpload/getUploadedCommonFileJson.php', pa, function (res) {
		appendCommonFileList(formId, rdStr, res.fileInfoArr);
	});
}

function deleteFile(type, v, formId, rdStr, obj) {
	let deleteIndex;
	$('#' + formId).find('#' + rdStr + 'FileArea').find('.commonFileDeleteBtn').each(function (index) {
		if (this == obj) {
			deleteIndex = index;
		}
	});
	//console.log(deleteIndex);
	commonFileUploadArr[formId][rdStr]['files'].splice(deleteIndex, 1);
	if (type == 'UPLOADED') {
		$('#' + rdStr + 'deleteFileIdxArea').append('<input type="hidden" name="deleteFileIdx[]" value="' + v + '"/>');
	}
	$('#' + formId).find('#' + type + '_' + v).remove();

	//console.log(commonFileUploadArr[rdStr]['files']);
}

function validatePhone(phone) {
	const regex = /^\d{3}-\d{3,4}-\d{4}$/;
	return regex.test(phone);
}

function validateEmail(email) {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
}

$(document).on('click', '#subscriberFrmBtn', function () {
	const $button = $(this);
	const $form = $('#subscriberFrm');
	if (!$form.length || $button.data('submitting') === true) return false;

	const $email = $form.find('input[name=email]');
	const email = $.trim($email.val() || '');

	if (email === '') {
		alertLayer('请输入邮箱地址。');
		if (typeof isMobileDevice !== 'function' || !isMobileDevice()) {
			$email.focus();
		}
		return false;
	}

	if (!validateEmail(email)) {
		alertLayer('邮箱格式不正确。');
		if (typeof isMobileDevice !== 'function' || !isMobileDevice()) {
			$email.focus();
		}
		return false;
	}

	openModal('news_marketing');
	return false;
});

$(document).on('click', '#subscriberMarketingConfirmBtn', function () {
	const $modalButton = $(this);
	const $form = $('#subscriberFrm');
	const $submitButton = $('#subscriberFrmBtn');
	if (!$form.length || $submitButton.data('submitting') === true) return false;

	const $email = $form.find('input[name=email]');
	const email = $.trim($email.val() || '');

	if (email === '') {
		modalClose();
		alertLayer('请输入邮箱地址。', '', function () {
			if (typeof isMobileDevice !== 'function' || !isMobileDevice()) {
				$email.focus();
			}
		});
		return false;
	}

	if (!validateEmail(email)) {
		modalClose();
		alertLayer('邮箱格式不正确。', '', function () {
			if (typeof isMobileDevice !== 'function' || !isMobileDevice()) {
				$email.focus();
			}
		});
		return false;
	}

	if (!$('#marketingChkMain').prop('checked')) {
		alertLayer('请勾选同意隐私政策与营销信息。', '', function () {});
		return false;
	}

	$submitButton.data('submitting', true).prop('disabled', true);
	$modalButton.prop('disabled', true);
	ajaxJsonProc('', 'subscriberFrm', '/_Prog/subscriber/subscriberProc.php', 'marketing_yn=Y', function (res) {
		if (res && res.msg !== undefined && res.msg !== '') {
			alertLayer(res.msg, '', function () {
				if (res && res.success) {
					modalClose();
				}
			});
		}

		if (res && res.success) {
			$email.val('');
			$('#marketingChkMain').prop('checked', false);
		}

		const csrfToken = res && (res.new_csrf_token || res.csrfToken);
		if (csrfToken) {
			$form.find('input[name="csrf_token"]').val(csrfToken);
		}

		$submitButton.data('submitting', false).prop('disabled', false);
		$modalButton.prop('disabled', false);
	});

	return false;
});

function validateNumber(number) {
	const regex = /^\d+$/;
	return regex.test(number);
}
