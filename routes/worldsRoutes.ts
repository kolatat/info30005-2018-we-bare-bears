import * as debug from 'debug';
import {sendError, WbbRouter} from "../utils";
import {World} from "../model/world";

const Log = debug('wbb:model:worlds');

export function initRouter(router: WbbRouter): WbbRouter {
    const mongo = router.store;

    router.use('/me', (req, res) => {
        // should have relative path correct I hope?
        res.redirect(req.user.fbId);
    });

    router.get('/:uid', (req, res) => {
        // check perm, user only allowed to get own or friends' world
        var owner = req.params.uid;
        if (req.user.fbId != owner && req.user.friends.list.indexOf(owner) < 0) {
            sendError(res, 'Forbidden', null, 403);
            return;
        }
        // TODO create explicit interface to include findAndModify
        res.sendPromise((<any>mongo.collection('worlds')).findAndModify({
            owner: owner
        }, null, {
            $setOnInsert: <World>{
                owner: owner,
                items: [],
                rubbish: []
            },
            $currentDate: {
                lastDump: {$type: 'date'},
                genesis: {$type: 'date'}
            }
        }, {
            new: true,
            upsert: true
        }).then(ires => {
            return ires.value;
        }));
    });

    router.put('/:uid', (req, res) => {
        // check perm, can only modify own world
        var owner = req.params.uid;
        if (req.user.fbId != owner) {
            sendError(res, 'Forbidden', null, 403);
            return;
        }
        var updateSet: any = {};
        //Log(req.body);
        if (req.body.items) {
            updateSet.items = req.body.items;
        }
        if (req.body.rubbish) {
            updateSet.rubbish = req.body.rubbish;
        }
        if (req.body.lastDump) {
            updateSet.lastDump = new Date();
        }
        //Log(updateSet);
        if (updateSet == {}) {
            res.sendStatus(200);
            return;
            // alternatively, warn user there is nothing to update
        }
        res.sendPromise(mongo.collection('worlds').updateOne({
            owner: owner
        }, {
            $set: updateSet
        }));
    })

    return router;
}

/*

findAndModify({
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
 */