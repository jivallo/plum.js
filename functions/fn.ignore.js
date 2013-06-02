/**
 * Removes a single event listener or all listeners from an element.
 *
 * @since   1.0
 * @param   string  event     The name of the event to remove
 * @param   mixed   target    Selector to remove delegated events
 * @param   mixed   callback  The function to remove, or remove all
 * @return  object  The Plum object
 */
_.fn.ignore = function (event, target, callback) {
	callback = typeof target === 'function' ? target : callback;
	callback = typeof callback === 'function' ? callback : function () { };
	return this.each(function () {
		var events = this.plum.events[event];
		if (events === undefined) { events = []; }
		events.each(function (i, fn) {
			if (fn && fn[0] === callback) { events.splice(i, 1); }
		});
	});
};