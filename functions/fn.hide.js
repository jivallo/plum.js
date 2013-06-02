/**
 * Hides an element's visibility.
 *
 * @since    1.0
 * @return   object  Returns a Plum object
 */
_.fn.hide = function () {
	return this.style({ display: 'none' });
};