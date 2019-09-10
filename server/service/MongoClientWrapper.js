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
        return new Promise((resolve, reject) => {
            console.log("Running query to [" + collection + "] with search object: " + JSON.stringify(queryObject));
            MongoClient.connect(this.url, this.connectionOptions, (err, db) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                let dbo = db.db(this.database);

                const queryCallback = (err, response) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }

                    db.close();
                    console.log("Response: " + JSON.stringify(response));
                    resolve(response);
                };

                //TODO: This could simply run a .find({}) for find all
                if (queryObject !== null && queryObject !== undefined) {
                    dbo.collection(collection).find(queryObject).toArray(queryCallback);
                } else {
                    dbo.collection(collection).find().toArray(queryCallback);
                }
            })
        });
    }

    runSingleObjectQuery(collection, queryObject) {
        return new Promise((resolve, reject) => {
            console.log("Running query to [" + collection + "] with search object: " + JSON.stringify(queryObject));
            MongoClient.connect(this.url, this.connectionOptions, (err, db) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                let dbo = db.db(this.database);
                dbo.collection(collection).findOne(queryObject, (err, response) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }

                    db.close();
                    console.log("Response: " + JSON.stringify(response));
                    resolve(response);
                });
            })
        });
    }

    runInsert(collection, insertObject) {
        return new Promise((resolve, reject) => {
            console.log("Inserting to collection [" + collection + "] new object: " + JSON.stringify(insertObject));
            MongoClient.connect(this.url, this.connectionOptions, (err, db) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                let dbo = db.db(this.database);
                dbo.collection(collection).insertOne(insertObject, (err, response) => {
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

    runUpdate(collection, queryObj, insertObject, insertIfNotFound) {
        return new Promise((resolve, reject) => {
            console.log("Update to collection [" + collection + "] new object: " + JSON.stringify(insertObject) 
                + "\r\nAnd search object: " + JSON.stringify(queryObj));
            MongoClient.connect(this.url, this.connectionOptions, (err, db) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                let dbo = db.db(this.database);
                dbo.collection(collection).updateOne(queryObj, { $set: insertObject }, { upsert: insertIfNotFound }, (err, response) => {
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
