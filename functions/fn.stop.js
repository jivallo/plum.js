/**
 * Pauses or stops an animation if available
 *
 * If the "complete" argument is given as true, the current animation will
 * finish its course. After it's finished, no other queued animations will fire.
 *
 * Otherwise, the animation is paused and can be resumed by using _.fn.go.
 *
 * @since   1.0
 * @param   bool    complete  Directive to stop or pause the animation
 * @return  object  Returns a Plum object
 */
_.fn.stop = function (complete) {
	return this.each(function () {
		var tween = this.plum.tween;
		if (complete) {
			tween.loop = false;
			tween.run = tween.methods.length - 1;
		} else {
			tween.active = false;
		}
	});
};