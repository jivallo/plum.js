/**
 * Attaches reusable data to an element.
 *
 * @since   1.0
 * @param   string  key    The data key to search for or set
 * @param   mixed   value  If given, the data key will be set
 * @return  mixed   Returns a Plum object or the data key value
 */
_.fn.data = function (key, value) {
	if (value !== undefined) {
		return this.each(function () {
			this.plum.data[key] = value;
			if (/^[a-z0-9\-]+$/.test(key) && typeof value === 'string') {
				_(this).attr('data-' + key, value);
			}
		});
	}
	if (key === undefined) {
		return this[0] ? (function () {
			var i = 0,
				l = this.attributes.length,
				r = /^data-(.+)$/,
				v;
			value = this.plum.data;
			for (; i < l; i++) {
				key = this.attributes[i];
				if ((v = r.exec(key.name))) {
					value[v[1]] = key.value;
				}
			}
			return value;
		}.call(this[0])) : undefined;
		return this[0] && this[0].plum ? this[0].plum.data : undefined;
	}
	value = this[0] && this[0].plum ? this[0].plum.data[key] : undefined;
	return value === undefined ? this.attr('data-' + key) : value;
};