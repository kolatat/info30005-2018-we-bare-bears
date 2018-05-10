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
        /*getUserByFbId(req.user.fbId).then(user => {
            res.send(user);
        }).catch(err => {
            res.status(500).send(err);
        });*/
        res.send(req.user);
    });

    router.get('/:uid', (req, res) => {
        getUserByFbId(req.params.uid).then(user => {
            res.send(user);
        }).catch(err => {
            res.status(500).send(err);
        });
    });

    router.get('/me/requests', (req, res) => {
        res.send({
            requests: req.user.friends.reqReceived
        });
    })

    router.delete('/me/requests/:uid', (req, res) => {
        // rejects and remove a request
        store.collection("users").updateOne({
            fbId: req.user.fbId
        }, {
            $pull: {
                "friends.reqReceived": req.params.uid
            }
        }).then(r => {
            res.send({
                result: R
            });
        }).catch(err => {
            res.send({
                message: err.message
            });
        });
    });

    router.put('/me/requests/:uid', (req, res) => {
        // accepts a friend request
        // make sure they actually sent a request & they exists!
        if (req.body.action != 'accept') {
            res.status(400).send({
                "message": "no understand request"
            })
            return;
        }
        getUserByFbId(req.params.uid).then(friend => {
            if (!(req.parms.uid in friend.friends.reqSent)) {
                res.status(404).send({
                    message: "They are not your friend. (Never sent a request. Try requesting them?"
                });
                return;
            }
            // remove the requests, and add friends and me to each other list
            Promise.all([store.collection('users').updateOne({
                fbId: friend.uid
            }, {
                $pull: {
                    "friends.reqSent": req.user.fbId
                },
                $addToSet: {
                    "friends.list": req.user.fbId
                }
            }), store.collection('users').updateOne({
                fbId: req.user.fbId
            }, {
                $pull: {
                    "friends.reqReceived": friend.fbId
                },
                $addToSet: {
                    "friends.list": friend.fbId
                }
            })]).then(r => {
                res.send({
                    result: r
                })
            })
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    })

    router.post('/:uid/request', (req, res) => {
        // this is like sending a request from me to UID
        // uid has to exist otherwise 404
        getUserByFbId(req.params.uid).then(friend => {
            // add friend.uid to me.friends.reqSent
            // add me.uid to friend.friends.reqReceived
            // only if not already friends
            if (!(req.user.fbId in friend.friends.list)) {
                Promise.all([store.collection('users').updateOne({
                    fbId: friend.fbId
                }, {
                    $addToSet: {
                        'friends.reqReceived': req.user.fbId
                    }
                }),
                    store.collection('users').updateOne({
                        fbId: req.user.fbId
                    }, {
                        $addToSet: {
                            'friends.reqSend': friend.fbId
                        }
                    })]).then(r => {
                    res.send({
                        result: r
                    })
                });
            } else {
                // already friends baka
                res.send({
                    message: 'Already friends baka'
                });
            }
        }).catch(err => {
            res.status(500).send(err);
        });
    });
    return router;
}