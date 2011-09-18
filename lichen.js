
(function () {
	
	var FREQUENCY = /* replace:frequency */5000,
		ACCEPT = /* replace:accept */['jQuery'],
		TOLERANCE = /* replace:tolerence */0,
		
		iframe = document.createElement ('iframe'),
		interval = window.setInterval (checkNamespace, FREQUENCY),
		cache = {},
		warning,
		dialog;
	
	
	
	
	function loadCss () {
		var link = document.createElement ('link');
		link.setAttribute ('rel', 'stylesheet');
		link.setAttribute ('href', './lichen.css');	// TODO: define absolute path when not offline
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
		
		if (count > TOLERANCE) {
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
			warning.className = 'lichen-warning';
			warning.addEventListener ('click', showDialog);		
		}

		document.body.appendChild (warning);

		text = count + ' variables in global namespace.';
		if (count == 1) text = text.replace ('s', '');
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

		ajax ('./lookup.php?q=' + name + '&cbfunc=?', callback);	// TODO: Absolute path		
	}
	
		
	
	
	function ajax (url, callback) {
		// TODO
		$.ajax ({
			url: url,
			dataType: 'jsonp', 
			success: callback
		});
	}
	
	
	
	
	loadCss ();
	setTimeout (checkNamespace, 100);
	
})();