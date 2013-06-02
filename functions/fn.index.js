/**
 * Gets an element at a specific index in a Plum object.
 *
 * @since   1.0
 * @param   int     find  The index position, selector, element or Plum object
 * @return  object  Returns a Plum object
 */
_.fn.index = function (find) {
	var elem;
	if (/^\d+$/.test(find)) {
		elem = _(this[+find]);
	} else if (typeof find === 'string') {
		this.each(function (i) {
			if (_(this).is(find)) { elem = i; return false }
		});
	} else {
		elem = this.indexOf(find instanceof _ ? find[0] : find);
	}
	return elem;
};