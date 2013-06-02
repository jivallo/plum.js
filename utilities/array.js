/**
 * Converts any object to a true array.
 *
 * @since   1.0
 * @param   object  object  The object to convert
 * @return  array   Returns the object as an array
 */
_.array = function (object) {
	return Array.prototype.slice.apply(object);
};