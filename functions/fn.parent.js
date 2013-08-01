/**
 * Finds the parent or ancestors of the current element.
 *
 * @since   1.0
 * @param   string  find  The element to find
 * @param   bool    deep  Directive to include all ancestors
 * @return  object  Returns a Plum object
 */
_.fn.parent = function (find, deep) {
	return _.fn.children.call(this, find, deep ? 'ancestors' : 'parent');
};