/**
 * Gets or sets the value of a group of elements.
 *
 * @since   1.0
 * @param   string  content  The value to set for each element
 * @return  mixed   Returns an element value or a Plum object
 */
_.fn.value = function (content) {
	return this.each(function () {
		var elem = _(this);
		if (elem.is(':input')) {
			if (content === undefined) { return this.value; }
			this.value = content;
			elem.fire('value');
		}
	});
};