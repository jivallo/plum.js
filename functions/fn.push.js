/**
 * Merges Plum objects, selectors and HTML elements together.
 *
 * @since   1.0
 * @param   mixed   [ ... ]  The item(s) to merge
 * @return  object  Returns a Plum object
 */
_.fn.push = function () {
	var i = 0, iLength = arguments.length, j, jLength, node;
	for (; i < iLength; i++) {
		node = arguments[i];
		if (node instanceof _ || typeof node === 'string') {
			node = _(node);
			for (j = 0, jLength = node.length; j < jLength; j++) {
				this[this.length++] = node[j];
			}
		} else if (node.nodeName) {
			this[this.length++] = node;
		}
	}
	return this;
};