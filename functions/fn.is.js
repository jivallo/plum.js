/**
 * Check if the given object matches a selector, HTML element, or
 * another Plum object.
 *
 * @since   1.0
 * @param   mixed  selector  A string, element or Plum object
 * @return  bool   Returns true on success, false on failure
 */
_.fn.is = function (selector) {
	var is, self = this;
	if (typeof selector === 'string') {
		is = selector.split(/\s*,\s*/).each(function () {
			var scope = (this.match(/([^\s>\+~]+)[\s>\+~]/) || [])[0];
			scope = _.parse(this, scope ? _(scope) : self);
			for (var i = 0, l = self.length; i < l; i++) {
				if (!~scope.indexOf(self[i])) { return false; }
			}
		});
	} else if (selector instanceof _ || selector.length || selector.nodeType) {
		selector = _(selector);
		is = selector.each(function () {
			for (var i = 0, l = self.length; i < l; i++) {
				if (self[i] !== this) { return false; }
			}
		});
	}
	return is ? true : false;
};