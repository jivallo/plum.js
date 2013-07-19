/**
 * Shows an element's visibility.
 *
 * @since    1.0
 * @return   object  Returns a Plum object
 */
_.fn.show = function () {
	var block = /^(address|blockquote|body|center|dir|div|dl|fieldset|form|h[1-6]|hr|isindex|menu|noframes|noscript|ol|p|pre|table|ul|dd|dt|frameset|li|tbody|td|tfoot|th|thead|tr|html)$/;
	return this.style({ display: '' }).each(function () {
		var elem = _(this);
		if (elem.style('display') === 'none') {
			elem.style({ display: block.test(this.nodeName.toLowerCase()) ? 'block' : 'inline' });
		}
	});
};