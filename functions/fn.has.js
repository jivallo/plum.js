/**
 * Checks if the element has a given property.
 *
 * @since    1.0
 * @param    string  prop   The type of property to search for
 * @param    string  value  The value of the property
 * @param    string  begin  Search for properties that begin with the value
 * @return   bool    Returns true if the property and value exist
 */
_.fn.has = function (prop, value, begin) {
	if (this[0] === document) { return false; }
	switch (prop) {
		case 'attr':
			begin = false;
			this.each(function () {
				prop = _.array(this.attributes).each(function (i, attr) {
					if (attr.name === value) {
						return attr.name;
					}
				});
				if (prop === value) {
					return !(begin = true);
				}
			});
			return begin;
		case 'class':
			begin = begin ? '[^\\s]*' : '';
			value = value.split(/\s+/).join(begin + '|') + begin;
			value = new RegExp('(?:^| )(?:' + value + ')(?: |$)');
			value = this.each(function () {
				return typeof this.className === 'string' ? this.className.match(value) : null;
			});
			(value || []).each(function (i, prop) {
				value[i] = prop.trim();
			});
			return value ? value : false;
		default: return false;
	}
};