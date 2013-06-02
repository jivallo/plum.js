/**
 * Filters a Plum object to return only elements matching the selector.
 *
 * @since   1.0
 * @param   string  selector  The selector to use for filtering
 * @return  object  Returns a Plum object
 */
_.fn.filter = function (selector) {
	var elems = [];
	if (typeof selector === 'function') {
		this.each(function () { if (selector.call(this)) { elems.push(this); } });
	} else {
		this.each(function () { if (_(this).is(selector)) { elems.push(this); } });
	}
	return _(elems);
};