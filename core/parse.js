/**
 * Plum CSS selector parsing.
 *
 * @since   1.0
 * @param   string  find   The selector to look for
 * @param   object  scope  The context in which elements are found
 * @return  array   Returns the list of found elements
 */
_.parse = function (find, scope) {
	scope = scope || document;
	if (find === 'body') { return [ document.body ]; }
	else if (find === 'html') { return [ document.documentElement ]; }
	else if (scope.querySelectorAll) {
		try { return _.array(scope.querySelectorAll(find)); }
		catch (e) {}
	}
	scope = scope === document ? _.parse.elems : scope;
	return _.parse.find(find, scope);
};

_.parse.elems = document.getElementsByTagName('*');
_.parse.match = {
	attributes: /\[\s*([\w\u00c0-\uffff\-]+?)\s*(?:([~^$*|!])?=\s*(?:'(.*?)'|"(.*?)"|(.*?)))?\s*\]/g,
	chunk: /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/,
	classes: /\.((?:[\w\u00c0-\uffff\-]|\\.)+)/g,
	id: /#([^'"\[:]+)/,
	node: /^([\w\u00c0-\uffff\-]+)/,
	pseudo: /:((?:[\w\u00c0-\uffff\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/g
};

/**
 * Selects all elements at the same level following the current element.
 *
 * @since   1.0
 * @param   array  parentNode  The list of current elements
 * @return  array  Returns the list of adjacent elements
 */
_.parse.adjacent = function (parentNode) {
	var i = 0,
		iLength = parentNode.length,
		elements = [], 
		node,
		children;
	for (; i < iLength; i++) {
		node = parentNode[i];
		children = _.array(node.parentNode.children);
		children = children.slice(children.indexOf(node) + 1);
		elements = elements.concat(children);
	}
	return _.unique(elements);
};

/**
 * Selects all ancestors to the current element.
 *
 * @since   1.0
 * @param   array  childNode  The list of current elements
 * @return  array  Returns the list of ancestors
 */
_.parse.ancestors = function (childNode) {
	var i = 0,
		iLength = childNode.length,
		elements = [],
		node,
		parent;
	for (; i < iLength; i++) {
		node = childNode[i];
		while (node.parentNode) {
			node = node.parentNode;
			elements.push(node);
		}
	}
	return _.unique(elements);
};

/**
 * Selects direct children of the current element.
 *
 * @since   1.0
 * @param   array  parentNode  The list of current elements
 * @return  array  Returns the list of children
 */
_.parse.children = function (parentNode) {
	var i = 0,
		iLength = parentNode.length,
		j,
		jLength,
		elements = [],
		node;
	for (; i < iLength; i++) {
		if (!(node = parentNode[i].children)) { continue; }
		for (j = 0, jLength = node.length; j < jLength; j++) {
			elements.push(node[j]);
		}
	}
	return elements;
};

/**
 * Selects all descendants of the current element
 *
 * @since   1.0
 * @param   array  parentNode  The list of current elements
 * @return  array  Returns the list of descendants
 */
_.parse.descendants = function (parentNode) {
	var i = 0,
		iLength = parentNode.length,
		j,
		jLength, 
		elements = [],
		node;
	for (; i < iLength; i++) {
		if (!(node = parentNode[i].children)) { continue; }
		for (j = 0, jLength = node.length; j < jLength; j++) {
			elements.push(node[j]);
			if (node[j].children.length) {
				elements = elements.concat(this.descendants([ node[j] ]));
			}
		}
	}
	return elements;
};

/**
 * Selects direct parents of the current element.
 *
 * @since   1.0
 * @param   array  childNode  The list of current elements
 * @return  array  Returns the list of parents
 */
_.parse.parent = function (childNode) {
	var i = 0, iLength = childNode.length, elements = [], node;
	for (; i < iLength; i++) {
		node = childNode[i].parentNode;
		if (node) {
			elements.push(node);
		}
	}
	return elements;
};

/**
 * Selects the next sibling of the current element
 *
 * @since   1.0
 * @param   array  parentNode  The list of current elements
 * @return  array  Returns the list of siblings
 */
_.parse.siblings = function (parentNode) {
	var i = 0,
		iLength = parentNode.length,
		elements = [],
		node;
	for (; i < iLength; i++) {
		node = parentNode[i].nextElementSibling;
		if (node) {
			elements.push(node);
		}
	}
	return elements;
};

/**
 * Parses a selector into its elements.
 *
 * @since   1.0
 * @param   string  find   The selector to look for
 * @param   array   scope  The context in which elements are found
 * @param   array   elems  The current list of elements
 * @return  array   Returns the list of found elements
 */
_.parse.find = function (find, scope, elems) {
	elems = elems || [];
	var a,
		attr,
		attrs,
		b,
		classes,
		cxt = scope,
		elem,
		i,
		id,
		iLength,
		j,
		jLength,
		loopElems,
		match,
		modifier,
		node,
		pseudo,
		pseudoElems,
		regex = _.parse.match,
		search = 'self';

	// Loop through the selector to find the requested elements.
	do {
		match = find.match(regex.chunk);
		if (!match) { continue; }
		find = match[3];
		pseudo = [];
		switch (match[1]) {
			case '>': search = 'children'; continue;
			case '+': search = 'siblings'; continue;
			case '~': search = 'adjacent'; continue;
			default:
				if (_.parse[search]) { cxt = _.parse[search](loopElems); }
				loopElems = [];
				pseudoElems = [];
				id = (match[1].match(regex.id) || [])[1];
				node = (match[1].match(regex.node) || [ '', '*' ])[1];
				attrs = match[1].match(regex.attributes) || [];
				classes = match[1].match(regex.classes) || [];
				pseudo = match[1].match(regex.pseudo) || [];
				pseudo.forEach(function (fn, i) {
					fn = match[1].substr(match[1].indexOf(fn) + fn.length, 1);
					if ([ '"', "'", ']' ].indexOf(fn) > -1) {
						pseudo.splice(i, 1);
					}
				});
				loop: for (i = 0, iLength = cxt.length; i < iLength; i++) {
					elem = cxt[i];
					if (!elem || elem.nodeName === '#text') { continue loop; }
					// Check the element ID.
					if (id && (!elem.attributes.id || elem.attributes.id.value !== id)) {
						continue loop;
					}
					// Check the element node name.
					if (node !== '*' && elem.nodeName.toLowerCase() !== node) {
						continue loop;
					}
					// Check the element class names.
					for (j = 0, jLength = classes.length; j < jLength; j++) {
						if (!(new RegExp(' ' + classes[j].substr(1) + ' ')).test(' ' + elem.className + ' ')) {
							continue loop;
						}
					}
					// Check the element attributes.
					for (j = 0, jLength = attrs.length; j < jLength; j++) {
						if (typeof attrs[j] === 'string') {
							regex.attributes.exec('');
							attrs[j] = regex.attributes.exec(attrs[j]).slice(1);
							attrs[j] = [
								attrs[j][0],
								attrs[j][1],
								attrs[j][2] || attrs[j][3] || attrs[j][4]
							];
						}
						attr = attrs[j];
						// Attribute doesn't exist, exit.
						if (!elem.attributes[attr[0]]) {
							continue loop;
						}
						// Attribute exists, no value was specified.
						if (attr[2] === undefined) {
							continue;
						}
						// Attribute has a special condition to match
						// the value.
						a = elem.attributes[attr[0]].value;
						b = attr[2];
						if (!(attr[1] === '~' ? (' ' + a + ' ').indexOf(b) > -1
							: attr[1] === '^' ? a.substr(0, b.length) === b
							: attr[1] === '$' ? a.substr(-b.length) === b
							: attr[1] === '*' ? a.indexOf(b) > -1
							: attr[1] === '|' ? a === b || a.substr(0, b.length + 1) === b + '-'
							: attr[1] === '!' ? a !== b
							: a === b)
						) {
							continue loop;
						}
					}
					pseudoElems.push(elem);
				}
				search = 'descendants';
				break;
		}
		jLength = pseudo.length;
		if (!jLength) {
			loopElems = pseudoElems;
		} else {
			// Check each matched set against given pseudo-selectors.
			pseudoElems.forEach(function (elem, i) {
				for (j = 0; j < jLength; j++) {
					if (typeof pseudo[j] === 'string') {
						regex.pseudo.exec('');
						pseudo[j] = regex.pseudo.exec(pseudo[j]).slice(1);
					}
					attr = _.pseudo[pseudo[j][0].toCamelCase()];
					attr = attr && attr.apply(elem, [ pseudoElems, i ].concat(pseudo[j].slice(2)));
					if (attr) {
						loopElems.push(elem);
					} else {
						i = loopElems.indexOf(elem);
						i > -1 && loopElems.splice(i, 1);
						break;
					}
				}
			});
		}
		if (match[2]) { break; }
	} while (match);

	// Merge the element list.
	elems = elems.concat(loopElems);
	elems = _.unique(elems);

	// If selector still remains, continue adding elements.
	if (find) { elems = _.parse.find(find, scope, elems); }

	return elems;
};