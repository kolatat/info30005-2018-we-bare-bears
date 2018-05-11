import * as Q from 'q'
import * as mongodb from 'mongodb'
import {Collection, Db, MongoClient} from 'mongodb'
import * as debug from 'debug'

const Log = debug('wbb:mongo');

export class MongoStore {
    protected uri: string;
    protected conn: MongoClient;
    protected db: Db;
    protected prefix: string;

    public constructor(uri: string, prefix: string) {
        this.uri = uri;
        this.prefix = prefix;
    }

    public connect(): Q.Promise<void> {
        Log('connecting to mongo database...');
        var deferred = Q.defer<void>();
        mongodb.MongoClient.connect(this.uri, (err, conn: MongoClient) => {
            if (err) {
                Log('error connecting: ' + err.message);
                deferred.reject(err);
            } else {
                this.conn = conn;
                this.db = conn.db();
                Log('connected to ' + this.db.databaseName);
                deferred.resolve();
            }
        })
        return deferred.promise;
    }

    public collection(name): Collection {
        return this.db.collection(this.prefix + name);
    }
}