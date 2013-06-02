/**
 * Copies a Plum object.
 *
 * @since   1.0
 * @param   bool    deep  Clone descendents as well as source
 * @return  object  Returns a Plum object
 */
_.fn.copy = function (deep) {
	var clone = [];
	deep = Boolean(deep);
	this.each(function () {
		var elem = this.cloneNode(deep);
		elem.plum = _.copy(this.plum);
		clone.push(elem);
	});
	clone = _(clone);
	clone.selector = this.selector;
	return clone;
};