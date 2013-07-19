/**
 * Slides an element's visibility.
 *
 * @since   1.0
 * @param   object  options  A list of key-value options to use when sliding
 * @return  object  Returns a Plum object
 */
_.fn.slide = function (options) {
	var options = options || {},
		direction = options.direction || 'left';
	return this.queue(function (i) {
		var elem = _(this), style = _.tween.slide.call(this, direction);
		if (elem.is(':hidden') && (direction === 'down' || direction === 'right')) {
			elem.style({
				display: style[1].display,
				visibility: 'visible'
			});
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