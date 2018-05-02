import * as Q from 'q'
import * as mongodb from 'mongodb'
import * as debug from 'debug'

const Log = debug('wbb:mongo')

export class MongoStore {
    protected uri;
    protected conn;
    protected db;
    protected prefix;

    public constructor(uri, prefix) {
        this.uri = uri;
        this.prefix = prefix;
    }

    public connect() {
        Log('connecting to mongo database...');
        var deferred = Q.defer<void>();
        mongodb.MongoClient.connect(this.uri, (err, conn) => {
            if (err) {
                Log('error connecting: ' + err.message);
                deferred.reject(err);
            } else {
                this.conn = conn;
                this.db = conn.db();
                Log('connected to ' + this.db.name);
                deferred.resolve();
            }
        })
        return deferred.promise;
    }

    public collection(name) {
        return this.db.collection(this.prefix + name);
    }
}

export abstract class MongoObject {

}