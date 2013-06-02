/**
 * Toggles an aspect of the given elements.
 *
 * @since   1.0
 * @param   string    property  Toggle the value for... (e.g., "class")
 * @param   mixed     value     The value to toggle
 * @param   function  callback  A function to run after completion
 * @return  object  Returns a Plum object
 */
_.fn.toggle = function (property, value, callback) {
	var i = 0, iLength, node;
	return this.each(function () {
		var elem = _(this), hidden = elem.is(':hidden');
		// Set a boolean property value.
		if (typeof this[property] === 'boolean') {
			this[property] = !this[property];

		// Slide the element's visibility. "value" will refer to the speed at
		// which the element should slide or fade.
		} else if (property === 'slide') {
			elem.slide({
				direction: hidden ? 'down' : 'up',
				duration: value,
				complete: callback
			});

		// Slide the element to the left or right.
		} else if (property === 'slide.horizontal') {
			elem.slide({
				direction: hidden ? 'right' : 'left',
				duration: value,
				complete: callback
			});

		// Fade the element's visibility.
		} else if (property === 'fade') {
			elem.fade({
				direction: hidden ? 'in' : 'out',
				duration: value,
				complete: callback
			});

		// Fade vertical directional visibility.
		} else if (property === 'fade.vertical') {
			elem.fade({
				direction: hidden ? 'down' : 'up',
				duration: value,
				complete: callback
			});

		// Fade horizontal directional visibility.
		} else if (property === 'fade.horizontal') {
			elem.fade({
				direction: hidden ? 'right' : 'left',
				duration: value,
				complete: callback
			});

		// Swap the element's class names.
		} else if (property === 'class') {
			value.split(/\s+/).each(function (i, value) {
				elem.attr('class', value, !elem.has('class', value));
			});

		// When no value is set, assume CSS visibility should be toggled
		} else if (!value) {
			node = _(this).style('display');
			this.style.display = this.plum.style.display ? this.plum.style.display
				: node === 'none' ? 'block'
				: 'none';
			this.plum.style.display = node;
		}
	});
};