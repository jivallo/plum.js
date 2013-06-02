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

/**
 * Finds the occurance of a needle in a haystack.
 *
 * @since   1.0
 * @param   mixed  needle  The needle to find
 * @param   int    offset  The integer offset to being searching
 * @return  int    Returns the index of the needle
 */
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(needle, offset) {
		var length = this.length;
		offset = Number(offset) || 0;
		offset = offset < 0 ? Math.ceil(offset) : Math.floor(offset);
		offset = offset < 0 ? offset + length : offset;
		for (; offset < length; offset++) {
			if (this[offset] === needle) {
				return offset;
			}
		}
		return -1;
	};
}