/**
 * Loads a server request via AJAX.
 *
 * @since   1.0
 * @param   object    o         AJAX loading options
 * @param   function  callback  A function to run after loading
 * @return  mixed     Returns the AJAX function or a Plum object
 */
_.ajax = (function () {
	var Events = {};
	var FN = 0;
	var Options = {
		headers: { 'Accept': '*/*' },
		method: 'GET',
		params: {},
		sync: false,
		type: null,
		url: window.location.href,
		before: function () {},
		complete: function () {}
	};
	function Ajax (opts, callback) {
		if (typeof opts === 'string') { opts = { url: opts, method: 'get' }; }
		else if (typeof opts === 'function') { opts.complete = opts; }
		if (typeof callback === 'function') { opts.complete = callback; }
		new XHR(opts, this);
		return this;
	};
	function XHR (opts, elem) {
		opts = this.options(opts, elem);
		this.open(opts, elem);
	};
	XHR.prototype = {

		complete: function (opts, xhr) {
			var elem = _(opts.elem),
				text = xhr.responseText,
				type = xhr.getResponseHeader('Content-Type') || 'text/html',
				cTxt;
			type = type.substr(type.indexOf('/') + 1);
			type = opts.type || type;
			try {
				if (opts.type === 'binary') {
					text = text.str2bin();
				} else if (opts.parse) {
					text = _(opts.parse, text);
				} else if (type === 'json') {
					text = JSON.parse(text);
					if (opts.html === 'select') {
						type = [];
						_.each(text, function (i, v) { type.push('<option value="' + i + '">' + v + '</option>'); });
						text = _('<select>' + vars.join('') + '</select>');
					}
				} else if (type === 'xml') {
					text = _.xml(text);
				}
				if (elem instanceof _ && !elem.is('form')) {
					elem.html(text);
				}
			} catch (e) {
				text = null;
			}
			cTxt = text && typeof text === 'object' && !(text instanceof _) ? _.copy(text) : text;
			opts.complete.call(elem[0], text, xhr);
			Events.complete && Events.complete.each(function (i, func) { func.call(elem[0], cTxt, xhr); });
		},

		/**
		 * Sets up HTTP headers for the current request.
		 *
		 * If the request method is POST and the content type has not already been
		 * set, the content type will be set to "application/x-www-form-urlencoded".
		 *
		 * @since   1.0
		 * @param   object  headers  A list of key-value headers
		 * @param   string  method   The request method
		 * @return  void
		 */
		headers: function (xhr, headers, method) {
			var i;
			if (method === 'post' && !headers['Content-Type']) {
				headers['Content-Type'] = 'application/x-www-form-urlencoded';
			}
			for (i in headers) {
				if (headers.hasOwnProperty(i) && i.toLowerCase() !== 'user-agent') {
					xhr.setRequestHeader(i, headers[i]);
				}
			}
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
		},

		/**
		 * Opens a new AJAX request.
		 *
		 * @since   1.0
		 * @param   object  opts  The current request options
		 * @param   object  elem  A DOM element for the request to be applied to
		 * @return  void
		 */
		open: function (opts, elem) {
			var xhr = new XMLHttpRequest();
			xhr.open(opts.method, opts.url, !opts.sync);
			this.headers(xhr, opts.headers, opts.method);
			if (opts.before(xhr) !== false &&
				(Events.before && Events.before.each(function (i, func) {
					func = func.call(elem, xhr);
					return func === false ? false : true;
				})) !== false
			) {
				if (opts.type === 'binary') {
					xhr.overrideMimeType('text/plain; charset=x-user-defined');
				}
				if (opts.params instanceof File) {
					xhr.setRequestHeader('X-File-Name', opts.params.name);
					xhr.setRequestHeader('X-File-Size', opts.params.size);
					xhr.upload.addEventListener('loadstart', opts.start, false);
					xhr.upload.addEventListener('progress', opts.progress, false);
					xhr.upload.addEventListener('load', opts.progress, false);
				}
				xhr.onreadystatechange = function () {
					xhr.readyState === 4 && this.complete(opts, xhr);
				}.bind(this);
				xhr.send(opts.method === 'post' ? opts.params : null);
			}
		},

		/**
		 * Normalizes the options object to contain all possible options.
		 *
		 * @since   1.0
		 * @param   object  opts  The list of options
		 * @param   mixed   elem  Used when applying AJAX directly to a DOM element
		 * @return  object  Returns the normalized options
		 */
		options: function (opts, elem) {
			var i,
				url = location,
				isLocal = new RegExp('^(https?://(?:[^/]+\\.)?'
					+ (url.hostname + (url.post ? ':' + url.port : '')).replace(/\./g, '\\.')
					+ ')?(?:/|$)'),
				parse,
				param = opts.params instanceof File ? opts.params : undefined;
	
			// Handler for submitting AJAX forms.
			if ((elem.nodeName || elem instanceof _) && (elem = _(elem)) && elem.is('form')) {
				opts.url = elem.attr('action');
				opts.method = elem.attr('method') || 'get';
				opts.params = param || elem.encode();
			}
	
			// Get all options.
			opts = _.merge(_.copy(Options), opts);
			opts.elem = elem[0] || this;
			opts.method = opts.method.toLowerCase();
	
			// Check if the URL is remote, and if it is, attempt to load the
			// content via JSONP.
			if (/^(?:get|post)$/.test(opts.method)
				&& /^https?\:\/\//.test(opts.url)
				&& !isLocal.test(opts.url)
			) {
				i = 'PlumJSONP_' + FN++;
				window[i] = function (json) { opts.complete.call(elem, json); };
				parse = document.createElement('script');
				parse.src = opts.url.replace('=?', '=' + i);
				return document.body.appendChild(parse);
			}
	
			// Finish building options.
			opts.params = param || this.params(opts.params);
			if (~(i = opts.url.indexOf(' '))) {
				opts.parse = opts.url.substr(i + 1);
				opts.url = opts.url.substr(0, i);
			}
			if (opts.method === 'get' && opts.params) {
				opts.url += (~opts.url.indexOf('?') ? '&' : '?') + opts.params;
			}

			return opts;
		},

		/**
		 * Builds a string of parameters to pass through the AJAX stream.
		 *
		 * @since   1.0
		 * @param   object  params  Parameters to serialize
		 * @return  string  Returns a serialized parameter string
		 */
		params: function (params) {
			var list = [], str = params.toString(), serialize = function (params, list, level) {
				level = level || 1;
				params.each(function (i, value) {
					if (typeof value === 'object') {
						serialize(value, list, level + 1);
					} else {
						list.push(i + (new Array(level).join('[]')) + '=' + encodeURIComponent(value));
					}
				});
				return list;
			};
			// If the given parameter is a form element, serialize all values of the
			// user input fields in the form.
			if (str === '[object HTMLFormElement]' || params instanceof _ && params.is('form')) {
				list = _(params).encode();
			} else if (str === '[object Object]') {
				list = _.params(params);
			} else {
				list = params;
			}
			return list;
		}

	};
	Ajax.setup = function (options) {
		var opts = _.copy(Options);
		options.complete && (opts.complete = options.complete);
		Options = _.merge(Options, options);
	};
	Ajax.on = function (event, callback) {
		if (typeof event === 'string' && typeof callback === 'function') {
			Events[event] || (Events[event] = []);
			Events[event].push(callback);
		}
	};
	return Ajax;
}());

_.fn.ajax = _.ajax;