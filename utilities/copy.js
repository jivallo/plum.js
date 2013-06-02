/**
 * Copies an array or object.
 *
 * @since   1.0
 * @return  array  Returns the cloned object
 */
_.copy = function (src) {
	return _.merge(src instanceof Array ? [] : {}, src);
};