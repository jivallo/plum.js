// Main Plum.js function.
var _ = function (find, scope) {
	try {
		var i = 0, elem, arr = false;
		if (this === undefined || this === window) { return new _(find, scope); }
		if (scope) {
			if (scope[0] === document) { scope = document; }
			if (typeof scope === 'string') { scope = _(scope); }
		}
		// _('') _(null) _(undefined)
		if (!find) {
			elem = [];
			find = '';
		// _(function () {});
		} else if (!find.nodeName && typeof find === 'function') {
			elem = window.setInterval(function () {
				if (document.readyState === 'complete') {
					find(_);
					window.clearInterval(elem);
				}
			}, 10);
			return;
		} else if (typeof find === 'string') {
			find = find.trim();
			// _('<div>')
			if (find[0] === '<') {
				if (/^<!doctype.+?>/i.test(find)) {
					_.hidden.innerHTML = find;
					return _(_.hidden);
				} else {
					find = find.replace(/^<!doctype.+?>/i, '');
					_.hidden.innerHTML = find;
					find = _.hidden.children;
					return _(find[1].innerHTML ? find[1] : find[0]).children();
				}
			}
			if (find) {
				// If the scope is a DOM node, get all descendents of that scope.
				if (scope && (scope.nodeName || scope instanceof _) && scope !== window && scope !== document) {
					scope = _.parse.descendants(scope instanceof _ ? scope : [ scope ]);
				}
				// Searching for DOM nodes using the find selector and scope.
				elem = _.parse(find, scope);
			} else {
				elem = [];
				find = '';
			}
		} else if (find === window || find === document) {
			elem = [ find ];
			find = '';
		} else if (find instanceof _ || find instanceof Array) {
			elem = find;
			find = '';
			arr = true;
		} else if (find instanceof Object) {
			elem = find.nodeName ? [ find ] : find;
			find = '';
			if (scope instanceof Array && elem.length === 1 && scope.indexOf(elem[0]) < 0) {
				elem = [];
			}
		}
		elem = _.unique(_.array(elem || []));
		this.length = elem.length;
		for (; i < this.length; i++) {
			this[i] = elem[i];
			if (this[i] && !this[i].plum) { this[i].plum = _.copy(_.props); }
		}
		this.selector = find;
	} catch (e) {}
	return this;
};

_.hidden = document.createElement('html');
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