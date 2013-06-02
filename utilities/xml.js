/**
 * Parses an XML string into DOM elements.
 *
 * @since   1.0
 * @return  object  Returns a list of DOM elements in the XML string
 */
_.xml = function (xml) {
	var doc;
	if (window.DOMParser !== undefined) {
		doc = (new window.DOMParser).parseFromString(xml, 'text/xml');
		return doc.documentElement;
	} else if (window.ActiveXObject !== undefined && new window.ActiveXObject('Microsoft.XMLDOM')) {
		doc = new window.ActiveXObject('Microsoft.XMLDOM');
		doc.async = false;
		doc.loadXML(xml);
		return doc;
	}
};