'use strict';
const mongoose = require('mongoose');
const config = require('../config');
const log = require('../services/logger');
mongoose.Promise = global.Promise;
/********************************************************
 * UTILITY METHOD FOR HANDLING SERVER DATABASE CONNECTION
 ********************************************************/
function createConnection() {
	try {
		let options = { useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true };
		let mongoUrl = config.databaseUrl;
		//Handling Mongoose Connect function
		mongoose.connect(mongoUrl,options);
		/** 
		* Adding Mongoose Event Listeners
		*/
		mongoose.connection.on('connecting', function(){
			log.info('trying to establish a connection with the database');
		});

		mongoose.connection.on('connected', function() {
			log.info('Database connection established successfully');
		});

		mongoose.connection.on('error', function(err) {
			log.error('Database connection failed with error::',err);
		});

		mongoose.connection.on('disconnected', function() {
			log.info('Database connection closed...');
		});
	}
	catch(error) {
		log.error('failed to establish connection with database::',error);
		return Promise.reject(error);
	}
};

// close mongoose connection
function closeConnection(){
    mongoose.connection.close();
}

exports.createDbConnection = createConnection;
exports.closeDbConnection = closeConnection;