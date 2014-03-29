/**
 * Removes an element from the DOM.
 *
 * @since   1.0
 * @return  object  Returns the removed elements
 */
_.fn.remove = function () {
	this.each(function () {
		var parent = _(this).parent();
		if (parent.length) {
			this.parentNode.removeChild(this);
			parent.fire('html.remove');
		}
	});
};