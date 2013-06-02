/**
 * Scrolls an element to a specified position in a specified direction.
 *
 * @since   1.0
 * @param   object  o  The list of options for the scroll tween
 * @return  object  Returns a Plum object
 */
_.fn.scroll = function (o) {
	o = _.merge({
		direction: 'top',
		duration: 500,
		easing: 'linear',
		to: 0,
		mousebottom: null,
		mouseleft: null,
		mouseright: null,
		mousetop: null,
		style: {},
		callback: function () {},
		mouseleave: function () {}
	}, o);

	if (o.mousebottom !== null
		|| o.mouseleft !== null
		|| o.mouseright !== null
		|| o.mousetop !== null
	) {
		return this.on({
			mousemove: function (event) {
				var elem = _(this),
					area = elem.area();
				o.style = {};

				// Scroll to the element's top.
				if (o.mousetop !== null && event.pageY < area.y + o.mousetop) {
					o.style.scrollTop = 0;
					o.duration = this.scrollTop / this.scrollHeight * 2000;
				}

				// Scroll to the element's right side.
				if (o.mouseright !== null && event.pageX > area.x - area.width - o.mouseright) {
					o.style.scrollLeft = this.scrollWidth - area.width;
					o.duration = (this.scrollWidth - this.scrollLeft - area.width) / this.scrollWidth * 2000;
				}

				// Scroll to the element's bottom.
				if (o.mousebottom !== null
					&& event.pageY > area.y + area.height - o.mousebottom) {
					o.style.scrollTop = this.scrollHeight - area.height;
					o.duration = (this.scrollHeight - this.scrollTop - area.height) / this.scrollHeight * 2000;
				}

				// Scroll to the element's left side.
				if (o.mouseleft !== null && event.pageX < area.x - o.mouseleft) {
					o.style.scrollLeft = 0;
					o.duration = this.scrollLeft / this.scrollWidth * 2000;
				}

				if (o.style.scrollTop === undefined || o.style.scrollLeft === undefined) {
					elem.stop();
				}

				// Only animate if the element is not already scrolling.
				if (!this.plum.tween.active) {
					_(this).tween(o);
				}
			},
			mouseleave: function (event) { _(this).stop(); }
		});
	}

	o.direction = ('scroll-' + (o.direction || '').toLowerCase()).toCamelCase();
	o.to = parseFloat(o.to);
	if (o.direction === 'scroll-') {
		o.style = { scrollLeft: o.to, scrollTop: o.to };
	} else {
		o.style = {};
		o.style[o.direction] = o.to;
	}

	return this.tween(o);
};