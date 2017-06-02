var request = require('request-promise'),
    mysql = require('mysql'),
    cheerio = require("cheerio"),
    fs = require("fs"),
    pry = require('pryjs'),
    sleep = require('sleep');


var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'codingmart',
  database: 'Hotels_development'
});

connection.connect(function(err) {
    if (err) {
        console.log('Error connecting to Db', err);
        return;
    }
});


hotel_id =338909;

url ="https://in.hotels.com/ho"+hotel_id+"/?q-check-out=2017-05-19&tab=description&q-room-0-adults=2&YGF=2&q-check-in=2017-05-18&MGT=1&WOE=5&WOD=4&ZSX=0&SYE=3&q-room-0-children=0"


function getData(url) {
	var options = {
	  	url:  url,
	    headers: {
			"Accept":"application/json, text/javascript, */*; q=0.01",
			"Accept-Encoding":"gzip, deflate, sdch, br",
			"Accept-Language":"en-GB,en-US;q=0.8,en;q=0.6",
			"Connection":"keep-alive",
			"Host":"in.hotels.com",
			"Referer":"https://in.hotels.com/ho338909/?q-check-out=2017-05-19&tab=description&q-room-0-adults=2&YGF=2&q-check-in=2017-05-18&MGT=1&WOE=5&WOD=4&ZSX=0&SYE=3&q-room-0-children=0",
			"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
			"X-Requested-With":"XMLHttpRequest"
		}
	};
	request = request.defaults({ jar: true });

	request(options, callback).then(function() {
    	pullHotel += 1
    	sleep.sleep(5)
    	response = {
      		"roomTypes": [],
      		"bedTypes": [],
      		"roomInfos": []
    	}
    if (linkResult[pullHotedl] === undefined) {
      // console.log(linkResult[pullHotel], pullHotel)
    } else {
      getData(linkResult[pullHotel].hotel_link)
    }
  })

    function callback(error, response, body) {

  		if (!error && response.statusCode == 200) {
	   		$ = cheerio.load(body)
	    	var hotel_data = fetchAllDatas()
	    	
	    	// connection.query(sql, function(err, result) {
	     //  		console.log(hotel_link + " Updated.")
	   		// })
  		}
	}

	function fetchAllDatas() {
  		fetchRoomTypes();
  		fetchBedTypes();
  		fetchRoomInfo();
  		return response
	}

	function fetchRoomTypes(){
		$("li.room.cont.clearfix .room-info").each(function(index, room){
			roomType = $($("li.room.cont.clearfix .room-info")[index]).find("h3").text()	

			response["roomTypes"].push(roomType);
		}			
	}

	function fetchBedTypes(){
		$(".bed-types.widget-tooltip.widget-tooltip-responsive").each(function( index,room){
			bedType	= $(".bed-types.widget-tooltip.widget-tooltip-responsive").text();
			response["bedTypes"].push(bedType);
		})	
	}

	function fetchRoomInfo(){
		$("ul.bulleted").each(function( index,room){
			roomInfo = $("ul.bulleted").text();
			response["roomInfos"].push(roomInfo);
		})	
	}
