/**
 * Replaces HTML elements with another element.
 *
 * @since   1.0
 * @param   object  The HTML element(s) that will replace the original
 * @return  object  Returns a Plum object
 */
_.fn.replace = function (html) {
	html = html instanceof _ ? html : _(html);
	this.each(function () {
		var elems = html,
			node = _(elems.slice(0, 1)[0]);
		this.parentNode.replaceChild(node[0], this);
		node.insert(elems, 'after');
	});
	return html;
};