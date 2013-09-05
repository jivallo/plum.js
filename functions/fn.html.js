/**
 * Gets or sets an element's inner HTML.
 *
 * @since    1.0
 * @param    mixed   content  The HTML to replace
 * @param    bool    outer    Dictates whether the element is included
 * @return   object  Returns a Plum object
 */
_.fn.html = function (content, outer) {
	return this.length ? (content !== null && content !== undefined
		? this.insert(content, 'replace')
		: this[0][(outer ? 'outer' : 'inner') + 'HTML']) : this;
};