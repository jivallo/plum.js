/**
 * Pauses an animation or delays execution of a function.
 *
 * @since   1.0
 * @param   number    duration  The duration to pause
 * @param   function  callback  A function to run after pause has completed
 * @return  object  Returns a Plum object
 */
_.fn.pause = function (duration, callback) {
	return this.each(function () {
		if (typeof callback === 'function') {
			window.setTimeout(function () {
				callback.call(this);
			}.bind(this), duration);
		}
	});
};