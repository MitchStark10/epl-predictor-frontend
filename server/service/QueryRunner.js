'use strict';
var mysql = require('mysql');

function QueryRunner() {
    this.pool = mysql.createPool({
        host: process.env.SCOREMASTER_HOST,
        user: process.env.SCOREMASTER_USER,
        password: process.env.SCOREMASTER_PASSWORD,
        database: process.env.SCOREMASTER_DATABASE
    });
}

QueryRunner.prototype.logQueryResponse = function (queryText, rows) {
    console.log('For query: ' + queryText);
    console.log(JSON.stringify(rows) + ' row(s) returned');
    console.log('\n\n\n');
};

QueryRunner.prototype.logError = function (sqlQuery, error) {
    console.error('Error performing: ' + sqlQuery + '\n' + error + '\n\n');
};

QueryRunner.prototype.runQuery = function (sqlQuery) {
    return new Promise((resolve, reject) => {
        this.pool.getConnection( (err, connection) => {
            if (err) {
                this.logError(sqlQuery, err);
                reject(err);
                return;
            }

            if (!connection) {
                reject('Connection to DB was not created');
                return;
            }

            connection.query(sqlQuery, (queryErr, response) => {
                if (queryErr) {
                    this.logError(sqlQuery, queryErr);
                    reject(queryErr);
                    return;
                }

                this.logQueryResponse(sqlQuery, response);
                resolve(response);
            });

            connection.release();
        });
    });
};

QueryRunner.prototype.runQueryWithErrorHandling = async function (sqlQuery, res) {
    try {
        return await this.runQuery(sqlQuery);
    } catch (error) {
        console.error('Error caught during query:' + error);
        res.status(500, {
            success: false,
            error: error
        });
    }
};

exports.buildQueryRunner = function () {
    return new QueryRunner();
};