var MongoClient = require('mongodb').MongoClient;

module.exports = class MongoClientWrapper {
    constructor() {
        this.url = process.env.SCOREMASTER_MONGO_URL;
        this.database = process.env.SCOREMASTER_MONGO_DB;
        this.connectionOptions = {
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        }
    }
    
    runQuery(collection, queryObject) {

    }

    runInsert(collection, insertObject) {
        return new Promise((resolve, reject) => {
            console.log("Inserting new object: " + JSON.stringify(insertObject));
            MongoClient.connect(this.url, this.connectionOptions, (err, db) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                let dbo = db.db(this.database);
                dbo.collection(collection).insertOne(insertObject, function (err, response) {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }

                    db.close();
                    console.log("Response: " + JSON.stringify(response));
                    resolve(response);
                });
            });
        });

    }
}
