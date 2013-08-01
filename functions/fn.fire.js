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
		var elem = this;
		event.each(function (i, event) {
			var trgt = elem, bubble = true, ret, fn, evt;
			// Bubble up the document tree.
			while (elem) {
				if (elem.plum) {
					fn = [];
					for (i in elem.plum.events) {
						evt = (new RegExp('^' + i + '(?:\.|$)')).test(event);
						evt && (fn = fn.concat(elem.plum.events[i]));
					}
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