/**
 * Adds escape functionality for use in regular expressions.
 *
 * @since   1.0
 * @param   string  string
 * @return  string  Returns a safely escaped string
 */
_.escape = function(string) {
	return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};