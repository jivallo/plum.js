// Main Plum.js function.
var _ = function (find, scope) {
	try {
		var i = 0,
			elem = [],
			find = find || '',
			arry = false;
		if (this === undefined || this === window) { return new _(find, scope); }
		if (scope) {
			if (scope[0] === document) { scope = document; }
			if (typeof scope === 'string') { scope = _(scope); }
		}
		// Looking for _(window) _(document) _(svg)
		if (find === window || (find.documentElement && (find = find.documentElement))) {
			elem = [ find ];
			find = '';
		}

		// Looking for _('<element>') _('selector')
		else if (typeof find === 'string') {
			find = find.trim();
			if (find[0] === '<') {
				if (/^<!doctype.+?>/i.test(find)) {
					_.hidden.innerHTML = find;
					return _(_.hidden);
				} else if ((find = find.replace(/^<!doctype.+?>/i, ''))) {
					_.hidden.innerHTML = find;
					return _(_.array(_.hidden.childNodes));
				}
			}
			if (find) {
				// If the scope is a DOM node, get all descendents of that scope.
				if (scope && (scope.nodeName || scope instanceof _) && scope !== window && scope !== document) {
					scope = _.parse.descendants(scope instanceof _ ? scope : [ scope ]);
				}
				// Search for DOM nodes using the "find" selector and scope.
				elem = _.parse(find, scope);
			}
		}

		// Looking for _(element)
		else if (find.nodeType && find.nodeType !== 3) {
			elem = [ find ];
			find = '';
			scope instanceof Array
				&& elem.length === 1
				&& scope.indexOf(elem[0]) < 0
				&& (elem = []);
		}

		// Looking for _(function () {})
		else if (typeof find === 'function') {
			if (/^(?:complete|interactive|loaded)$/.test(document.readyState)) {
				find.call(window, _);
			} else {
				document.addEventListener('DOMContentLoaded', find.bind(window, _), false);
			}
			return this;

		}

		// Looking for _(Plum) _([])
		else if (find && typeof find === 'object') {
			find = find instanceof _ || find instanceof Array ? find : _.array(find);
			arry = function (find) {
				find.each(function () {
					if (this instanceof _) arry(this);
					else elem.push(this);
				});
			};
			arry(find);
			find = '';
		}

		elem = _.unique(_.array(elem));
		this.length = elem.length;
		for (; i < this.length; i++) {
			this[i] = elem[i];
			this[i].plum || (this[i].plum = _.copy(_.props));
		}
		this.selector = find;
	} catch (e) {}
	return this;
};

_.hidden = document.createElement('body');
_.instance = 'PlumJS_' + (new Date()).getTime();
_.props = {
	data: {},
	events: {},
	style: {},
	tween: {
		active: false,
		loop: 0,
		looped: 0,
		methods: [],
		queue: true,
		run: 0
	}
};

_.fn = _.prototype = [];