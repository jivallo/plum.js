/**
 * Selects the previous adjacent element.
 *
 * @since   1.0
 * @return  object  Returns a Plum object
 */
_.fn.prev = function (selector) {
	var elems = [];
	this.each(function () {
		var elem = this.previousElementSibling;
		elem && elems.push(elem);
	});
	return _(elems);
};