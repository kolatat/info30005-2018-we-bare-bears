import * as debug from 'debug';
import {sendError, WbbRouter} from "../utils";
import {User} from "../model/user";

const Log = debug('wbb:model:users');

export function initRouter(router: WbbRouter): WbbRouter {
    //@deprecate('Use the router.store.getUserByFbId to use caching')
    // but careful if modifying
    function getUserByFbId(uid): Promise<User> {
        Log('WARNING DEPRECATE');
        return new Promise((resolve, reject) => {
            router.mongo('users').findOne({
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

    router.post('/me/tutorial', (req, res) => {
        var status: boolean;
        if (req.body.status == 'completed') {
            status = false;
        } else if (req.body.status == 'incompleted') {
            status = true;
        } else {
            sendError(res, 'Invalid request. status=completed|incompleted', null, 400);
            return;
        }
        res.sendPromise(router.mongo('users').updateOne({
            fbId: req.user.fbId
        }, {
            $set: {
                'isFirstTime': status
            }
        }).then(r => {
            router.store.usersCache.del(req.user.fbId);
            return r;
        }));
    });

    router.get('/:uid', (req, res) => {
        res.sendPromise(router.store.getUserByFbId(req.params.uid));
    });

    // returns list of friends
    router.get('/me/friends', (req: any, res) => {
        res.send({
            requests: req.user.friends.list
        });
    });

    // unfriend
    router.delete('/me/friends/:uid', (req, res) => {
        // delete cache
        router.store.usersCache.del([req.user.fbId, req.params.uid]);
        res.sendPromise(Promise.all([
            router.mongo("users").updateOne({
                fbId: req.user.fbId
            }, {
                $pull: {
                    "friends.list": req.params.uid
                }
            }),
            router.mongo("users").updateOne({
                fbId: req.params.uid
            }, {
                $pull: {
                    "friends.list": req.user.fbId
                }
            })]).then(r => {
            return {results: r};
        }));
    });

    router.get('/me/requests', (req: any, res) => {
        res.send({
            requests: req.user.friends.reqReceived
        });
    });

    // reject a friend request -- y so mean
    router.delete('/me/requests/:uid', (req: any, res) => {
        // delete cache
        router.store.usersCache.del([req.user.fbId, req.params.uid]);
        // rejects and remove a request
        res.sendPromise(Promise.all([
            router.mongo("users").updateOne({
                fbId: req.user.fbId
            }, {
                $pull: {
                    "friends.reqReceived": req.params.uid
                }
            }),
            // remove request from user who sent it
            router.mongo("users").updateOne({
                fbId: req.params.uid
            }, {
                $pull: {
                    "friends.reqSent": req.user.fbId
                }
            })]).then(r => {
            return {results: r};
        }));
    });

    // accepts a friend request
    router.put('/me/requests/:uid', (req: any, res) => {
        // make sure they actually sent a request & they exists!
        if (req.body.action != 'accept') {
            res.status(400).send({
                "message": "no understand request"
            });
            return;
        }
        // delete cache
        router.store.usersCache.del([req.user.fbId, req.params.uid]);
        getUserByFbId(req.params.uid).then(friend => {
            if ((friend.friends.reqSent.indexOf(req.user.fbId) < 0)) {
                res.status(404).send({
                    message: "They are not your friend. (Never sent a request. Try requesting them?"
                });
                return;
            }
            // remove the requests, and add friends and me to each other list
            res.sendPromise(Promise.all([
                router.mongo('users').updateOne({
                    fbId: friend.fbId
                }, {
                    $pull: {
                        "friends.reqSent": req.user.fbId
                    },
                    $addToSet: {
                        "friends.list": req.user.fbId
                    }
                }),
                router.mongo('users').updateOne({
                    fbId: req.user.fbId
                }, {
                    $pull: {
                        "friends.reqReceived": friend.fbId
                    },
                    $addToSet: {
                        "friends.list": friend.fbId
                    }
                })]).then(r => {
                return {results: r};
            }));
        });
    });

    // send a friend request
    router.post('/:uid/request', (req: any, res) => {
        // delete cache
        router.store.usersCache.del([req.user.fbId, req.params.uid]);
        // this is like sending a request from me to UID
        // uid has to exist otherwise 404
        res.sendPromise(getUserByFbId(req.params.uid).then<any>(friend => {
            // add friend.uid to me.friends.reqSent
            // add me.uid to friend.friends.reqReceived
            // only if not already friends

            if (friend.friends.list.indexOf(req.user.fbId) >= 0) {
                return {
                    message: 'Already friends baka',
                    friend_name: friend.name
                }
            }
            else if (friend.friends.reqReceived.indexOf(req.user.fbId) >= 0) {
                return {
                    message: 'Already sent a request to this friend',
                    friend_name: friend.name
                }
            }
            else if (friend.friends.reqSent.indexOf(req.user.fbId) >= 0) {
                return {
                    message: 'Already received a request from this friend',
                    friend_name: friend.name
                }
            }
            else {
                return Promise.all([
                    router.mongo('users').updateOne({
                        fbId: friend.fbId
                    }, {
                        $addToSet: {
                            'friends.reqReceived': req.user.fbId
                        }
                    }),
                    router.mongo('users').updateOne({
                        fbId: req.user.fbId
                    }, {
                        $addToSet: {
                            'friends.reqSent': friend.fbId
                        }
                    })
                ]).then(r => {
                    return {results: r};
                });
            }
        }));
    });

    // cancel a sent friend request
    router.delete('/me/sent-requests/:uid', (req: any, res) => {
        // delete cache
        router.store.usersCache.del([req.user.fbId, req.params.uid]);
        // rejects and remove a request
        res.sendPromise(Promise.all([
            router.mongo("users").updateOne({
                fbId: req.user.fbId
            }, {
                $pull: {
                    "friends.reqSent": req.params.uid
                }
            }),
            // remove request from user who sent it
            router.mongo("users").updateOne({
                fbId: req.params.uid
            }, {
                $pull: {
                    "friends.reqReceived": req.user.fbId
                }
            })]).then(r => {
            return {results: r};
        }));
    });


    /* New router below */
    /* Router for updating wallet value */
    router.put('/me/wallet', (req, res) => {

        // delete cache
        router.store.usersCache.del(req.user.fbId);
        let update_wallet = req.user.wallet;
        let change_amount = Number(req.body.value);

        // Only update the wallet if input is valid
        if (change_amount != null && !isNaN(change_amount)) {
            if (req.body.action == "add") {
                update_wallet += change_amount;
            } else if (req.body.action == "minus") {

                update_wallet -= change_amount;
                if (update_wallet < 0) {
                    return res.status(400).send({
                        error: "Error: Insufficient honey pots!"
                    });
                }

            } else {
                res.status(400).send({
                    error: "Bad request: Can only 'add' or 'minus' honey pots"
                });
            }

            // Updates the user's wallet
            res.sendPromise(router.mongo("users").updateOne({
                fbId: req.user.fbId
            }, {
                $set: {
                    "wallet": update_wallet
                }
            }).then(r => {
                return {result: r};
            }));
        } else {
            res.status(400).send({
                error: "Bad request"
            });
        }
    });


    // Updates the user's inventory
    router.put('/me/inventory', (req, res) => {

        // TODO input validation

        res.sendPromise(router.mongo("users").updateOne({
            fbId: req.user.fbId
        }, {
            $set: req.body
        }).then(r => {
            return {result: r};
        }));

    });


    // Get the user's inventory
    router.get('/me/inventory', (req, res) => {

        res.sendPromise(getUserByFbId(req.user.fbId).then(function (me) {
            res.send(me.inventory);
        }));

    });

    return router;
}
