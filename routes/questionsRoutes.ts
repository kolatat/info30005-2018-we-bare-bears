import * as debug from 'debug';
import {ObjectID} from 'mongodb';
import {isNullOrUndefined} from "util";
import {sendError, WbbError, WbbRouter} from "../utils";

const Log = debug('wbb:model:question');

export function initRouter(router: WbbRouter): WbbRouter {
    router.post('/', (req, res) => {
        // TODO validate input
        var question = req.body;
        question['created'] = new Date();
        question['createdBy'] = req.user.fbId;
        res.sendPromise(router.mongo('questions').insertOne(question).then(r => {
            if (r.insertedCount == 1) {
                return {insertedId: r.insertedId};
            } else {
                throw new Error(r.insertedCount + " rows inserted");
            }
        }));
    });

    router.get('/random', (req, res) => {
        // console.log(req.user);
        var size = 1;
        if (!isNullOrUndefined(req.query['n'])) {
            size = parseInt(req.query['n']);
        }
        res.sendPromise(router.mongo('questions').aggregate([{
            $sample: {size: size}
        }]).toArray().then(doc => {
            // TODO should actually always return array, but for legacy purposes
            if (size == 1) {
                return doc[0];
            } else {
                return {docs: doc};
            }
        }));
    });

    router.put('/:qid', (req, res, next) => {
        var objID;
        if (!/^[0-9a-f]$/i.test(req.params.qid)) {
            next();
            return;
        }
        try {
            objID = ObjectID.createFromHexString(req.params.qid);
        } catch (e) {
            sendError(res, "Bad request", e, 400);
            return;
        }
        res.sendPromise(router.mongo("questions").replaceOne({
            _id: objID
        }, req.body).then(r => {
            return {result: r};
        }));
    });

    router.get('/:qid', (req, res, next) => {
        var objID;
        if (!/^[0-9a-f]{24}$/i.test(req.params.qid)) {
            Log('does not match qid, referring...');
            next();
            return;
        }
        try {
            objID = ObjectID.createFromHexString(req.params.qid);
        } catch (e) {
            sendError(res, "Bad request", e, 400);
            return;
        }
        res.sendPromise(router.mongo('questions').findOne({
            _id: objID
        }).then(doc => {
            if (isNullOrUndefined(doc)) {
                throw new WbbError("Question not found", 404);
            } else {
                res.send(doc);
            }
        }));
    });

    router.get('/testQuery', (req, res) => {
        // what is this?
        router.mongo('questions').find({
            price: null
        }).toArray(function (error, documents) {
            if (error) {
                throw error;
            }
            res.send(documents);
        });

    });


    /* New router(s) added below ---- */
    /* To hide/delete Mei's horrible accident */

    router.delete('/:qid', (req, res, next) => {
        var objID;
        if (!/^[0-9a-f]{24}$/i.test(req.params.qid)) {
            Log('does not match qid, deferring...');
            next();
            return;
        }
        try {
            objID = ObjectID.createFromHexString(req.params.qid);
        } catch (e) {
            sendError(res, "Bad request", e, 400);
            return;
        }

        router.mongo("questions").deleteOne({
            _id: objID
        }).then(doc => {
            if (doc.deletedCount == 0) {
                throw new WbbError("Question not found", 404);
            } else {
                res.send(doc);
            }

        });
    });

    return router;
}