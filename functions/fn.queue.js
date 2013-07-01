/**
 * Queues a list of tween functions to run after each finishes.
 *
 * @since   1.0
 * @param   mixed   callback  The function to run for each interval
 * @return  object  Returns a Plum object
 */
_.fn.queue = function (callback) {
	return this.each(function (i) {
		var tween = this.plum.tween;
		if (typeof callback === 'function') {
			tween.methods.push(callback);
			if (!tween.queue) {
				tween.run++;
				callback.call(this, i);
			} else if (!tween.active) {
				tween.methods[tween.run++].call(this, i);
			}
		} else {
			tween.queue = Boolean(callback);
		}
	});
};