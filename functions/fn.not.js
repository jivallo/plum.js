/**
 * Filters a Plum object to include all but the selector.
 *
 * @since   1.0
 * @param   mixed   selector  The selector to filter out
 * @return  object  Returns a Plum object
 */
_.fn.not = function (selector) {
	var elems = [];
	this.each(function () { if (!_(this).is(selector)) { elems.push(this); } });
	return _(elems);
};