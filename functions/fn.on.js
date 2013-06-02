/**
 * Binds event listeners to an element.
 *
 * If the target is a string, the event should be delegated to a
 * matching element within the bound element. If it's a function, it is
 * treated as the callback method. The callback can either be a single
 * function or a list of functions.
 *
 * @since   0.1
 * @param   string    event   The name of the event to bind
 * @param   mixed     target  Selector to delegate events
 * @param   function  fn      Functions to call when the event triggers
 * @return  object  The Plum object
 */
_.fn.on = function (event, target, fn) {
	if (event instanceof Object) {
		target = null;
	} else {
		var tmp = event;
		event = {};
		if (typeof target === 'function') {
			fn = target;
			target = null;
		} else {
			target = typeof target === 'string' ? target : null;
		}
		tmp.split(/\s+/).each(function (i, e) { event[e] = fn });
	}
	return this.each(function () {
		var elem = this,
			w3c = !!addEventListener,
			events = elem.plum.events;
		_.each(event, function (type, callback) {
			var func = events[type], fn;
			if (func === undefined) { events[type] = []; func = events[type]; }
			// An event listener needs to be bound only if a callback doesn't
			// already exist for the event.
			if (func.length === 0) {
				fn = function (event) {
					var func = events[type];
					// If no callback functions exist for the current event,
					// remove the event listener.
					if (!func.length) {
						if (w3c) { elem.removeEventListener(type, fn); }
						else { elem.removeEvent('on' + type, fn); }
						return;
					}
					func.each(function (i, fn) {
						var target = fn[1] === elem
							? elem
							: _(event.target || elem.srcElement).nearest(fn[1])[0];
						if (!target) { return; }
						if (!event.preventDefault) { // IE8
							event.target = event.srcElement;
							event.relatedTarget = type === 'mouseover' ? event.fromElement
								: type === 'mouseout' ? event.toElement
								: null;
							event.preventDefault = function () { event.returnValue = false; };
							event.stopPropagation = function () { event.cancelBubble = true; };
							if (event.keyCode !== undefined) {
								event.which = event.keyCode;
							}
						}
						if (!event.originalTarget) {
							event.originalTarget = event.srcElement;
						}
						if (fn[0].call(target, event) === false) {
							event.preventDefault();
							event.stopPropagation();
							event.stopImmediatePropagation();
							return false;
						}
					});
				};
				if (w3c) {
					elem.addEventListener(type, fn, false);
				} else {
					elem.attachEvent('on' + type, fn);
				}
			}
			events[type].push([ callback, target || elem ]);
			events[type] = _.unique(events[type]);
		});
	});
};