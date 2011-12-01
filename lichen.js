/**
 * @fileOverview Main Lichen JS file.
 * @author Paul Cuthbertson
 */


(function () {
	
	/**
	 * The frequency at which Lichen checks the global namespace.
	 * @type number
	 * @constant
	 */
	var FREQUENCY = /* replace:frequency */5000,


	/**
	 * An array of acceptable variable names.
	 * @type Array
	 * @constant
	 */
		ACCEPT = /* replace:accept */[],


	/**
	 * The number of unknown variables in the namespace needed to trigger a warning.
	 * @type number
	 * @constant
	 */
		TOLERANCE = /* replace:tolerence */0,


	/**
	 * Whether or not to display a message when there are not any warnings.
	 * @type boolean
	 * @constant
	 */
		SHOW_OK = /* replace:showok */false,


	/**
	 * Whether or not to automatically pop up the dialog when a warning occurs.
	 * @type boolean
	 * @constant
	 */
		POP_UP = /* replace:popup */false,


	/**
	 * The position of the warning with-in the viewport.
	 * @type string
	 * @constant
	 */
		POSITION = /* replace:position */'top-right',


	/**
	 * The base url of other Lichen files.
	 * @type string
	 * @constant
	 */
		SERVER_URL = /* replace:url */'',
		

	/**
	 * The iframe used for comparison.
	 * @type HTMLIFrameElement
	 */
		iframe = document.createElement ('iframe'),
		

	/**
	 * The iframe used for comparison.
	 * @type number
	 */
		interval = window.setInterval (checkNamespace, FREQUENCY),


	/**
	 * The DOM element used for the warning/alert.
	 * @type HTMLParagraphElement
	 */
		warning,


	/**
	 * The DOM element used for the dialog box.
	 * @type HTMLDivElement
	 */
		dialog;
	

	iframe.className = 'lichen';
	
	
	
	
	/**
	 * Loads required external CSS files.
	 */
	function loadCss () {
		var link = document.createElement ('link');
		link.setAttribute ('rel', 'stylesheet');
		link.setAttribute ('href', SERVER_URL + '/lichen/css/lichen.css');
		document.getElementsByTagName ('head')[0].appendChild (link);
	}
	
	
	
	
	/**
	 * Checks the global namespace for variables that are not in the acceptable list.
	 */
	function checkNamespace () {
		var pollutants = {},
			count = 0,
			i;
			
		document.body.appendChild (iframe);
		
		for (i in window) {			
			if (window[i] !== undefined && iframe.contentWindow[i] === undefined) {
				if (ACCEPT.indexOf (i) === -1) count++;
				pollutants[i] = window[i];
			}
		}

		document.body.removeChild (iframe);
		
		if (count > TOLERANCE || SHOW_OK) {
			showWarning (pollutants);

		} else if (warning && warning.innerHTML) {
			hideWarning ();
		}
	}
	



	/**
	 * Styles a DOM element using the fields of an object.
	 * @param {HTMLElement} element The DOM element to be styled.
	 * @param {object} css Object containing the CSS style parameters.
	 */
	function addCss (element, css) {
		for (var i in css) element.style[i] = css[i];
	}
	
	
	
	
	/**
	 * Displays a warning on the page.
	 * @param {object} pollutants Object containing references to the global variables that are not in the acceptable list.
	 */
	function showWarning (pollutants) {
		var text,
			count = 0,
			item,
			i,
			span,
			ok = [],
			valueElement,
			inspector,
			close;

		if (!dialog) createDialog ();
		dialog.list.innerHTML = '';
		

		for (i in pollutants) {
			item = document.createElement ('li');
			valueElement = document.createElement ('p');
			item.appendChild (valueElement);
			
			span = document.createElement ('span');
			span.className = 'lichen-name';
			span.innerHTML = i;
			valueElement.appendChild (span);
					
			if (ACCEPT.indexOf (i) !== -1) {
				item.className = 'ok';
				ok.push (item);

			} else {
				dialog.list.appendChild (item);
				count++;
			}

			inspector = document.createElement ('div');
			inspector.className = 'inspector';
			inspector.style.height = '0px';
			inspector.style.padding = '0px 8px';
			item.appendChild (inspector);

			(function (i, element, inspector) {
				element.addEventListener ('click', function () {					
					if (inspector.style.height === '0px') {
						inspector.style.height = 'auto';
						inspector.style.padding = '8px';
					} else {
						inspector.style.height = '0px';
						inspector.style.padding = '0px 8px';
					}
				}, false);
			})(i, valueElement, inspector);

			
			displayValue (pollutants[i], inspector);
		}

		for (i in ok) dialog.list.appendChild (ok[i]);
		

		if (!warning) {
			warning = document.createElement ('p');
			warning.addEventListener ('click', showDialog, false);
		}

		warning.className = 'lichen-warning' + ((count <= TOLERANCE)? ' ok' : '');
		if (['top-left', 'bottom-left', 'bottom-right'].indexOf (POSITION) !== -1) warning.className += ' ' + POSITION;
		
		document.body.appendChild (warning);

		text = count + ' variables in global namespace. ';
		
		if (count === 1) {
			text = text.replace ('s', '');
		} else if (count === 0) {
			text = text.replace ('0', 'No');
		}
		
		warning.innerHTML = text;

		close = document.createElement ('a');
		close.href = '#';
		close.innerHTML = 'Stop';
		close.title = 'Stop monitoring';
		
		close.addEventListener ('click', function (e) {
			window.clearInterval (interval);
			hideWarning ();
			
			if (e.preventDefault) e.preventDefault ();
			e.returnValue = false;

			if (e.stopPropagation) e.stopPropagation ();
			e.cancelBubble = true;
		}, false);
		
		warning.appendChild (close);
		if (POP_UP) showDialog ();
	}
	
	


	/**
	 * Creates a new dialog box.
	 */
	function createDialog () {	
		dialog = {};

		dialog.mask = document.createElement ('div');
		dialog.mask.className = 'lichen-mask';
		dialog.mask.addEventListener ('click', hideDialog, false);
		
		dialog.container = document.createElement ('div');
		dialog.container.className = 'lichen-container';
		
		dialog.container.addEventListener ('click', function (e) {
			if (e.stopPropagation) e.stopPropagation ();
			e.cancelBubble = true;
		}, false);

		dialog.mask.appendChild (dialog.container);

		dialog.list = document.createElement ('ul');
		dialog.container.appendChild (dialog.list);

		close = document.createElement ('button');
		close.innerHTML = 'Close';
		close.addEventListener ('click', hideDialog, false);
		dialog.container.appendChild (close);
	}



	
	/**
	 * Hides the warning.
	 */
	function hideWarning () {
		document.body.removeChild (warning);
		warning.innerHTML = '';
	}
	
	
	
	
	/**
	 * Displays the dialog box.
	 */
	function showDialog () {
		document.body.appendChild (dialog.mask);
		window.clearInterval (interval);
	}
	
	
	
	
	/**
	 * Hides the dialog box.
	 */
	function hideDialog (event) {
		document.body.removeChild (dialog.mask);
		interval = window.setInterval (checkNamespace, FREQUENCY);
	}




	/**
	 * Opens up the variable inspector for a value listed in the dialog box.
	 * @param {object} obj The object to inspect.
	 * @param {HTMLDOMElement} parent The DOM element in which to insert the value description.
	 * @param {string} name The name of the variable.
	 */
	function displayValue (obj, parent, name) {
		name = (name !== undefined)? '<span>' + name + ':</span> ' : '';
		
		var div = document.createElement ('div'),
			elements,
			element,
			caption,
			pos;

		div.className = 'element';
				
		div.addEventListener ('click', function (e) {
			if (e.stopPropagation) e.stopPropagation ();
			e.returnValue = false;
		}, false);

		
		if (typeof obj == "number" || typeof obj == "boolean" || typeof obj == "undefined" || obj === null) {
			div.innerHTML = name + obj;
				
		} else if (typeof obj == "string") {
			div.innerHTML = name + '"' + obj + '"';
				
		} else if (typeof obj == "function") {
			caption = obj.toString ();
			if ((pos = caption.indexOf ('{')) > -1) caption = caption.substr (0, pos) + '{ &hellip; }';
			div.innerHTML = name + caption;
				
		} else {
			div.innerHTML = name + ((obj instanceof Array)? 'Array (' + obj.length + ')' : 'Object');			
			div.className += ' expandable';

			elements = document.createElement ('div');
			div.appendChild (elements);

			(function (obj, div, element, elements) {
				var opened = false,
					count = 0;

				div.addEventListener ('click', function (e) {
					if (!opened) {
						opened = true;
						
						for (var i in obj) {
							count++;

							element = document.createElement ('div');
							elements.appendChild (element);
			
							displayValue (obj[i], element, i);
						}	
						
						if (!count) {
							element = document.createElement ('div');
							element.className = 'empty';
							element.innerHTML = '(Empty)';
							elements.appendChild (element);
						}							
					}


					if (this.className == 'element expanded') {
						this.className = 'element expandable';
						elements.style.display = 'none';
				
					} else {
						this.className = 'element expanded';
						elements.style.display = 'block';
					}
					
				}, false);
			})(obj, div, element, elements);
							
		}
		
		parent.appendChild (div);
	}

	
	
	
	loadCss ();
	setTimeout (checkNamespace, 100);
	
})();