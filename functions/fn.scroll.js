/**
 * Scrolls an element to a specified position in a specified direction.
 *
 * @since   1.0
 * @param   object  options  The list of options for the scroll tween
 * @return  object  Returns a Plum object
 */
_.fn.scroll = function (options) {
	options = _.merge({
		complete: function () {},
		direction: 'top',
		duration: 500,
		easing: 'linear',
		to: 0,
		mousebottom: 0,
		mouseleft: 0,
		mouseright: 0,
		mousetop: 0
	}, options);

	options.style = {};
	if (options.mousebottom || options.mouseleft || options.mouseright || options.mousetop) {
		return this.on({
			mousemove: function (event) {
				var elem = _(this),
					area = elem.area(),
					actv = this.plum.tween.active,
					clnX = event.pageX - window.scrollX,
					clnY = event.pageY - window.scrollY,
					move = {
						top: clnY < area.y + options.mousetop,
						right: clnX > area.x + area.width - options.mouseright,
						bottom: clnY > area.y + area.height - options.mousebottom,
						left: clnX < area.x - options.mouseleft
					},
					tween = function (from, to, duration, rev) {
						if (this.plum.tween.active ? false : (rev ? from < to : from > to)) {
							duration *= options.duration;
							elem.tween({ duration: duration, style: { scrollTop: to } });
						}
					}.bind(this);

				// Scroll to the element's top.
				if (move.top) {
					tween(this.scrollTop, 0, this.scrollTop / this.scrollHeight);
				} else if (!move.right && !move.bottom && !move.left) {
					elem.stop();
				}

				// Scroll to the element's right side.
				if (move.right) {
					tween(this.scrollLeft, this.scrollWidth - area.width, (this.scrollWidth - this.scrollLeft - area.width) / this.scrollWidth, true);
				} else if (!move.top && !move.bottom && !move.left) {
					elem.stop();
				}

				// Scroll to the element's bottom.
				if (move.bottom) {
					tween(this.scrollTop, this.scrollHeight - area.height, (this.scrollHeight - this.scrollTop - area.height) / this.scrollHeight, true);
				} else if (!move.top && !move.left && !move.right) {
					elem.stop();
				}

				// Scroll to the element's left side.
				if (move.left) {
					tween(this.scrollLeft, 0, this.scrollLeft / this.scrollWidth);
				} else if (!move.top && !move.right && !move.bottom) {
					elem.stop();
				}
			},
			mouseleave: function (event) { _(this).stop(); }
		});
	}

	options.direction = ('scroll-' + (options.direction || '')).toLowerCase().toCamelCase();
	options.to = options.to.toString().split(/\s+/);
	options.to = [ parseFloat(options.to[0]) || 0, parseFloat(options.to[1] || options.to[0]) || 0 ];
	if (options.direction === 'scroll-') {
		options.style.scrollLeft = options.to[0];
		options.style.scrollTop = options.to[1];
	} else {
		options.style[options.direction] = options.to[options.direction === 'scrollTop' ? 1 : 0];
	}

	return this.tween(options);
};