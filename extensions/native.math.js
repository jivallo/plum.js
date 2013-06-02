/**
 * Animation easing calculations.
 *
 * @since   1.0
 * @param   number  x  The animation completion percentage as a float
 * @param   number  t  The current time/position of the tween
 * @param   number  b  The starting property value
 * @param   number  c  The change between the start and end of the value
 * @param   number  d  The total time of the tween
 * @return  number  Returns the calculated property value
 */
Math.tween = {
	linear: function (x, t, b, c, d) {
		return c * t / d + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s = 1.70158, p = d * 0.3, a = c;
		if (t === 0) { return b; }
		if ((t /= d) === 1) { return b + c; }
		if (a < Math.abs(c)) { a = c; s = p / 4; }
		else { s = p / (2 * Math.PI) * Math.asin(c / a); }
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	easeInQuad: function (x, t, b, c, d) {
		return c * (t /= d) * t + b;
	}
};