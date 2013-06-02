/**
 * Queues a list of tween functions to run after each finishes.
 *
 * @since   1.0
 * @param   function  status  The function to run for each interval
 * @return  object    Returns a Plum object
 */
_.fn.queue = function (status) {
	return this.each(function (i) {
		var tween = this.plum.tween;
		if (typeof status === 'function') {
			tween.methods.push(status);
			if (!tween.queue) {
				tween.run++;
				status.call(this, i);
			} else if (!tween.active) {
				tween.methods[tween.run++].call(this, i);
			}
		} else {
			tween.queue = Boolean(status);
		}
	});
};