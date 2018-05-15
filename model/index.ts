import * as Q from 'q'
import * as mongodb from 'mongodb'
import {Collection, Db, MongoClient} from 'mongodb'
import * as debug from 'debug'
import * as NodeCache from 'node-cache'
import {User} from "./user";
import {isNullOrUndefined} from "util";

const Log = debug('wbb:mongo');

export class MongoStore {
    protected uri: string;
    protected conn: MongoClient;
    protected db: Db;
    protected prefix: string;

    public usersCache = new NodeCache({stdTTL: 5 * 60});

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

    public getUserByFbId(fbId: string): Q.Promise<User> {
        return Q.Promise((resolve, reject) => {
            this.usersCache.get(fbId, (err, val) => {
                if (err || isNullOrUndefined(val)) {
                    // Log('USERS CACHE MISS ' + fbId)
                    if (err) Log(err);
                    this.collection('users').findOne({
                        fbId: fbId
                    }, (err, dat) => {
                        if (err) {
                            Log(err);
                            reject(err);
                        } else {
                            // if not found, data will still be valid but null
                            // don't negative cache
                            if (!isNullOrUndefined(dat)) this.usersCache.set(fbId, dat);
                            resolve(dat);
                        }
                    });
                } else {
                    // Log('USERS CACHE HIT ' + fbId);
                    resolve(<User>val);
                }
            });
        });
    }
}