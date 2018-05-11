// default fields: id, first_name, last_name, name, name_format, picture, short_name
import {sendError, WbbRequest} from "./utils";
import {isNullOrUndefined} from "util";
import {Facebook, FacebookApiException} from 'fb';
import {MongoStore} from "./model";

// FB is RESTful like us!
// no need to wait for connection
export const FB = new Facebook({
    appId: 590373231339046,
    appSecret: process.env.FB_APP_SECRET
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
        FB.api('me', {fields: 'id,name,email', access_token: accessToken}).then(res => {
            (<any>store.collection('users')).findAndModify({
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
            }).then(res2 => {
                req.user = res2.value;
                next();
            }).catch(err => {
                sendError(res, "MongoDB Error", err);
            });
        }).catch(err => {
            sendError(res, "Facebook Error", err);
        });
    }
}