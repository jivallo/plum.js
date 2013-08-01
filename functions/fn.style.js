/**
 * Modifies or gets an element's CSS.
 *
 * Applies static styles to each matched element or gets the requested style
 * property.
 *
 * @since   1.0
 * @param   mixed   prop   The property to retrieve or properties to set
 * @param   object  value  The element to style or retrieve
 * @return  mixed   Returns a style value or a Plum object
 */
_.style = function (prop, value) {
	return _.style[
		typeof prop === 'string'
			|| prop === undefined
			|| prop instanceof Array
		? 'get'
		: 'set'
	](this instanceof _ ? this : value, prop);
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
_.style.prefix = (function () {
	var prefix = /^(Moz|webkit|Khtml|O|ms|Icab)(?=[A-Z])/, p;
	for (p in document.documentElement.style) {
		if (prefix.test(p)) {
			return p.match(prefix)[0];
		}
	}
	return '';
}());
_.style.prop = {};

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
	var auto = /^(?:0px|auto)$/,
		value,
		property = property === 'float' ? 'cssFloat' : property,
		prefix = (_.style.prefix + '-' + property).toCamelCase();
	if (property === 'outerHeight') {
		value = this.offsetHeight + _.sum(_.style.get(this, [ 'marginBottom', 'marginTop' ]));
	} else if (property === 'outerWidth') {
		value = this.offsetWidth + _.sum(_.style.get(this, [ 'marginLeft', 'marginRight' ]));
	} else if (/^scroll(?:Left|Top)$/.test(property)) {
		value = this[property];
	} else if (this && this.style) {
		property = prefix in this.style ? prefix : property;
		value = this.style[property];
		value = value || window.getComputedStyle(this)[property];
		value = property === 'width' && auto.test(value) ? this.offsetWidth
			: property === 'height' && auto.test(value) ? this.offsetHeight
			: value;
	} else if (this === window && /^(?:height|width)$/.test(property)) {
		value = this[('outer-' + property).toCamelCase()];
	}
	return _.style.match.pixel.test(value) ? parseFloat(value) : value;
};

/**
 * Returns the element's style value of the requested style.
 *
 * @since   1.0
 * @param   object  elem  The Plum object
 * @param   string  prop  The style property to get
 * @param   mixed   Returns the style value
 */
_.style.get = function (elem, prop) {
	var css,
		match = _.style.match,
		parse = _.style.parse;
	elem = elem instanceof _ ? elem[0] : elem;
	if (!elem) { return; }
	if (typeof prop === 'string') { return parse.call(elem, prop); }
	if (prop instanceof Array) {
		css = {};
		prop.each(function (i, prop) { css[prop] = parse.call(elem, prop); });
		return css;
	}
	css = {};
	for (prop in elem.style) {
		if (typeof elem.style[prop] === 'string' && i !== 'cssText') {
			css[prop] = parse.call(elem, prop);
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
	return elem.each(function (p) {
		var css = this.style,
			change = [],
			prop,
			value;
		for (prop in style) {
			prop = prop === 'float' ? 'cssFloat' : prop;
			prop = prop.toCamelCase();
			value = style[prop];
			change.push(prop);
			if (/^scroll(?:Left|Top)$/.test(prop)) {
				this[prop] = value;
			} else if (_.style.prop[prop]) {
				_.style.prop[prop].call(this, css, value);
			} else if (/^(?:opacity|zIndex)$/.test(prop)) {
				css[prop] = value;
			} else if (match.pixel.test(value)) {
				css[prop] = parseFloat(value) + 'px';;
			} else {
				p = (_.style.prefix + '-' + prop).toCamelCase();
				css[p in css ? p : prop] = value;
			}
		}
		_(this).fire('style', change);
	});
};

_.fn.style = _.style;