
(function () {
	
	var FREQUENCY = /* replace:frequency */5000,
		ACCEPT = /* replace:accept */[],
		TOLERANCE = /* replace:tolerence */0,
		
		iframe = document.createElement ('iframe'),
		interval = window.setInterval (checkNamespace, FREQUENCY),
		warning,
		dialog;
	
	
	function checkNamespace () {
		var pollutants = {},
			count = 0,
			i;
			
		document.body.appendChild (iframe);
		
		for (i in window) {
			
			if (window[i] !== undefined && 
				iframe.contentWindow[i] === undefined &&
				ACCEPT.indexOf (i) === -1) {
					
				count++;
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
			p;

		if (!dialog) {
			dialog = {};

			dialog.mask = document.createElement ('div');
			addCss (dialog.mask, {
				position: 'fixed',
				top: '0',
				left: '0',
				width: '100%',
				height: '100%',
				backgroundColor: 'rgba(0,0,0,.2)',
				zIndex: '9999'
			});

			dialog.mask.addEventListener ('click', hideDialog);
			
			
			dialog.container = document.createElement ('div');
			addCss (dialog.container, {
				width: '500px',
				margin: '100px auto',
				padding: '12px',
				backgroundColor: '#ccd',
				borderRadius: '8px'
			});

			dialog.mask.appendChild (dialog.container);


			p = document.createElement ('p');

			
			dialog.list = document.createElement ('ul');
			addCss (dialog.list, {
				height: '250px',
				overflow: 'auto',
				listStyle: 'none',
				margin: '0',
				padding: '0',
				backgroundColor: 'rgba(255,255,255,.6)',
				borderRadius: '8px'
			});
			
			dialog.container.appendChild (dialog.list);
		}

		dialog.list.innerHTML = '';

		for (i in pollutants) {
			count++;

			item = document.createElement ('li');
			item.innerHTML = i;
			addCss (item, {
				fontFamily: 'cambria, palatino, georgia, serif',
				fontSize: '16px',
				color: '#000',
				height: '35px',
				lineHeight: '35px',
				padding: '0 16px',
				borderBottom: '1px dotted rgba(0,0,0,.2)',
				cursor: 'pointer'
			});

			(function (i) {
				item.addEventListener ('click', function () {
					console.log (i, window[i]);
				});
			})(i);
			
			dialog.list.appendChild (item);
		}


		if (!warning) {
			warning = document.createElement ('p');
			
			addCss (warning, {
				fontFamily: 'cambria, palatino, georgia, serif',
				fontSize: '24px',
				margin: 0,
				padding: '16px 32px',
				position: 'fixed',
				top: 0,
				right: 0,
				backgroundColor: '#d00',
				color: '#eee',
				cursor: 'pointer',
				borderBottomLeftRadius: '8px',
				zIndex: '9998'
			});
		
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
	
	
	function hideDialog () {
		document.body.removeChild (dialog.mask);
		interval = window.setInterval (checkNamespace, FREQUENCY)
	}
	
	
	setTimeout (checkNamespace, 100);
	
})();