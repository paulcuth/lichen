CREATE TABLE  `lichen`.`variable` (
`name` VARCHAR( 100 ) NOT NULL ,
`description` VARCHAR( 50 ) NOT NULL ,
`url` VARCHAR( 250 ) NULL ,
PRIMARY KEY (  `name` )
) ENGINE = MYISAM ;


CREATE TABLE  `lichen`.`unknown` (
`name` VARCHAR( 100 ) NOT NULL ,
`url` VARCHAR( 250 ) NOT NULL ,
PRIMARY KEY (  `name` )
) ENGINE = MYISAM ;

