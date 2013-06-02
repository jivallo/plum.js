/**
 * Selects the next adjacent element.
 *
 * @since   1.0
 * @return  object  Returns a Plum object
 */
_.fn.next = function (selector) {
	var elems = [];
	this.each(function () {
		var elem = this.nextElementSibling;
		elem && elems.push(elem);
	});
	return _(elems);
};