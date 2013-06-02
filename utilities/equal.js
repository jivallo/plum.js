/**
 * Check if two arrays are equal.
 *
 * @since   1.0
 * @param   array  a  The first array to test
 * @param   array  b  The second array to test
 * @return  bool   Returns true if both are identical, false otherwise
 */
_.equal = function (a, b) {
	var ret = true;
	if (a && b) {
		_.each(a, function (i, value) {
			if (value instanceof Object) { ret = _.equal(value, b[i]); }
			if (value !== b[i]) { return !(ret = false); }
		});
		return ret;
	}
	return false;
};