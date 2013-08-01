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
				var attr = this.className,
					clsv = typeof attr === 'string' ? attr : attr.baseVal;
				if (action === false) {
					(value === '*' ? '' : value).split(/\s+/).each(function () {
						clsv = clsv.replace(new RegExp('(?:^| )' + this + '(?: |$)'), ' ');
					});
				} else {
					clsv = _.unique((clsv + ' ' + value).trim().split(/\s+/)).join(' ');
				}
				if (clsv) {
					if (typeof attr === 'string') {
						this.className = clsv;
					} else {
						this.className.baseVal = clsv;
					}
				} else {
					this.removeAttribute('class');
				}
			} else {
				this.setAttribute(name, value);
			}
		}).fire('attr.' + name, value);
	}
	if (this[0] && this[0].getAttribute) {
		return name === 'class'
			? (value = this[0].className) && (value.baseVal || value)
			: this[0].getAttribute(name);
	}
	return undefined;
};