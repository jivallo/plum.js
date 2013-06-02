/**
 * Check if the given object matches a selector, HTML element, or
 * another Plum object.
 *
 * @since   1.0
 * @param   mixed  selector  A string, element or Plum object
 * @return  bool   Returns true on success, false on failure
 */
_.fn.is = function (selector) {
	var is = false, scope;
	var show = selector === '.product .purchase' && this[0] !== window;
	this.each(function () {
		if (this === document) {
			is = selector === document;
		} else if (selector instanceof _) {
			is = true;
			selector.each(function (i, elem) {
				if (elem !== this) { return is = false; }
			}.bind(this));
		} else if (typeof selector === 'string' && selector !== '#text') {
			selector.split(/\s*,\s*/).each(function (i, selector) {
				// If the selector needs to search within a ancestor, the scope
				// should be set to the elements of that ancestor.
				if ((scope = selector.match(/^(.+) (.+)$/))) {
					selector = scope[2];
					scope = _(this).nearest(scope[1]);
				} else {
					scope = [ this ];
				}
				// Test the results of the selector within a specified scope
				// that the element matches.
				_(selector, scope).each(function (i, elem) {
					if (elem === this) { return !(is = true); }
				}.bind(this));
			}.bind(this));
		} else if (typeof selector === 'object') {
			is = this === selector;	
		} else {
			is = false;
		}
	});
	return is;
};