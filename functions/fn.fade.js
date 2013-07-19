/**
 * Fades an element's visibility.
 *
 * The first argument accounts for the type of fading. This value can be
 * one of "in," "out," "left," "right," "up" or "down.". Directional
 * fading uses the same end styling as the _.fn.slide styles.
 *
 * @since   1.0
 * @param   object  options  A list of key-value options to use when fading
 * @return  object  Returns a Plum object
 */
_.fn.fade = function (options) {
	var options = options || {},
		direction = options.direction || 'out';
	return this.queue(function () {
		var elem = _(this),
			hiding = /^(?:up|left|out)$/.test(direction),
			style = _.tween.slide.call(this, direction);
		style[0].opacity = elem.style('opacity');
		style[1].opacity = /^(?:\d\.\d+|\.?\d+)$/.test(direction) ? direction
			: (hiding ? 0 : 1);
		if (/^(?:in|out)$/.test(direction)) {
			delete style[0].height;
			delete style[0].width;
		}
		if (!hiding) {
			if (elem.is(':hidden')) {
				elem.style({
					display: style[1].display || 'block',
					opacity: 0,
					overflow: 'hidden',
					visibility: 'visible'
				});
				style[0].opacity = 0;
			}
		}
		_.tween.call(this, {
			complete: options.complete,
			duration: options.duration,
			easing: options.easing,
			end: style[1],
			start: style[0]
		});
	});
};