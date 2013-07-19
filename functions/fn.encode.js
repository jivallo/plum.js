/**
 * Encodes the key-value pairs of a form.
 *
 * @since   1.0
 * @return  string  Returns a URI encoded list of key-value pairs
 */
_.fn.encode = function () {
	var encode = [];
	_.array(this[0].elements).each(function () {
		if (this.type !== 'file' && this.name && (this.type !== 'radio' && this.type !== 'checkbox' || this.checked === true)) {
			encode.push(this.name + '=' + encodeURIComponent(this.value));
		}
	});
	return encode.join('&');
};