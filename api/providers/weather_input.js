// Author : Nikethan Selvanathan
// Date : 10/01/2016

'use strict';

var request = require('request');
var parseString = require('xml2js').parseString;
var api_ai_config = require('./../../config/api_ai_config.js');

module.exports = {
    getWeather : getWeather
}; 

function getWeather(response_ai) {
    
    return new Promise(function (resolve, reject) {

    	if(response_ai.result.parameters.date){

    		var response_ai_date = new Date(response_ai.result.parameters.date);
	    	response_ai_date.setDate(response_ai_date.getDate() + 1);
	    	// console.log(response_ai_date);

	    	var dd = response_ai_date.getDate();
			var mm = response_ai_date.getMonth() + 1; //January is 0!
			var yyyy = response_ai_date.getFullYear();

			if(dd < 10) {
			    dd = '0' + dd;
			} 

			if(mm < 10) {
			    mm = '0' + mm;
			} 

			response_ai_date = yyyy + "-" + mm + "-" +  dd;

    		var geo_city = response_ai.result.parameters.geo_city;

    		var options = {
		        method: 'GET',
		        url: 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + geo_city + '&mode=xml&units=metric&cnt=16&appid=23d391d64a8ebacb4d1d9cfca9046f39',
		        headers: {}
		    };

		    request(options, function (error, response, body) {
		        
		        if (!error && response.statusCode == 200) {
		            // var info = JSON.parse(body);
		            // console.log(body);

		            var xml = body;
					parseString(xml, function (err, result) {
						// console.log(result);

						// console.log(result.weatherdata.location);

						// console.log(result.weatherdata.forecast);

						var arrayLength = result.weatherdata.forecast[0].time.length;
						var found = false;

						for (var i = 0; i < arrayLength; i++) {
						    // console.log(result.weatherdata.forecast[0].time[i]);
						    // console.log(result.weatherdata.forecast[0].time[i].$.day);

						    if(response_ai_date == result.weatherdata.forecast[0].time[i].$.day){
						 		console.log(result.weatherdata.location);
						    	console.log(result.weatherdata.forecast[0].time[i]);

						    	found = true;

						    	return resolve("works");

						    }
						}

						if(!found){
					    	console.log("No weather prediction");
					    	return reject("No weather prediction found");
					    }

					});

		        }else{
		            console.log(body);
		            return reject("Weather api not working");
		        }
		    });

    	}else{

    		var geo_city = response_ai.result.parameters.geo_city || "Colombo";

    		var options = {
		        method: 'GET',
		        url: 'http://api.openweathermap.org/data/2.5/weather?q=' + geo_city + '&appid=23d391d64a8ebacb4d1d9cfca9046f39',
		        headers: {}
		    };

		    request(options, function (error, response, body) {
		        
		        if (!error && response.statusCode == 200) {
		            var info = JSON.parse(body);
		            console.log(info);
		            return resolve("works");
		        }else{
		            console.log(body);
		            return reject("No weather prediction found");
		        }
		    });

    	}
        // return reject(err);
                
        
    });
}