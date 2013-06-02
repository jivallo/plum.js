_.sp = (function () {

	_.hidden.innerHTML = '<div></div>';
	var html = _.hidden.children[1].firstChild;

	return {
		// Check for AJAX support. In Internet Explorer,  set XMLHttpRequest to
		// one of Microsoft's ActiveX objects.
		ajax: !!window.XMLHttpRequest || !!(window.XMLHttpRequest = function () {
			var i = 0, types = [
				'Microsoft.XMLHTTP',
				'MSXML2.XMLHTTP.6.0',
				'MSXML2.XMLHTTP.5.0',
				'MSXML2.XMLHTTP.4.0',
				'MSXML2.XMLHTTP.3.0',
				'MSXML2.XMLHTTP'
			];
			for (; i < 6; ) {
				try { return new ActiveXObject(types[i++]); }
				catch (e) {}
			}
		}),

		// Check audio support for various audio types.
		audio: (function () {
			var audio = document.createElement('audio'),
				support = {},
				codecs = {
					mp3: 'audio/mpeg; codecs="mp3"',
					m4a: 'audio/mp4; codecs="mp4a.40.2"',
					oga: 'audio/ogg; codecs="vorbis"',
					wav: 'audio/wav; codecs="1"',
					webma: 'audio/webm; codecs="vorbis"'
				},
				i;
			codecs.ogg = codecs.oga;
			codecs.mp4 = codecs.m4a;
			codecs.webm = codecs.webma;
			if (!!audio.canPlayType) {
				for (i in codecs) {
					support[i] = !!audio.canPlayType(codecs[i]).replace(/^no$/, '');
				}
			}
			return support;
		}()),

		// CSS3 animation support.
		animation: (function (vendor) {
			var i = 0,
				l = vendor.length;
			for (; i < l; i++) {
				if ((vendor[i] + (vendor[i] ? 'T' : 't') + 'ransition') in html.style) {
					return true;
				}
			}
			return false;

		}('Moz Webkit Khtml O ms '.split(' '))),

		// Canvas support.
		canvas: !!document.createElement('canvas').getContext,

		// Drag & drop support.
		drag: !!('draggable' in html || ('ondragstart' in html && 'ondrop' in html)),

		// HTML5 ContentEditable support.
		edit: !!('contentEditable' in html),

		// File upload support.
		file: !!(window.File && window.FileList),

		// Adobe Flash detection.
		flash: (function () {
			var support = false;
			try {
				if (navigator.mimeTypes['application/x-shockwave-flash'] !== undefined) {
					support = true;
				}
			} catch (e) {
				if (window.ActiveXObject && new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash')) {
					support = true;
				}
			}
			return support;
		}()),

		// HTML5 history support.
		history: !!(window.history && history.pushState),

		// CSS3 HSL support.
		hsl: (html.style.color = 'hsl(0,0,0)')
			&& /^hsl/.test(html.style.color),

		// CSS3 HSLa support.
		hsla: (html.style.color = 'hsla(0,0,0,.5)')
			&& /^hsla/.test(html.style.color),

		// HTML5 input types.
		input: (function (types) {
			var field = document.createElement('input'),
				support = {},
				i = 0,
				l = types.length;
			for (; i < l; i++) {
				field.type = types[i];
				support[types[i].toCamelCase()] = field.type === types[i];
			}
			return support;
		}('color date datetime datetime-local email month number range search tel url week'.split(' '))),

		// HTML5 user media support.
		media: !!(navigator.getUserMedia = navigator.getUserMedia
			|| navigator.mozGetUserMedia
			|| navigator.msGetUserMedia
			|| navigator.webkitGetUserMedia
			|| undefined),

		// CSS3 opacity support.
		opacity: (html.style.opacity = '0') && html.style.opacity === '0',

		// CSS3 RGBa support.
		rgba: (html.style.color = 'rgba(0,0,0,.5)') && /^rgba/.test(html.style.color),

		// HTML5 local and session storage.
		storage: (function (types) {
			var support = {},
				i = 0,
				l = types.length;
			for (; i < l; i++) {
				try {
					window[types[i] + 'Storage'].setItem(_.instance, true);
					window[types[i] + 'Storage'].removeItem(_.instance);
					support[types[i]] = true;
				} catch (e) {
					support[types[i]] = false;
				}
			}
			return support;
		}('local session'.split(' '))),

		// Check video support for various video types.
		video: (function () {
			var video = document.createElement('video'),
				support = {},
				codecs = {
					h264: 'video/mp4; codecs="avc1.42E01E"',
					ogv: 'video/ogg; codecs="theora"',
					webmv: 'video/webm; codecs="vp8, vorbis"'
				},
				i;
			codecs.ogg = codecs.ogv;
			codecs.webm = codecs.webmv;
			if (!!video.canPlayType) {
				for (i in codecs) {
					support[i] = !!video.canPlayType(codecs[i]).replace(/^no$/, '');
				}
			}
			return support;
		}()),

		// Check web socket support.
		websocket: !!(window.WebSocket = window.WebSocket
			|| window.MozWebSocket
			|| undefined)
	};

}());