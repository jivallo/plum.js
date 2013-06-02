/**
 * Slices a Plum object from a start to end index.
 *
 * @since   1.0
 * @param   int     start  The start index
 * @param   int     end    The end index
 * @return  object  Returns a Plum object
 */
_.fn.slice = function (start, end) {
	return _(_.array(this).slice(start, end));
};