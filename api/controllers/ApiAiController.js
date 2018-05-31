// Author : Nikethan Selvanathan
// Date : 10/01/2016

'use strict';

var apiai = require('apiai');
var api_ai_config = require('./../../config/api_ai_config.js');

var weather_input = require('./../providers/weather_input.js');

module.exports = {
    getApiAiAgentResponse : getApiAiAgentResponse
};


function getApiAiAgentResponse(request, response) {

    var userInput = request.swagger.params.question.value || '';

    //    **************  API AI weather App

    var tokenai = apiai(api_ai_config.tokenai);

    // What's the weather in Colombo tomorrow?
    // What's the weather in Colombo?
    // Weather in New York tomorrow.
    var requestai = tokenai.textRequest(userInput, {
        sessionId: api_ai_config.sessionId
    });
 
    requestai.on('response', function(response_ai) {

        console.log(response_ai);

        if(response_ai.result.action == 'input.weather'){
            console.log("Checking Weather");

            weather_input.getWeather(response_ai).then(function (res) {

                response.json({message: res});

            }).catch(function (err) {
                // console.log(err);
                response.json({message: err});
            });

        }else{
            response.json({message: response_ai.result.fulfillment.speech});
        }

    });
 
    requestai.on('error', function(error) {
        console.log(error);
        response.json({message: error});
    });
 
    requestai.end();

}