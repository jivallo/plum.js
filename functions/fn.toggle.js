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
	var i = 0, node;
	return this.each(function () {
		var elem = _(this);
		// Set a boolean property value.
		if (typeof this[property] === 'boolean') {
			this[property] = !this[property];

		// Slide or fade the element's visibility. The "value" argument refers to
		// the speed at which the element should slide or fade.
		} else if ((node = property.match(/^(slide|fade)(?:\.(horizontal|vertical))?$/))) {
			if (elem.is('hidden')) {
				property = node[1]
					? (node[1] === 'vertical' ? 'down' : 'right')
					: (node[0] === 'fade' ? 'in' : 'down');
			} else {
				property = node[1]
					? (node[1] === 'vertical' ? 'up' : 'left')
					: (node[0] === 'fade' ? 'out' : 'up');
			}
			elem.slide({ direction: property, duration: value, complete: callback });

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