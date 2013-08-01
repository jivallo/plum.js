/**
 * Finds children or descendants of the current element.
 *
 * @since   1.0
 * @param   string  find  The element to find
 * @param   bool    deep  Directive to include all descendants
 * @return  object  Returns a Plum object
 */
_.fn.children = function (find, deep) {
	var elems = [], scope;
	if (typeof find === 'boolean') {
		deep = find;
		find = null;
	}
	deep = /^(?:ancestors|parent)$/.test(deep) ? deep : (deep ? 'descendants' : 'children');
	_.parse[deep] && this.each(function () {
		scope = _.parse[deep]([ this ]);
		scope = find ? _(find, scope) : scope;
		scope.each(function () { elems.push(this); });
	});
	return _(elems);
};