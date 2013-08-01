/**
 * Load multiple scripts or style sheets into the target.
 *
 * @since   1.0
 * @param   array     files  A list of scripts or style sheets to load
 * @param   function  fn     A function to run after the file has loaded
 * @return  mixed     Returns the load function or a Plum object
 */
_.fn.load = function (files, fn) {
	var fn = fn|| function () {},
		elem = _(this[0]),
		load = function (media) {
			var file,
				next = function () { (next = files.shift()) ? load(next) : window.setTimeout(fn.bind(elem), 0); },
				style = media.substr(media.lastIndexOf('.') + 1) === 'css',
				doesNotExist = true;
			_.each(document[style ? 'styleSheets' : 'scripts'], function (loc) {
				if (this && (loc = this[style ? 'href' : 'src']) && ~loc.indexOf(media)) {
					return !((doesNotExist = false) && next());
				}
			});
			if (doesNotExist) {
				file = style
					? _(document.createElement('link')).attr('rel', 'stylesheet').attr('href', media)
					: _(document.createElement('script')).attr('src', media);
				file.on('load', next);
				elem.insert(file);
			}
		};
	files = typeof files === 'string' ? [ files ] : files;

	// Load each file and append it to the container.
	load(files.shift());
	return this;
};