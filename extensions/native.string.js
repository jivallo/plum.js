/**
 * Base64-encodes an image to create a data URI.
 *
 * @since   1.0
 * @param   string  image  The image data
 * @return  string  Returns a base64 data URI
 */
String.prototype.base64 = function (image) {
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
		r, o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		enc = '',
		arr = [];
	do {
		o1 = this.charCodeAt(i++);
		o2 = this.charCodeAt(i++);
		o3 = this.charCodeAt(i++);
		bits = o1 << 16 | o2 << 8 | o3;
		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;
		arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < this.length);
	enc = arr.join('');
	r = this.length % 3;
	r = (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
	return r;
};

/**
 * Converts a binary string to its raw format.
 *
 * @since   1.0
 * @return  string  Returns the raw binary
 */
String.prototype.bin2bit = function () {
	var bin,
		bit = '',
		hex = {
			'0': '0000', '1': '0001', '2': '0010', '3': '0011',
			'4': '0100', '5': '0101', '6': '0110', '7': '0111',
			'8': '1000', '9': '1001', 'a': '1010', 'b': '1011',
			'c': '1100', 'd': '1101', 'e': '1110', 'f': '1111'
		},
		i = 0,
		l,
		binary = this.split('');
	for (l = binary.length; i < l; i++) {
		binary[i] = binary[i].bin2hex();
		bit += hex[binary[i][0]] + hex[binary[i][1]];
	}
	return bit;
};

/**
 * Converts a binary string to hexadecimal.
 *
 * @since   1.0
 * @return  string  Returns the binary as a hexadecimal string
 */
String.prototype.bin2hex = function () {
	var i = 0, l = this.length, hex = [];
	for (; i < l; i++) {
		hex[i] = this.charCodeAt(i).toString(16).replace(/^([\da-f])$/, '0$1');
	}
	return hex.join('');
};

/**
 * Retrieves the integer value from a big endian string.
 *
 * @since   1.0
 * @return  number  Returns the converted integer
 */
String.prototype.bin2int = function () {
	var num = 0, i, bit = this.bin2bit();
	bit = bit.split('').reverse().join('');
	for (i = bit.length - 1; i >= 0; i--) {
		num += bit[i] * Math.pow(2, i);
	}
	return parseInt(num, 10);
};

/**
 * Saves a string to a cookie, or gets the value of a cookie.
 *
 * @since   1.0
 * @param   string  value   Cookie value
 * @param   number  expire  Optonal expiration date, in seconds
 * @param   string  path    Optional path location
 * @return  string  Returns the cookie value
 */
String.prototype.cookie = function (value, expire, path) {
	var date;
	if (value !== undefined) {
		if (expire !== null) {
			date = new Date();
			date.setTime(date.getTime() + expire * 1000);
			date = date.toUTCString();
		}
		document.cookie = this + '='
			+ encodeURIComponent(value)
			+ (date ? ';expires=' + date : '')
			+ (path ? ';path=' + path : '');
		return value;
	} else {
		date = '' + this;
		path = this.length + 1;
		document.cookie.split(';').each(function (i, cookie) {
			cookie = cookie.trim();
			if (cookie.substring(0, path) === date + '=') {
				value = cookie.substr(path);
				return false;
			}
		});
		return value ? decodeURIComponent(value) : undefined;
	}
};

/**
 * Creates a hash from a string.
 *
 * @since   1.0
 * @return  string  Returns the hashed string
 */
String.prototype.hash = function () {
	var chr, i = 0, hash = 0;
	if (this.length) {
		for (; i < this.length;) {
			chr = this.charCodeAt(i++);
			hash = ((hash << 5) - hash) + chr;
			hash = hash & hash;
		}
	}
	return hash;
};

/**
 * Converts a hexadecimal string to binary.
 *
 * @since   1.0
 * @return  string  Returns the binary string
 */
String.prototype.hex2bin = function () {
	var i = 0, l = this.length - 1, bytes = [];
	for (; i < l; i += 2) {
		bytes.push(parseInt(this.substr(i, 2), 16));
	}
	return String.fromCharCode.apply(String, bytes);	
};

/**
 * Creates a different shade of a hexadecimal or RGB(a) color.
 *
 * @since   1.0
 * @param   number  shade   The level of shading, as a decimal between 0 and 1
 * @param   bool    darker  True to darken the color, false to lighten
 * @return  string  Returns the shaded color
 */
String.prototype.shade = function (shade, darker) {
	var col = this.replace(/\s*/g, '').replace(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i, '#$1$1$2$2$3$3'),
		dif = Math.round(shade * 256) * (darker ? -1 : 1),
		rgb = col.match(new RegExp('^rgba?\\(\\*' +
			'(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
			'(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
			'(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
			'(0|1|0?\\.\\d+)?' +
			'\\)$', 'i')),
		alp = !!rgb && rgb[4] !== null ? rgb[4] : null,
		dec = !!rgb
			? [ rgb[1], rgb[2], rgb[3] ]
			: col.replace(/^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i, function () {
				return [
					parseInt(arguments[1], 16),
					parseInt(arguments[2], 16),
					parseInt(arguments[3], 16)
				].join(',');
			}).split(',');
	dec = [
		Math[darker ? 'max' : 'min'](parseInt(dec[0], 10) + dif, darker ? 0 : 255),
		Math[darker ? 'max' : 'min'](parseInt(dec[1], 10) + dif, darker ? 0 : 255),
		Math[darker ? 'max' : 'min'](parseInt(dec[2], 10) + dif, darker ? 0 : 255)
	];
	return !!rgb
		? 'rgb' + (alp !== null ? 'a' : '')
			+ '(' + dec.join(',') + (alp !== null ? ',' + alp : '') + ')'
		: '#'
			+ ('00' + dec[0].toString(16)).slice(-2)
			+ ('00' + dec[1].toString(16)).slice(-2)
			+ ('00' + dec[2].toString(16)).slice(-2);
};

/**
 * Forces a string to binary format.
 *
 * @since   1.0
 * @param   string  string  The string to convert
 * @return  string  Returns the string in binary format
 */
String.prototype.str2bin = function () {
	var i = 0, length = this.length, binary = '';
	for (; i < length; i++) {
		binary += String.fromCharCode(this.charCodeAt(i) & 0xff);
	}
	return binary;
};

/**
 * Converts a hyphenated string to camelCase.
 *
 * @since   1.0
 * @return  string  Returns a camel-case string
 */
String.prototype.toCamelCase = function () {
	return this.replace(/-([a-z])/gi, function (a, b) { return b.toUpperCase(); });
};

/**
 * Trims a value from the left, right or both sides of a string.
 *
 * @since   1.0
 * @param   string  string  The value to trim
 * @param   string  from    The side(s) of the string to trim
 * @return  string  Returns the trimmed string
 */
String.prototype.trim = function (string, from) {
	var result = this;
	string = (string || '\\s').replace(/([\[\]\(\)\.\?\|\/\*\{\}\+\$\^\:])/g, '\\$1');
	if (!from || from === 'left') { result = result.replace(new RegExp('^' + string + '+'), ''); }
	if (!from || from === 'right') { result = result.replace(new RegExp(string + '+$'), ''); }
	return result;
};