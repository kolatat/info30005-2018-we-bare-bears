// default fields: id, first_name, last_name, name, name_format, picture, short_name
import {sendError, WbbRequest} from "./utils";
import {isNullOrUndefined} from "util";
import {Facebook, FacebookApiException} from 'fb';
import {MongoStore} from "./model";
import * as NodeCache from 'node-cache'

const Log = require('debug')('wbb:facebook');

// FB is RESTful like us!
// no need to wait for connection
export const FB = new Facebook({
    appId: process.env.FB_APP_ID,
    appSecret: process.env.FB_APP_SECRET
});

// don't send too many req to fb
const authCache = new NodeCache({
    stdTTL: 5 * 60
});

export function fbAuth(store: MongoStore) {
    return function (req: WbbRequest, res, next) {
        var auth: string = req.header('authorization');
        if (isNullOrUndefined(auth) || !auth.startsWith('Facebook ')) {
            res.status(401).send({
                error: 'bad authentication'
            });
            return;
        }
        var accessToken = auth.substr(9);
        new Promise((resolve, reject) => {
            authCache.get(accessToken, (err, dat) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(dat);
                }
            });
        }).then(cached => {
            if (isNullOrUndefined(cached)) {
                Log('AUTH CACHE MISS reauthenticating');
                return FB.api('me', {fields: 'id,name,email', access_token: accessToken}).then(fresh => {
                    authCache.set(accessToken, fresh, (err, suc) => {
                        if (err || !suc) {
                            Log("AUTH CACHE set error");
                            Log(err);
                        }
                    });
                    return fresh;
                })
            } else {
                // Log('AUTH CACHE HIT ' + (<any>cached).id);
                return cached;
            }
        }).then(res => {
            store.getUserByFbId(res.id).then(user => {
                if (isNullOrUndefined(user)) {
                    return (<any>store.collection('users')).findAndModify({
                        fbId: res.id
                    }, null, {
                        $setOnInsert: {
                            fbId: res.id,
                            name: res.name,
                            email: res.email,
                            friends: {
                                list: [],
                                reqSent: [],
                                reqReceived: []
                            },
                            questions: [],
                            wallet: 10,
                            home: []
                        },
                        $currentDate: {
                            'lastAccessed.time': {$type: 'date'}
                        },
                        $set: {
                            'lastAccessed.ip': req.ip
                        }
                    }, {
                        new: true,
                        upsert: true
                    }).then(ires => {
                        return ires.result.value;
                    });
                } else {
                    return user;
                }
            }).then(user => {
                req.user = user;
                next();
            }).catch(err => {
                sendError(res, "Generic Error", err);
            });
        }).catch(err => {
            sendError(res, "Facebook Error", err);
        });
    }
}