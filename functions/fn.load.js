/**
 * Load multiple scripts or style sheets into the target.
 *
 * @since   1.0
 * @param   array     files     A list of scripts or style sheets to load
 * @param   function  callback  A function to run after the file has loaded
 * @return  mixed     Returns the load function or a Plum object
 */
_.fn.load = function (files, comp) {
	var comp = comp|| function () {},
		elem = _(this[0]),
		load = function (media) {
			var file,
				next,
				style = media.substr(media.lastIndexOf('.') + 1),
				doesNotExist = true;
			style = style === 'css' ? true : false;
			_.array(document[style ? 'styleSheets' : 'scripts']).each(function () {
				var loc = ('' + this)[style ? 'href' : 'src'];
				if (loc && loc.indexOf(media) > -1) {
					return (doesNotExist = false);
				}
			});
			if (doesNotExist) {
				file = style
					? _('<link rel="stylesheet" href="' + media + '">')
					: _(document.createElement('script')).attr('src', media);
				file.on('load', function () {
					(next = files.shift()) ? load(next) : comp.call(elem);
				});
				elem.insert(file);
			}
		};
	files = typeof files === 'string' ? [ files ] : files;

	// Load each file and append it to the container.
	load(files.shift());
	return this;
};