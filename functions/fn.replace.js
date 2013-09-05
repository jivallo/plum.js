/**
 * Replaces HTML elements with another element.
 *
 * @since   1.0
 * @param   object  The HTML element(s) that will replace the original
 * @return  object  Returns a Plum object
 */
_.fn.replace = function (html) {
	html = _(html);
	this.each(function () { this.parentNode && this.parentNode.replaceChild(html[0], this); });
	return html;
};