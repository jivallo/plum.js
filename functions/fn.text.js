/**
 * Gets or sets the inner text content of the given elements.
 *
 * @since   1.0
 * @param   string  content  The elements' replacement text
 * @return  mixed   Returns the first element's text or a Plum object
 */
_.fn.text = function (content) {
	return content === undefined
		? (this[0] ? this[0][this[0].textContent !== undefined ? 'textContent' : 'innerText'] : undefined)
		: this.each(function () {
			this[this.textContent !== undefined ? 'textContent' : 'innerText'] = content;
		});
};