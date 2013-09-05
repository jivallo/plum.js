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
	var elem = this,
		orig,
		node,
		func,
		parent,
		i,
		l;
	if (position === 'into') {
		_(html).insert(elem);
		return elem;
	}
	if (typeof html === 'string' || typeof html === 'number') {
		html += '';
		orig = html;
		if (elem.is('style') && !(
			position === 'after'
			|| position === 'before'
			|| position === 'replace'
		)) {
			html = [ document.createTextNode(html) ];
		} else {
			_.hidden.innerHTML = html;
			html = _.array(_.hidden.childNodes);
		}
	}
	html = _(html);
	html.length && elem.each(function () {
		switch (position) {
			case 'after': {
				node = this.nextElementSibling;
				func = node === null ? 'appendChild' : 'insertBefore';
				parent = this.parentNode;
				break;
			}
			case 'before': {
				node = this;
				func = 'insertBefore';
				parent = this.parentNode;
				break;
			}
			case 'prepend': {
				node = this.firstChild;
				func = node === null ? 'appendChild' : 'insertBefore';
				parent = this;
				break;
			}
			case 'replace':
			case 'append':
			default: {
				if (position === 'replace' && orig) {
					this.innerHTML = orig;
				} else {
					position === 'replace' && (this.innerHTML = '');
					position = 'append';
					node = null;
					func = 'appendChild';
					parent = this;
				}
				break;
			}
		}
		position !== 'replace' && html.each(function (elem) {
			elem = this.nodeName.toLowerCase() === '#text' ? this.cloneNode() : this;
			parent && parent[func](elem, node);
		});
		elem.fire('html.' + position);
	});
	return elem;
};