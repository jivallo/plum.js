/**
 * Creates a query string from a key-value list.
 *
 * @since   1.0
 * @param   object  obj  The key-value list to parameterize
 * @return  string  Returns the query string
 */
_.params = function (obj) {
	var param = [], merge = function (object, key) {
		var i, k, v;
		if (object && (object instanceof _ || object.nodeName)) {
			key = {};
			_(':input[name]', object).each(function () {
				if (this.type === 'checkbox' || this.type === 'radio') {
					if (this.checked) { key[this.name] = this.value; }
				} else {
					key[this.name] = this.value;
				}
			});
			object = key;
			key = undefined;
		}
		for (i in object) {
			if (object.hasOwnProperty(i)) {
				k = key || '';
				v = object[i];
				v = typeof v === 'function' ? v() : v;
				if (v !== undefined) {
					if (typeof v === 'object') {
						k += k ? '[' + i + ']' : i;
						merge(v, k);
					} else {
						param.push(
							encodeURIComponent(k + (k ? '[' + i + ']' : i))
							+ '='
							+ encodeURIComponent(v)
						);
					}
				}
			}
		}
	};
	merge(obj);
	return param.join('&').replace(/%20/g, '+');
};