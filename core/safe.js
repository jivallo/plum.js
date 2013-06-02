/**
 * Abandons Plum's usage of the _ variable for compatibility with other
 * frameworks.
 *
 * @since   1.0
 * @return  object  Returns a reference to the Plum object
 */
_.safe = function () {
	delete window._;
	return _;
};