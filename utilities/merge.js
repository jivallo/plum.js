/**
 * Merges two or more arrays or objects together.
 *
 * @since   1.0
 * @return  array  Returns the merged objects
 */
_.merge = function () {
	var target = arguments[0] || {},
		obj,
		j,
		copy,
		src,
		i = 1,
		l = arguments.length;
	_.array(arguments).slice(1).each(function (i, obj) {
		for (i in obj) {
			if (target[i] === obj[i]) { continue; }
			if (obj[i] && typeof obj[i] === 'object' && !(obj[i] instanceof Plum)) {
				target[i] = _.merge(target[i] || (obj[i].length !== undefined ? [] : {}), obj[i]);
			} else if (obj[i] !== undefined) {
				target[i] = obj[i];
			}
		}
	});
	return target;
};