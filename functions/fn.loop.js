/**
 * Sets or gets the loop status of a group of elements.
 *
 * If the "loop" argument is true, the elements will animate indefinitely. If it
 * is set to false, the elements will animate once. If set to a number, they
 * will animate for that specified number.
 *
 * If the loop is not provided, the loop status of the first element in the list
 * is returned.
 *
 * @since   1.0
 * @param   mixed  loop  The loop status
 * @return  mixed  Returns the loop count or a Plum object
 */
_.fn.loop = function (loop) {
	return loop !== undefined
		? this.each(function () { this.plum.tween.loop = loop; })
		: this[0].plum.tween.loop;
};