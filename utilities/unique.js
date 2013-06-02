/**
 * Filters an array to display only unique values.
 *
 * @since   1.0
 * @return  array  Returns the array with unique values
 */
_.unique = function (a) {
	var i = 0,
		l = a.length,
		u = [];
	for (; i < l; i++) {
		if (u.indexOf(a[i]) < 0) {
			u.push(a[i]);
		}
	}
	return u;
};