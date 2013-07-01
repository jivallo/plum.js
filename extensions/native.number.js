/**
 * Creates a formatted time string from a number of seconds.
 *
 * @since   1.0
 * @param   object  options  A list of formatting options
 * @return  string  The formatted time string
 */
Number.prototype.time = function (options) {
	options = _.merge({ hours: false, minutes: true, seconds: true, separator: ':' }, options || {});
	var H = Math.floor(this / 3600),
		M = Math.floor(this / 60),
		S = Math.floor(this),
		h,
		m,
		s;
	M = options.hours ? M - 60 * H : M;
	S = options.hours ? S - 3600 * H : S;
	S = options.minutes ? S - 60 * M : S;
	H = options.hours ? ('00' + H).slice(-((h = H.toString().length) > 2 ? h : 2)) : '';
	M = options.minutes ? ('00' + M).slice(-((m = H.toString().length) > 2 ? m : 2)) : '';
	S = options.seconds ? ('00' + S).slice(-((s = S.toString().length) > 2 ? s : 2)) : '';
	return [ H, M, S ].join(options.separator).trim(options.separator);
};

/**
 * Format a number based on a provided string. This can be used to display
 * prices or comma-separated numbers in general.
 *
 * (10500).format('$00,000,000.00') // outputs "$10,500.00"
 *
 * @since   1.0
 * @param   string  format  The style to format the number
 * @return  string  Returns the formatted number
 */
Number.prototype.format = function (format) {
	var B = (format.match(/^([^\d]+).+$/) || [ '', '' ])[1],
		A = (format.match(/^.+?([^\d]+)$/) || [ '', '' ])[1],
		N = format.substring(B.length, format.length - A.length),
		D = (N.match(new RegExp('^.+?([^\\d'
			+ (N.match(/[^\d]/) || [ '' ])[0]
			+ ']+)(\\d+)$')) || [ '', '', '' ]
		),
		S = N.match(/\b(\d+[^\d]+)\b/g),
		number = this instanceof Number ? (+this).toFixed(D[2].length) : this.toString(),
		result = [ A ],
		i,
		l;

	// Push the decimal place to the result.
	if (D[1]) {
		number = number.split('.');
		N = N.split(D[1]);
		result.push(number[1] || N[1]);
		result.push(D[1]);
		number = number[0];
		N = N[0];
	}

	// Build the formatted number.
	number = number.split('').reverse();
	N.split('').reverse().each(function (i, n) {
		if (number.length) {
			result.push(/\d/.test(n) ? number.shift() : n);
		} else {
			return false;
		}
	});

	// If the provided format is not long enough to cover the total number,
	// build the rest of the number based on string separators in the formatted
	// number.
	if (number.length && S && S[1]) {
		S[0] = S[0].match(/^(\d+)/)[1];
		S[1] = S[1].match(/^(\d+)([^\d]+)$/).slice(1, 3);
		S[2] = S[1][1];
		S[1] = S[1][0];
		S = S.slice(0, 3);
		for (i = 0, l = S[1].length - 1; i < l; i++) {
			result.push(number.shift());
		}
		for (i = 0, l = number.length / S[1].length; i < l; i++) {
			result.push(S[2]);
			result.push(number.splice(0, S[1].length).reverse().join(''));
		}
	} else {
		result.push(number.reverse().join(''));
	}
	return B + result.reverse().join('');
};