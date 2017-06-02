var mysql = require('mysql');

SELECT hotelcom_hotels.id FROM `hotelcom_hotels` INNER JOIN `cleartrip_hotels` ON `cleartrip_hotels`.`cleartrip_id` = `hotelcom_hotels`.`cleartrip_id`
