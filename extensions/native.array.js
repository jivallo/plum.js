/**
 * Loops through each item and applies it to a callback function.
 *
 * @since   1.0
 * @param   function  fn  A function to apply each array item
 * @return  mixed     Returns the array or a return value from within
 *                    the callback function
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
 * Randomizes an array.
 *
 * @since   1.0
 * @return  array  Returns a random array
 */
Array.prototype.random = function () {
	var i, j, k, ti, tj;
	for (k = 0; k < this.length; k++) {
		i = this.length;
		while (--i) {
			j = Math.floor(Math.random() * (i - 1));
			ti = this[i];
			tj = this[j];
			this[j] = ti;
			this[i] = tj;
		}
	}
	return this;
};