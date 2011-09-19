
(function () {
	
	var FREQUENCY = /* replace:frequency */5000,
		ACCEPT = /* replace:accept */[],
		TOLERANCE = /* replace:tolerence */0,
		SHOW_OK = /* replace:showok */false,
		POSITION = /* replace:position */'top-right',
		
		SERVER_URL = 'http://localhost',
		
		iframe = document.createElement ('iframe'),
		interval = window.setInterval (checkNamespace, FREQUENCY),
		cache = {},
		warning,
		dialog;
	
	
	
	
	function loadCss () {
		var link = document.createElement ('link');
		link.setAttribute ('rel', 'stylesheet');
		link.setAttribute ('href', SERVER_URL + '/lichen/lichen.css');
		document.getElementsByTagName ('head')[0].appendChild (link);
	}
	
	
	
	
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
	



	function addCss (element, css) {
		for (var i in css) element.style[i] = css[i];
	}
	
	
	
	
	function showWarning (pollutants) {
		var text,
			count = 0,
			item,
			i,
			close,
			span,
			ok = [];

		if (!dialog) {
			dialog = {};

			dialog.mask = document.createElement ('div');
			dialog.mask.className = 'lichen-mask';
			dialog.mask.addEventListener ('click', hideDialog);
			
			dialog.container = document.createElement ('div');
			dialog.container.className = 'lichen-container';
			
			dialog.container.addEventListener ('click', function (e) {
				if (e.stopPropagation) e.stopPropagation ();
				e.cancelBubble = true;
			});

			dialog.mask.appendChild (dialog.container);

			dialog.list = document.createElement ('ul');
			dialog.container.appendChild (dialog.list);

			close = document.createElement ('button');
			close.innerHTML = 'Close';
			close.addEventListener ('click', hideDialog);
			dialog.container.appendChild (close);
		}

		dialog.list.innerHTML = '';

		for (i in pollutants) {
			item = document.createElement ('li');
			
			(function (i, item) {
				item.addEventListener ('click', function () {
					console.log (i, window[i]);
				});
			})(i, item);

			span = document.createElement ('span');
			span.className = 'lichen-name';
			span.innerHTML = i;
			item.appendChild (span);			
					
			span = document.createElement ('span');
			item.appendChild (span);
			
			if (ACCEPT.indexOf (i) !== -1) {
				item.className = 'ok';
				ok.push (item);

			} else {
				dialog.list.appendChild (item);
				count++;
			}

			lookupVar (i, span);
		}

		for (i in ok) dialog.list.appendChild (ok[i]);
		

		if (!warning) {
			warning = document.createElement ('p');
			warning.addEventListener ('click', showDialog);
		}

		warning.className = 'lichen-warning' + ((count <= TOLERANCE)? ' ok' : '');
		if (['top-left', 'bottom-left', 'bottom-right'].indexOf (POSITION) !== -1) warning.className += ' ' + POSITION;
		
		document.body.appendChild (warning);

		text = count + ' variables in global namespace.';
		
		if (count === 1) {
			text = text.replace ('s', '');
		} else if (count === 0) {
			text = text.replace ('0', 'No');
		}
		
		warning.innerHTML = text;
	}
	
	
	
	
	function hideWarning () {
		document.body.removeChild (warning);
		warning.innerHTML = '';
	}
	
	
	
	
	function showDialog () {
		document.body.appendChild (dialog.mask);
		window.clearInterval (interval);
	}
	
	
	
	
	function hideDialog (event) {
		document.body.removeChild (dialog.mask);
		interval = window.setInterval (checkNamespace, FREQUENCY);
	}




	function lookupVar (name, element) {
		var a, 
			text;
		
		element.className = 'lichen-description loading';

		var callback = function (data) {
			cache[name] = data;
			element.className = 'lichen-description';		
		
			if (data) {
				text = data.desc;
				
				if (!data.url) {
					element.innerHTML = text;
					
				} else {
					a = document.createElement ('a');
					a.href = 'http://' + data.url;
					a.innerHTML = text;
					element.appendChild (a);
				}			
			}
		};

		if (cache[name] !== undefined) {
			callback (cache[name]);
			return;
		}

		makeJSONPRequest (SERVER_URL + '/lichen/lookup.php?q=' + name + '&cbfunc=?', callback);
	}
	
		
	
	
	function makeJSONPRequest (url, callback) {

		if (!window.lichen) {
			window.lichen = {
				callbacks: []
			};
		}
		
		var index = window.lichen.callbacks.length,
			script = document.createElement ('script'),
			head = document.getElementsByTagName ('head')[0],
			scriptId = 'lichen-jsonp-' + index;
		
		window.lichen.callbacks[index] = function (data) {
			delete window.lichen.callbacks[index];

			var script = document.getElementById (scriptId),
				empty = true,
				i;
			
			head.removeChild (script);
			
			for (i in window.lichen.callbacks) {
				if (window.lichen.callbacks !== undefined) {
					empty = false;
					break;
				}
			}
			
			if (empty) delete window.lichen;	
			callback (data);
		};
		

		script.id = scriptId;
		script.src = url.replace ('cbfunc=?', 'cbfunc=' + encodeURI ('window.lichen.callbacks[' + index + ']'));
		head.appendChild (script);
	}

	
	
	
	loadCss ();
	setTimeout (checkNamespace, 100);
	
})();