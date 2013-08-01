/**
 * Attaches an event and removes it immediately after it's triggered.
 *
 * @since   1.0
 * @param   mixed     evnt  The name of the event to bind or list of events
 * @param   mixed     trgt  Selector to delegate events
 * @param   function  call  Functions to call when the event triggers
 * @return  object    The Plum object
 */
_.fn.once = function (evnt, trgt, call) {
	return this.on(evnt, trgt, call, true);
};