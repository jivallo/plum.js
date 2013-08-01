/**
 * Wraps HTML with the supplied HTML.
 *
 * @since   1.0
 * @param   mixed   html  The wrapper HTML
 * @return  object  Returns a Plum object
 */
_.fn.wrap = function (html) {
	var temp;
	if (html instanceof Object && html.selector !== undefined) {
		temp = html[0];
	} else if (html.charAt(0) === '<') {
		_.hidden.innerHTML = html;
		temp = _.hidden.children[1].firstChild;
	}
	return this.each(function () {
		html = temp.cloneNode(true);
		this.parentNode.insertBefore(html, this);
		while (html && html.children.length) {
			html = html.childNodes[0];
		}
		html.appendChild(this);
	}).fire('html.wrap', html);
};