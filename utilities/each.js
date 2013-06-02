/**
 * Loops through an object to apply a callback function.
 *
 * @since   1.0
 * @param   object    obj  The object to iterate
 * @param   function  fn   Callback function to apply
 * @return  void
 */
_.each = function (obj, fn) {
	var i, l;
	if (obj instanceof Array) {
		for (i = 0, l = obj.length; i < l; i++) {
			fn.call(obj[i], i, obj[i]);
		}
	} else {
		for (i in obj) {
			fn.call(obj[i], i, obj[i]);
		}
	}
};