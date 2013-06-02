/**
 * Attaches an event and removes it immediately after it's triggered.
 *
 * @since   1.0
 * @param   string  event     The name of the event to bind
 * @param   mixed   target    Selector to delegate events
 * @param   mixed   callback  Functions to call when the event triggers
 * @return  object  The Plum object
 */
_.fn.once = function (event, target, callback) {
	callback = typeof target === 'function' ? target : callback;
	callback = typeof callback === 'function' ? callback : function () { };
	return this.each(function () {
		target = typeof target === 'string' && target ? target : this;
		var elem = _(target), fn = function (e) {
			callback.call(this, e);
			elem.ignore(event, target, fn);
		};
		elem.on(event, target, fn);
	});
};