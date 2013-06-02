
/**
 * Pseudo-selector callback functions.
 *
 * When plum.parse encounters a pseudo selector while parsing a string, the
 * relevant callback function will be called to determine whether or not the
 * current element should be included in the resulting array.
 *
 * @since   1.0
 * @param   array  elements  The complete list of elements before pseudo methods
 * @param   int    i         Current element index in the test loop
 * @param   int    index
 * @return  bool   Returns true if the element was matched, false otherwise
 */
_.pseudo = {
	action: function () {
		return /^(?:button|input)$/.test(this.nodeName.toLowerCase())
			&& /^(?:button|reset|submit)$/.test(this.type);
	},
	between: function (elements, i, between) {
		between = between.split(/\s*,\s*/);
		between[0] = parseInt(between[0], 10);
		between[1] = parseInt(between[1], 10);
		return elements.indexOf(this) >= between[0]
			&& between[1] >= elements.length - 1;
	},
	button: function () { return this.type === 'button'; },
	checkbox: function () { return this.type === 'checkbox'; },
	checked: function () { return this.checked; },
	color: function () {
		var type = this.attributes.type;
		return type && type.value === 'color';
	},
	date: function () {
		var type = this.attributes.type;
		return type && type.value === 'date';
	},
	datetime: function () {
		var type = this.attributes.type;
		return type && type.value === 'datetime';
	},
	datetimeLocal: function () {
		var type = this.attributes.type;
		return type && type.value === 'datetime-local';
	},
	disabled: function () { return this.disabled; },
	email: function () {
		var type = this.attributes.type;
		return type && type.value === 'email';
	},
	empty: function () {
		return _.pseudo.input.call(this)
			? !this.value
			: !this.firstChild;
	},
	enabled: function () {
		return _.pseudo.input.call(this)
			&& !this.disabled
			&& this.type !== 'hidden';
	},
	even: function (elements, i) { return !(i % 2); },
	file: function () { return this.type === 'file'; },
	firstChild: function () { return this.parentNode.firstChild === this; },
	gt: function (elements, i, index) {
		return elements.indexOf(this) > parseInt(index, 10);
	},
	image: function () { return this.type === 'image'; },
	index: function (elements, i, index) {
		return elements.indexOf(this) === parseInt(index, 10);
	},
	input: function () {
		return /^(?:button|input|select|textarea)$/.test(this.nodeName.toLowerCase());
	},
	hidden: function () { return !_.pseudo.visible.call(this); },
	lang: function () { },
	lastChild: function () { return this.parentNode.lastChild === this; },
	link: function () { return this.nodeName.toLowerCase() === 'a'; },
	lt: function (elements, i, index) {
		return elements.indexOf(this) < parseInt(index, 10);
	},
	month: function () {
		var type = this.attributes.type;
		return type && type.value === 'month';
	},
	nthChild: function (elements, i, x) {
		if (x === 'odd') { return i % 2; }
		if (x === 'even') { return !(i % 2); }
		if (!(x = x.match(/^\s*(\+|\-)?(\d*)(n)?(?:\s*(\+|\-)\s*(\d+))?\s*$/))) { return false; }
		var j = 0,
			jLength = elements.length,
			index = _.parse.children([ this.parentNode ]).indexOf(this) + 1;
		x = [
			parseInt(x[2] === '' ? 1 : x[2], 10) * (x[1] === '-' ? -1 : 1),
			parseInt(x[5] === undefined ? 0 : x[5], 10) * (x[4] === '-' ? -1 : 1)
		];
		for (; j < jLength; ) {
			if (x[0] * j++ + x[1] === index) {
				return true;
			}
		}
		return false;
	},
	not: function (elements, i, selector) {
		return !_(this).is(selector);
	},
	number: function () {
		var type = this.attributes.type;
		return type && type.value === 'number';
	},
	odd: function (elements, i) { return i % 2; },
	onlyChild: function () {
		var children = this.parentNode.children;
		return children.length === 1 && this === children[0];
	},
	radio: function () { return this.type === 'radio'; },
	reset: function () { return this.type === 'reset'; },
	search: function () {
		var type = this.attributes.type;
		return type && type.value === 'search';
	},
	selected: function () { return this.selected; },
	submit: function () { return this.type === 'submit'; },
	tel: function () {
		var type = this.attributes.type;
		return type && type.value === 'tel';
	},
	text: function () {
		var type = this.attributes.type;
		return !type || type.value === 'text';
	},
	time: function () {
		var type = this.attributes.type;
		return type && type.value === 'time';
	},
	url: function () {
		var type = this.attributes.type;
		return type && type.value === 'url';
	},
	visible: function () {
		var style = _(this).style([ 'display', 'visibility', 'opacity' ]);
		return !(this.hidden
			|| style.display === 'none'
			|| style.visibility === 'hidden'
			|| !style.opacity);
	},
	week: function () {
		var type = this.attributes.type;
		return type && type.value === 'week';
	}
};