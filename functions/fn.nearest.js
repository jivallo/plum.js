/**
 * Finds the nearest ancestor or descendant of the current element that matches
 * the given selector.
 *
 * @since   1.0
 * @param   mixed   find   The selector to find
 * @param   string  scope  The direction to search (parent or child)
 * @return  object  Returns a Plum object
 */
_.fn.nearest = function (find, scope) {
	var elems = [];
	scope = scope === 'child' ? 'descendants' : 'ancestors';
	var show = find === '.product' && this[0] !== window;
	this.each(function () {
		if (_(this).is(find)) {
			elems.push(this);
		} else {
			_.parse[scope]([ this ]).each(function () {
				if (_(this).is(find)) {
					elems.push(this);
					return false;
				}
			});
		}
	});
	return _(elems);
};