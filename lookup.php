<?
	include ('./settings.php');
	header ('Content-type: text/javascript');

	mysql_connect (MYSQL_SERVER, MYSQL_USERNAME, MYSQL_PASSWORD);
	mysql_select_db (MYSQL_DB);

	if (!($cbfunc = $_GET['cbfunc'])) $cbfunc = 'cbfunc';

	if ($name = $_GET['q']) {
		$query = sprintf ('SELECT * FROM `variable` WHERE `name` = "%s"', $name);
		$result = mysql_query ($query);
		
		if ($record = mysql_fetch_assoc ($result)) {
			echo sprintf ('%s({"desc":"%s","url":"%s"})', $cbfunc, $record['description'], $record['url']);

		} else {
			$query = sprintf ('SELECT COUNT(*) AS `recordCount` FROM `unknown` WHERE name = "%s"', $name);
			$record = mysql_fetch_assoc (mysql_query ($query));

			if (!$record['recordCount']) {
				$query = sprintf ('INSERT INTO `unknown` (`name`, `url`) VALUES ("%s", "%s")', $name, $_SERVER['HTTP_REFERER']);
				mysql_query ($query);
			}

			echo $cbfunc.'()';
		}	
	}			
?>