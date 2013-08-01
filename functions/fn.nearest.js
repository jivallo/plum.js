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
	var elems = [], i, l;
	scope = scope ? 'descendants' : 'ancestors';
	if (typeof find === 'string') {
		find = find.split(/\s*,\s*/);
		for (i = 0, l = find.length; i < l; i++) {
			this.each(function () {
				if (_(this).is(find[i])) {
					elems.push(this);
				} else {
					_.parse[scope]([ this ]).each(function () {
						return _(this).is(find[i]) ? !elems.push(this) : true;
					});
				}
			});
		}
	} else {
		this.each(function () {
			if (_(this).is(find)) {
				elems.push(this);
			} else {
				_.parse[scope]([ this ]).each(function () {
					return _(this).is(find) ? !elems.push(this) : true;
				});
			}
		});
	}
	return _(elems);
};