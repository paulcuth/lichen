
(function () {
	
	var FREQUENCY = 5000,
		ACCEPTABLE = ['$', 'jQuery', 'flasher'],
		TOLERANCE = 0,
		
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
				ACCEPTABLE.indexOf (i) === -1) {
					
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
	
	
	function showWarning (pollutants) {
		var text,
			count = 0,
			item,
			i;

		if (!dialog) {
			dialog = {};
			dialog.container = document.createElement ('div');
			dialog.list = document.createElement ('ul');
			dialog.container.appendChild (dialog.list);
		}

		dialog.list.innerHTML = '';

		for (i in pollutants) {
			count++;
			item = document.createElement ('li');
			item.innerHTML = i;
			dialog.list.appendChild (item);
		}


		if (!warning) {
			warning = document.createElement ('p');
			warning.style.fontFamily = 'cambria, palatino, georgia, serif';
			warning.style.fontSize = '24px';
			warning.style.margin = 0;
			warning.style.padding = '16px 32px';
			warning.style.position = 'fixed';
			warning.style.top = 0;
			warning.style.right = 0;
			warning.style.backgroundColor = '#d00';
			warning.style.color = '#eee';
		
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
		document.body.appendChild (dialog.container);
	}
	
	
	function hideDialog () {
		document.body.removeChild (dialog.container);
	}
	
	
	setTimeout (checkNamespace, 100);
	
})();