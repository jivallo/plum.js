/**
 * Begins a tween animation.
 *
 * @since   1.0
 * @return  object  Returns a Plum object
 */
_.fn.go = function () {
	return this.each(function () {
		var tween = this.plum.tween;
		if (tween.run === tween.methods.length) {
			tween.looped++;
			tween.run = 0;
			if (!tween.loop || tween.loop === tween.looped) {
				tween.methods = [];
				tween.looped = 0;
			}
		}
		if (tween.methods.length) {
			tween.methods[tween.run++].call(this);
		}
	});
};