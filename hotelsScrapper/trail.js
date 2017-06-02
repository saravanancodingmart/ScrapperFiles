var request = require('request'),
 	mysql   = require('mysql'),
 	sleep   = require('sleep'),
 	cheerio = require("cheerio");

var todayDate = new Date().toISOString().slice(0,10);
var tomoDate  = new Date();
tomoDate.setDate(tomoDate.getDate() + 1);
tomoDate = tomoDate.toISOString().slice(0,10);
var update_count =0 ;
// hotel_id =[338909,569202,569631,532852,282282,274814,458818,153446,112066,131531,495025,192847,169292,511939,216606,240713,
			// 668601,428436,152510,224117,476986,463346,272581,108983,153148,422161,430651,230692,237201,242308,415223,108365,356402,455031,452266,193440,133317,201289,371187,539513,358978,592483,677008,677349,580678,617864,698282,700472,689451,592869,672391,672305,673562,671839,674180,674197];

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'codingmart',
    database: 'ct_hotels_development'
});

connection.connect(function(err) {
    if (err) {
        console.log('Error connecting to Db', err);
        return;
    }
});

fetchDb();

function fetchDb() {	
    var sql = ""
    var hotelcom_ids=[]
    sql = "SELECT hotelcom_hotel_id FROM `hotelcom_hotels` "
     
    var a = connection.query(sql, function(err, result) {
    	for(i=0;i<result.length;i++)
    	{	
    		 hotelcom_ids.push(result[i].hotelcom_hotel_id);
    	}	
    	main(hotelcom_ids);
    })
}

function main(hotelcom_ids){
	
	total_ids = hotelcom_ids;
	var update_count=0;
	// console.log(total_ids);
 
	console.log("BEFORE :" +total_ids.length)

	// total_ids.forEach(function(value,index)
	// {

	// 	if(value==390374){

	// 		console.log("index:"+index);
	// 	}
	// })



 total_ids.splice(0,6444);



	console.log("AFTER :" +total_ids.length)

     sub(total_ids[0]);

	function sub(id)
	{
			if(update_count>=total_ids.length)
			{
				console.log("TOTAL HOTELS UPDATED");
			}
			else
			{				
					url ="https://in.hotels.com/ho"+id+"/?q-check-out=2017-09-19&tab=description&q-room-0-adults=2&YGF=2&q-check-in=2017-09-18&MGT=1&WOE=5&WOD=4&ZSX=0&SYE=3&q-room-0-children=0"
					console.log(url);
					request(url,function(error,resp,body){
						sleep.sleep(1)
						if (!error && resp.statusCode == 200) {

							var $ = cheerio.load(body)
							var sitemap1 = [];
							var hotel_data = fetchRoomData($)  
							try{    		
									    	//latitude    = $(".map-widget").attr('style').split("center")[1].split("&size")[0].split("=")[1].split("&")[0].split(",")[0]
									    	//longitude   = $(".map-widget").attr('style').split("center")[1].split("&size")[0].split("=")[1].split("&")[0].split(",")[1]
									    	
									    	hotelcom_id = $($(".clearable.widget-query-autosuggest")[0]).attr("data-destination-id")

									    	hotel_name  = $("h1[itemprop=name]").text()
									    	
									    	// site_map    = $($(".whats-around-content-landmarks .list-container")[0]).text().split(")")
									    	
									    	site_map   = $("div#overview-section-6.overview-section.overview-column li").text().replace(/[)]/g, ')/n').split('/n');

									    	site_map.splice(-1,1);
									    	var sql     = "update hotelcom_hotels set ? where hotelcom_hotel_id="+hotelcom_id
									    	data        = {'name':hotel_name,'room_types':JSON.stringify(hotel_data),'sitemap':JSON.stringify(site_map)}
									    	connection.query(sql, data, function(err) {		
									    		if (!err)
									    		{
									    			update_count +=1;
									    			console.log(data.name);
									    			console.log(data.room_types);
									    			console.log("-------------------UPDATED----------------------")			
									    			sub(total_ids[update_count])
									    		}
									    		else
									    		{
									    			update_count +=1;
									    			console.log("err");
									    			sub(total_ids[update_count])
									    		}
									    	});
									    }
									    catch(e){
									    	console.log(e)
									    }
									  }
									})		
			}
		}

	}
	function fetchRoomData($){
		var roomList = [];
		$("li.room.cont.clearfix .room-info").each(function(index, room){
			var roomData ={};
			roomData["roomName"] = $($("li.room.cont.clearfix .room-info").find("h3")[index]).text();
			roomData["bedType"]	 = $($(".bed-types.widget-tooltip.widget-tooltip-responsive")[index]).text();
			roomData["roomInfo"] = $($("ul.bulleted")[index]).text();
			//console.log(roomData);		
			roomList.push(roomData);
		})	
		return roomList;		
	}

	// function insertHotel(table,data){

	// 	var sql =  "INSERT INTO "+table+" set  ? "
	// 	connection.query(sql, data, function(err) {
	// 		if (err) throw err;     
	//     });
	// }

	