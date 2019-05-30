'use strict';
var mysql = require('mysql');

function QueryRunner() {
	this.pool = mysql.createPool({
		host: process.env.SOCCERCENTER_HOST,
		user: process.env.SOCCERCENTER_USER,
		password: process.env.SOCCERCENTER_PASSWORD,
		database: process.env.SOCCERCENTER_DATABASE
	});
}

QueryRunner.prototype.logQueryResponse = function(query_text, rows) {
	console.log("For query: " + query_text);
	console.log(JSON.stringify(rows) + ' row(s) returned');
	console.log("\n\n\n");
};

QueryRunner.prototype.logError = function(sql_query, error) {
	console.error("Error performing: " + sql_query + "\n" + error + "\n\n");
};

QueryRunner.prototype.runQuery = function (sql_query) {
	return new Promise((resolve, reject) => {
		this.pool.getConnection( (err, connection) => {
			if (err) {
				this.logError(sql_query, err);
				reject(err);
				return;
			}

			if (connection == undefined) {
				reject("Connection to DB was not created");
				return;
			}
	
			connection.query(sql_query, (query_err, response) => {
				if (query_err) {
					this.logError(sql_query, query_err);
					reject(query_err);
					return;
				}
	
				this.logQueryResponse(sql_query, response);
				resolve(response);
			});
	
			connection.release();
		});
	});
};


exports.buildQueryRunner = function () {
	return new QueryRunner();
};