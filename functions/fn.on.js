/**
 * Binds event listeners to an element.
 *
 * If the target is a string, the event should be delegated to a
 * matching element within the bound element. If it's a function, it is
 * treated as the callback method. The callback can either be a single
 * function or a list of functions.
 *
 * @since   0.1
 * @param   mixed     evnt  The name of the event to bind or list of events
 * @param   mixed     trgt  Selector to delegate events
 * @param   function  call  Functions to call when the event triggers
 * @param   boolean   once  Run the callback once or indefinitely
 * @return  object  The Plum object
 */
_.fn.on = function (evnt, trgt, call, once) {
	if (typeof evnt === 'string') {
		var type = evnt;
		evnt = {};
		call = typeof trgt === 'function' ? trgt : call;
		trgt = typeof trgt !== 'string' ? null : trgt;
		type = type
			.replace(/(?:^|\s)scroll(?:\s|$)/, 'DOMMouseScroll mousewheel gesturechange')
			.replace(/(?:^|\s)mousedown(?:\s|$)/, 'touchstart mousedown')
			.replace(/(?:^|\s)mouseup(?:\s|$)/, 'touchend mouseup')
			.replace(/(?:^|\s)click(?:\s|$)/, 'tap click')
			.split(/\s+/);
		type.each(function (i, e) { evnt[e] = call; });
	}
	return this.each(function (i) {
		var elem = this, evts = elem.plum.events;
		_.each(evnt, function (i, callback) {
			var call = evts[i] || (evts[i] = []), fn;
			// An event listener needs to be bound only if a callback
			// doesn't already exist for this specific event.
			call.length === 0 && (fn = function (event) {
				var func = evts[i];
				// Run each callback function for the triggered event.
				if (func.length) {
					func.each(function (i, fn) {
						var trgt = fn[1] === elem ? elem : _(event.target || elem.srcElement).nearest(fn[1])[0];
						if (trgt) {
							event.originalTarget || (event.originalTarget = event.srcElement);
							event.name = event.type === 'DOMMouseScroll' ? 'mousewheel'
								: event.type === 'touchstart' ? 'mousedown'
								: event.type === 'touchend' ? 'mouseup'
								: event.type === 'tap' ? 'click'
								: event.type;
							if (fn[0].call(trgt, event) === false) {
								event.preventDefault();
								event.stopPropagation();
								event.stopImmediatePropagation();
								return false;
							}
						}
					});
					once && elem.removeEventListener(i, fn, false);
				// Remove the event if no callback functions exist.
				} else {
					elem.removeEventListener(i, fn, false);
				}
			}) && elem.addEventListener(i, fn, false);
			// Push the callback function to the list of events.
			evts[i].push([ callback, trgt || elem ]);
			evts[i] = _.unique(evts[i]);
		});
	});
};