/**
 * Triggers an event on each element in the Plum object.
 *
 * @since   1.0
 * @param   string  event  The name of the event to trigger
 * @return  object  The Plum object
 */
_.fn.fire = function (event) {
	var args = _.array(arguments).slice(1);
	event = event.split(/\s+/);
	return this.each(function () {
		var elem = this, fn;
		event.each(function (i, event) {
			var trgt = elem, bubble = true, ret;
			// Bubble up the document tree.
			while (elem) {
				if (elem.plum && (fn = elem.plum.events[event])) {
					if (typeof elem[event] === 'function') {
						elem[event]();
					} else {
						fn.each(function () {
							if (_(elem).is(this[1]) || _(trgt).is(this[1])) {
								ret = this[0].apply(trgt, [{
									currentTarget: trgt,
									preventDefault: function () {},
									stopPropagation: function () { bubble = false; },
									stopImmediatePropagation: function () { bubble = false; },
									target: trgt,
									type: event
								}].concat(args));
								if (ret === false || !bubble) { return false; }
							}
						});
					}
					if (ret === false || !bubble) { break; }
				}
				elem = elem.parentNode;
			}
		});
	});
};