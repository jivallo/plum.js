/**
 * Loops through each item and applies it to a callback function.
 *
 * @since   1.0
 * @param   function  fn  A function to apply each array item
 * @return  void
 */
Array.prototype.each = function (fn) {
	var i = 0, length = this.length, ret;
	fn = typeof fn === 'function' ? fn : function () {};
	for (; i < length; i++) {
		ret = fn.call(this[i], i, this[i]);
		if (ret === false || ret !== undefined && ret !== true) {
			return ret;
		}
	}
	return this;
};