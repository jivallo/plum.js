/**
 * Loads a server request via AJAX.
 *
 * @since   1.0
 * @param   object    o         AJAX loading options
 * @param   function  callback  A function to run after loading
 * @return  mixed     Returns the AJAX function or a Plum object
 */
_.ajax = function (o, callback) {
	var ajax = _.copy(_.ajax.prototype);
	if (_.sp.ajax) {
		if (typeof o === 'string') { o = { url: o, method: 'get' }; }
		if (typeof callback === 'function') { o.complete = callback; }
		ajax.open(o, this);
	}
	return this;
};

_.ajax.setup = function (options) {
	var ajax = _.copy(_.ajax.prototype);
	if (options.complete) { ajax.complete = options.complete; }
	ajax.options = _.merge(ajax.options, options);
};

_.ajax.fn = 0;
_.ajax.prototype = {
	options: {
		headers: { 'Accept': '*/*' },
		method: 'GET',
		params: {},
		sync: false,
		type: null,
		url: window.location.href,
		before: function () {},
		complete: function () {}
	},

	complete: function (opts, xhr, parse) {
		var text = xhr.responseText,
			type = xhr.getResponseHeader('Content-Type') || 'text/html';
		type = type.substr(type.indexOf('/') + 1);
		type = opts.type || type;
		try {
			if (opts.type === 'binary') {
				text = text.str2bin();
			} else if (parse) {
				text = _(parse, text);
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
			if (this instanceof _ && !this.is('form')) {
				this.insert(text, 'replace');
			}
		} catch (e) {
			text = null;
		}
		opts.complete.call(this, text, xhr);
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
		var i,
			xhr,
			url = window.location,
			islocal = new RegExp('^(https?://(?:[^/]+\\.)?'
				+ (url.hostname + (url.port ? ':' + url.port : '')).replace(/\./g, '\\.')
				+ ')?(?:/|$)'
			),
			parse,
			params;

		if ((elem.nodeName || elem instanceof _) && (elem = _(elem)) && elem.is('form')) {
			opts.url = elem.attr('action');
			opts.method = elem.attr('method') || 'get';
			opts.params = elem.encode();
		}

		opts = _.merge(_.copy(this.options), opts);

		// If the URL is remote, attempt to load the content via JSONP.
		if (/^https?\:\/\//.test(opts.url) && !islocal.test(opts.url)) {
			i = 'PlumJSONP_' + _.ajax.fn++;
			window[i] = function (json) { opts.complete.call(elem, json); };
			parse = document.createElement('script');
			parse.src = opts.url.replace('=?', '=' + i);
			return document.body.appendChild(parse);
		}

		opts.method = opts.method.toLowerCase();
		params = this.params(opts.params);

		if (opts.url.indexOf(' ') > -1) {
			parse = opts.url.substr(opts.url.indexOf(' ') + 1);
			opts.url = opts.url.substring(0, opts.url.indexOf(' '));
		}

		if (opts.method === 'get' && params) {
			opts.url += (opts.url.indexOf('?') >= 0 ? '&' : '?') + params;
		}

		xhr = new XMLHttpRequest();
		xhr.open(opts.method, opts.url, !opts.sync);
		this.headers(xhr, opts.headers, opts.method);
		if (opts.before(xhr) !== false) {
			if (xhr.upload) {
				xhr.upload.addEventListener('loadstart', opts.start, false);
				xhr.upload.addEventListener('progress', opts.progress, false);
			}
			if (opts.type === 'binary') {
				xhr.overrideMimeType('text/plain; charset=x-user-defined');
			}
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) { this.complete.call(elem, opts, xhr, parse); }
			}.bind(this);
			xhr.send(opts.method === 'post' ? params : null);
		}
	},

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

_.fn.ajax = _.ajax;