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

QueryRunner.prototype.logQueryResponse = function (query_text, rows) {
    console.log('For query: ' + query_text);
    console.log(JSON.stringify(rows) + ' row(s) returned');
    console.log('\n\n\n');
};

QueryRunner.prototype.logError = function (sql_query, error) {
    console.error('Error performing: ' + sql_query + '\n' + error + '\n\n');
};

QueryRunner.prototype.runQuery = function (sql_query) {
    return new Promise((resolve, reject) => {
        this.pool.getConnection( (err, connection) => {
            if (err) {
                this.logError(sql_query, err);
                reject(err);
                return;
            }

            if (!connection) {
                reject('Connection to DB was not created');
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