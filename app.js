'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();

module.exports = app; // for testing

var config = {
	appRoot: __dirname // required config
};

//CORS and header parameters
require('./middleware/CrossOriginMW')(app); 

SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) { throw err; }

	// install middleware
	swaggerExpress.register(app);

	var port = process.env.PORT || 6001;
	app.listen(port);

	if (swaggerExpress.runner.swagger.paths['/hello']) {
		console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
	}

});
