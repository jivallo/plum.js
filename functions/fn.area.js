/**
 * Gets the offset and position of the given element.
 *
 * @since   1.0
 * @return  object  Returns the offset and position of the first group element
 */
_.fn.area = function () {
	var elem = this[0],
		area,
		body,
		doce;
	if (!elem) { return {}; }
	area = {
		x: elem.offsetLeft,
		y: elem.offsetTop,
		height: 0,
		width: 0
	};
	// Get document dimensions.
	if (elem === document) {
		body = elem.body;
		doce = elem.documentElement;
		area.height = Math.max(
			Math.max(body.scrollHeight || 0, elem.scrollHeight || 0),
			Math.max(body.offsetHeight || 0, elem.offsetHeight || 0),
			Math.max(body.clientHeight || 0, elem.clientHeight || 0)
		);
		area.width = Math.max(
			window.innerWidth,
			Math.max(body.offsetWidth || 0, doce.offsetWidth || 0),
			Math.max(body.clientWidth || 0, doce.clientWidth || 0)
		);
	// Get window dimensions.
	} else if (elem === window) {
		area.height = window.innerHeight;
		area.width = window.innerWidth;
	// All other element dimensions.
	} else {
		area.height = elem.offsetHeight;
		area.width = elem.offsetWidth;
		if (elem.parentNode) {
			elem = elem.parentNode;
			do {
				area.x += elem.offsetLeft || 0;
				area.y += elem.offsetTop || 0;
			} while (elem = elem.parentNode);
		}
	}
	return area;
};