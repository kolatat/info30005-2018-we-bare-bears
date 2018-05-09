import * as model from '../model';
import {Router} from 'express';
import * as debug from 'debug';

const Log = debug('wbb:model:users');

export function createRouter(store: model.MongoStore) {
    const router = Router();

    function getUserByFbId(uid) {
        Log(uid);
        return new Promise((resolve, reject) => {
            store.collection('users').findOne({
                fbId: uid
            }, (err, dat) => {
                if (err) {
                    Log(err);
                    reject(err);
                } else {
                    Log(dat);
                    resolve(dat);
                }
            });
        });
    }

    router.get('/me', (req, res) => {
        getUserByFbId(req.user.fbId).then(user => {
            res.send(user);
        }).catch(err => {
            res.status(500).send(err);
        });
    });

    router.get('/:uid', (req, res) => {
        getUserByFbId(req.params.uid).then(user => {
            res.send(user);
        }).catch(err => {
            res.status(500).send(err);
        });
    });
    return router;
}