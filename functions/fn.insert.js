/**
 * Adds HTML or text to an element.
 *
 * Supports "before," "prepend," "after," and "append" (default).
 *
 * @since   1.0
 * @param   mixed   html      The HTML to insert
 * @param   string  position  Where the HTML should be inserted
 * @return  object  Returns a Plum object
 */
_.fn.insert = function (html, position) {
	var elem = this, node, func, parent, str = false;
	if (position === 'into') {
		html = _(html);
	} else if (html instanceof Object && html.nodeName) {
		html = [ html ];
	} else if (typeof html === 'string' || typeof html === 'number') {
		str = true;
		html += '';
		if (elem.is('style')) {
			html = [ document.createTextNode(html) ];
		} else if (~html.indexOf('<') && ~html.indexOf('>')) {
			_.hidden.innerHTML = html;
			html = _.hidden.children;
			html = _.array(html[html[0].childNodes.length ? 0 : 1].childNodes);
		} else {
			_.hidden.innerHTML = html;
			html = _.hidden.children[1].innerHTML;
			html = [ document.createTextNode(html) ];
		}
	}
	if (position === 'into') {
		html.insert(elem);
	} else if (html) {
		elem.each(function () {
			switch (position) {
				case 'after':
					node = this.nextElementSibling;
					func = node === null ? 'appendChild' : 'insertBefore';
					parent = this.parentNode;
					break;
				case 'before':
					node = this;
					func = 'insertBefore';
					parent = this.parentNode;
					break;
				case 'prepend':
					node = this.firstChild;
					func = node === null ? 'appendChild' : 'insertBefore';
					parent = this;
					break;
				case 'replace':
					this.innerHTML = '';
				case 'append':
				default:
					node = null;
					func = 'appendChild';
					parent = this;
					break;
			}
			html.each(function () {
				try {
					var ins = str ? this.cloneNode(true) : this;
					parent[func](ins, node);
					elem.fire('html html.' + (position || 'append'), ins);
				} catch (e) {}
			});
		});
	}
	return elem;
};