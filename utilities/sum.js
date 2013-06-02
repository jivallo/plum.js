/**
 * Adds the sum total of all object values.
 *
 * @since   1.0
 * @param   object  obj  The object to total
 * @return  int     Returns the aggregate total
 */
_.sum = function (obj) {
	var n, i = 0, l = obj.length, t = 0;
	if (obj instanceof Array) {
		for (; i < l; i++) {
			n = parseFloat(obj[i]);
			t += isFinite(n) ? n : 0;
		}
	} else {
		for (i in obj) {
			n = parseFloat(obj[i]);
			t += isFinite(n) ? n : 0;
		}
	}
	return t;
};