<?
	header ('Content-type: text/javascript');
	
	$js = file_get_contents ('./lichen.js');
	
	while (preg_match ('/((\/\* replace:(.*?) \*\/).*?),/', $js, $matches)) {
		if ($val = $_GET[$matches[3]]) {

			if (substr ($matches[1], -1) == ']') {
				// Array
				$val = '["'.str_replace (',', '","', $val).'"]';

			} elseif (''.(int) $val != $val) {
				// String
				$val = '"'.$val.'"';
			} 
		
			$js = str_replace ($matches[1], $val, $js);
			
		} else {
			$js = str_replace ($matches[2], '', $js);
		}			
	}
	
	echo $js;
?>