// Animations are accomplished with the browser's default animation API if it is
// available. If not, it will fall back to the setTimeout function.
window.requestAnimationFrame = window.requestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.oRequestAnimationFrame
	|| window.msRequestAnimationFrame
	|| function (fn) {
		window.setTimeout(function () { fn((new Date()).getTime());
	}, 1000 / 60); };

/**
 * Animates elements to a certain set of style properties.
 *
 * @since   1.0
 * @param   object  options  A list of key-value options to use when tweening
 * @return  object  Returns a Plum object
 */
_.fn.tween = function (options) {
	return this.queue(function () {
		var i, start = [], style = options.style;
		for (i in style) { start.push(i); }
		_.tween.call(this, {
			complete: options.complete,
			duration: options.duration,
			easing: options.easing,
			end: style,
			start: _(this).style(start)
		});
	});
};

/**
 * Animates a single element.
 *
 * @since   1.0
 * @param   object  options  A list of options to apply to the animation
 * @return  void
 */
_.tween = function (options) {
	var complete = typeof options.complete !== 'function' ? function () {} : options.complete,
		done = true,
		duration = typeof options.duration !== 'number' ? 500 : options.duration,
		easing = typeof options.easing === 'function' ? options.easing
			: Math.tween[options.easing] || Math.tween.linear,
		elem = _(this),
		end = options.end,
		frameEnd,
		frameStart,
		i = 0,
		number = /^(-?\d+\.\d+|-?\.\d+|-?\d+)(px|%|em|in|cm|mm|ex|pt|pc)?$/,
		prop,
		start = options.start,
		step = (new Date()).getTime(),
		tween = this.plum.tween,
		value,
		frame = function () {
			var style = {}, now = (new Date()).getTime() - step;
			if (!tween.active) { return; }
			if (now >= duration) {
				elem.style(end);
				complete.call(elem[0]);
				tween.active = false;
				if (tween.queue) {
					elem.go();
				}
				return;
			}
			for (prop in end) {
				frameStart = String(start[prop]).match(number);
				frameEnd = String(end[prop]).match(number);
				if (frameStart && frameEnd) {
					value = parseFloat(frameStart[1]);
					style[prop] = easing(
						now / duration,
						now,
						value,
						parseFloat(frameEnd[1]) - value,
						duration
					);
					style[prop] += /^(?:opacity|scroll(?:Left|Top))$/.test(prop) ? ''
						: frameEnd[2] || frameStart[2] || 'px';
				}
			}
			elem.style(style);
			window.requestAnimationFrame(frame);
		};

	// If all properties are identical, the animation has already completed
	// and there's no reason to run it.
	tween.active = true;
	for (prop in end) { if (start[prop] !== end[prop]) { done = false; } }
	if (done) { duration = 0; }

	// Begin the animation.
	window.requestAnimationFrame(frame);
};

/*
 * Gets the sliding styles.
 *
 * @since   1.0
 * @param   string  direction  The direction to slide the element
 * @return  array   An array containing the end styles for each element
 */
_.tween.slide = function (direction) {
	var elem = _(this),
		end,
		hiding = /^(?:up|left|out)$/.test(direction),
		props = 'height paddingTop paddingBottom borderTopWidth borderBottomWidth'.split(' '),
		start = _.empty(this.plum.style)
			? (this.plum.style = elem.style(props.concat('display opacity overflow overflowX overflowY width'.split(' '))))
			: this.plum.style,
		temp;
	end = {
		overflow: start.overflow,
		overflowX: start.overflowX,
		overflowY: start.overflowY
	};

	// Force the overflow to hidden start position if the element is meant
	// to be hidden. This prevents weird results when using directional
	// movement.
	if (hiding) {
		end.display = 'none';
		elem.style({ overflow: 'hidden' });
	}

	// Get the initial sliding styles for directional fading.
	if (/^(?:up|down)$/.test(direction)) {
		start.height = elem.style('height');
		if (direction === 'up') {
			end.height = 0;
		} else if (elem.is(':hidden')) {
			elem.style({ display: 'block', height: '', overflow: 'hidden' });
			end = _.merge(end, elem.style(props));
			end.display = 'block';
			elem.style({ display: start.display, height: start.height });
		}
	} else if (/^(?:left|right)$/.test(direction)) {
		start.width = elem.style('width');
		if (direction === 'left') {
			end.width = 0;
		} else if (elem.is(':hidden')) {
			elem.style({ display: '', overflow: 'hidden', width: '' });
			end.display = 'block'
			end.width = elem.style('width');
			elem.style({ width: start.width });
		}
	}
	return [ start, end ];
};