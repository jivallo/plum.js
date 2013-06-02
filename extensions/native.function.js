/**
 * Encapsulates a function to a different caller.
 *
 * @since   1.0
 * @param   mixed     caller  The function caller
 * @return  function  Returns the bound function
 */
if (!Function.prototype.bind) {
	Function.prototype.bind = function (caller) {
		var fn = this, args = _.array(arguments).slice(1);
		return function () { return fn.apply(caller, args.length ? args : arguments); };
	};
}