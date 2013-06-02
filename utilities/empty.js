/**
 * Checks if an object is empty.
 *
 * @since   1.0
 * @param   object  object  The object to test
 * @return  bool    Returns true if the object is empty, or false if not
 */
_.empty = function (object) {
	var i;
	for (i in object) {
		if (object.hasOwnProperty(i)) { return false; }
	}
	return true;
};