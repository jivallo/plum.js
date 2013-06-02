/**
 * Gets or sets an attribute of a Plum object.
 *
 * @since   1.0
 * @param   string  name    The attribute name to get or set
 * @param   string  value   The attribute value to set
 * @param   bool    action  To remove the attribute, use "false"
 * @return  mixed   Returns a Plum object or attribute value
 */
_.fn.attr = function (name, value, action) {
	if (value !== undefined) {
		return this.each(function () {
			if (typeof this[name] === 'boolean') {
				value = Boolean(value);
				this[name] = value;
				this[value ? 'setAttribute' : 'removeAttribute'](name, value);
			} else if (name === 'class') {
				var elem = this;
				if (value === '*') {
					this.removeAttribute('class');
				} else {
					value.split(/\s+/).each(function () {
						var find = new RegExp('(?:^| )' + this + '(?: |$)');
						if (action === false) {
							elem.className = elem.className.replace(find, ' ');
						} else if (!find.test(elem.className)) {
							elem.className += ' ' + this;
						}
					});
					this.className = this.className.trim().replace(/\s+/g, ' ');
				}
			} else {
				this.setAttribute(name, value);
			}
		}).fire('attr attr.' + name, value);
	}
	if (this[0] && this[0].getAttribute) {
		return name === 'class' ? this[0].className : this[0].getAttribute(name);
	}
	return undefined;
};