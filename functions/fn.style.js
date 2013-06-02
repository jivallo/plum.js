/**
 * Modifies or gets an element's CSS.
 *
 * Applies static styles to each matched element or gets the requested style
 * property.
 *
 * @since   1.0
 * @param   mixed   property  The property to retrieve or properties to set
 * @param   object  value     The element to style or retrieve
 * @return  mixed   Returns a style value or a Plum object
 */
_.style = function (property, value) {
	if (this instanceof _) { value = this; }
	return _.style[
		typeof property === 'string'
			|| property === undefined
			|| property instanceof Array
		? 'get'
		: 'set'
	](value, property);
};

_.style.prop = {
	boxSizing: function (style, value) {
		style.MozBoxSizing = value;
		style.MsBoxSizing = value;
		style.WebkitBoxSizing = value;
		style.boxSizing = value;
		return style;
	},
	borderRadius: function (style, value) {
		style.MozBorderRadius = value;
		style.MsBorderRadius = value;
		style.WebkitBorderRadius = value;
		style.borderRadius = value;
		return style;
	},
	opacity: function (style, value) {
		var ie;
		if (_.sp.opacity) {
			style.opacity = value;
		} else {
			ie = parseFloat(value) * 100;
			style['-ms-filter'] = '"progid:DXImageTransform.Microsoft.Alpha(Opacity=' + ie + ')"';
			style['filter'] = 'alpha(opacity=' + ie + ')';
			style['-moz-opacity'] = value;
			style['-khtml-opacity'] = value;
		}
		return style;
	},
	userSelect: function (style, value) {
		style.MozUserSelect = value;
		style.MsUserSelect = value;
		style.WebkitTouchCallout = value;
		style.WebkitUserSelect = value;
		style.userSelect = value;
		return style;
	}
};

_.style.match = {
	pixel: /^-?(?:\d+\.\d+|\.\d+|\d+)(?:px)?$/,
	rgba: new RegExp(
		'^\\s*rgba\\s*\\(' +
		'\\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\s*,' +
		'\\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\s*,' +
		'\\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\s*,' +
		'\\s*(\\d?(?:\\.[\\d]+))\\)$'
	),
	shorthand: /(?:(\d+)(?:px\s+)?\s*)/g
};

/**
 * RGBa support for < IE9.
 *
 * @since   1.0
 * @param   object  elem  The HTML element
 * @param   array   rgba  The parts of an RGBa string
 * @return  void
 */
_.style.rgba = function (elem, rgba) {
	var style = elem.style,
		filter = 'progid:DXImageTransform.Microsoft.gradient',
		color = ('0' + Math.round(rgba[4] * 255).toString(16)).slice(-2)
			+ (rgba[3] | (rgba[2] << 8) | (rgba[1] << 16)).toString(16);
	style['background'] = 'transparent';
	style['-ms-filter'] = '"' + filter + '(startColorstr=#' + color + ',endColorstr=#' + color + ')"';
	style['filter'] = filter + '(startColorstr=#' + color + ',endColorstr=#' + color + ')';
	style['zoom'] = 1;
};

/**
 * Converts a shorthand property value to an array of numbers referencing top,
 * right, bottom and left.
 *
 * @since   1.0
 * @param   string  value  The shorthand property value
 * @return  array   Returns an array of values
 */
_.style.shorthand = function (value) {
	value = value.match(_.style.match.shorthand);
	return value ? [
		(value[0] = parseInt(value[0], 10)),
		value[1] !== undefined ? parseInt(value[1], 10) : value[0],
		value[2] !== undefined ? parseInt(value[2], 10) : value[0],
		value[3] !== undefined ? parseInt(value[3], 10)
			: value[1] !== undefined ? parseInt(value[1], 10)
			: value[0]
	] : [ 0, 0, 0, 0 ];
};

/**
 * Get the inline or computed value of a style property. If the value is "auto"
 * and the property "width" or "height", the offset width or height should be
 * returned.
 *
 * @since   1.0
 * @param   string  property  The style property to calculate
 * @return  mixed   Returns the calculated property value
 */
_.style.parse = function (property) {
	var auto = /^(?:0px|auto)$/, value;
	property = property === 'float' ? 'cssFloat' : property;
	if (/^scroll(?:Left|Top)$/.test(property)) {
		return this[property];
	}
	if (this && this.style) {
		value = this.style[property];
		value = value || window.getComputedStyle(this)[property];
		return property === 'width' && auto.test(value) ? this.offsetWidth
			: property === 'height' && auto.test(value) ? this.offsetHeight
			: value;
	}
	if (this === window && /^(?:height|width)$/.test(property)) {
		return this[('outer-' + property).toCamelCase()];
	}
};

/**
 * Returns the element's style value of the requested style.
 *
 * @since   1.0
 * @param   object  elem   The Plum object
 * @param   string  style  The style property to get
 * @param   mixed   Returns the style value
 */
_.style.get = function (elem, style) {
	var css, i, match = _.style.match, parse = _.style.parse;
	elem = elem[0];
	if (typeof style === 'string') {
		i = style.replace(/([A-Z])/, '-$1').toLowerCase();
		i = style.replace(/-([a-z])/g, function (a, b) { return b.toUpperCase(); });
		css = parse.call(elem, i);
		return match.pixel.test(css) ? parseFloat(css) : css;
	}
	if (style instanceof Array) {
		css = {};
		style.forEach(function (property, i) {
			var style = parse.call(elem, property);
			style = match.pixel.test(style) ? parseFloat(style) : style;
			css[property] = style;
		});
		return css;
	}
	css = {};
	for (i in elem.style) {
		if (typeof elem.style[i] === 'string' && i !== 'cssText') {
			style = parse.call(elem, i);
			style = match.pixel.test(style) ? parseFloat(style) : style;
			css[i === 'cssFloat' ? 'float' : i] = style;
		}
	}
	return css;
};

/**
 * Sets each element's style to the given key-value pairs.
 *
 * @since   1.0
 * @param   object  elem   The Plum object
 * @param   string  style  The style properties and values
 * @return  object  Returns a Plum object
 */
_.style.set = function (elem, style) {
	var match = _.style.match;
	return elem.each(function () {
		var css = this.style, find, prop, value;
		for (prop in style) {
			prop = prop === 'float' ? 'cssFloat' : prop;
			prop = prop.toCamelCase();
			value = style[prop];
			if (/^scroll(?:Left|Top)$/.test(prop)) {
				this[prop] = value;
			} else if (_.style.prop[prop]) {
				_.style.prop[prop].call(this, css, value);
			} else if (prop === 'zIndex') {
				css[prop] = value;
			} else if (match.pixel.test(value)) {
				css[prop] = parseFloat(value) + 'px';
			} else if (value && (find = value.match(match.rgba)) && !_.sp.rgba) {
				_.style.rgba(this, find);
			} else {
				css[prop] = value;
			}
		}
		_(this).fire('style', css);
	});
};

_.fn.style = _.style;