import * as model from '../model';
import {Router} from 'express';
import * as debug from 'debug';
import {ObjectID} from 'mongodb';
import {isNullOrUndefined} from "util";

const Log = debug('wbb:model:question');

const router = Router();

require('dotenv').config()
const store = new model.MongoStore(process.env.MONGO_HOST, process.env.MONGO_PREFIX);
store.connect().then(() => {
    Log('mongodb connected');
});

router.post('/', (req: any, res) => {
    // TODO validate input
    var question = req.body;
    question['created'] = new Date();
    question['createdBy'] = req.user.fbId;
    store.collection('questions').insertOne(question).then(r => {
        if (r.insertedCount == 1) {
            res.send({
                insertedId: r.insertedId
            });
        } else {
            res.status(500);
            res.send({
                "message": "unknown error"
            });
        }
    }).catch(err => {
        res.status(405);
        Log(err);
        res.send({
            "message": err.message
        });
    })
});

router.get('/random', (req, res) => {
    // console.log(req.user);
    store.collection('questions').aggregate([{
        $sample: {size: 1}
    }]).toArray().then(doc => {
        res.send(doc[0]);
    })
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
        res.status(400);
        res.send({
            "message": e.message
        });
        return;
    }
    store.collection("questions").replaceOne({
        _id: objID
    }, req.body).then(r => {
        res.send({
            result: r
        });
    }).catch(err => {
        res.status(500);
        res.send({
            "message": err.message
        });
    });
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
        res.status(400);
        res.send({
            "message": e.message
        });
        return;
    }
    store.collection('questions').findOne({
        _id: objID
    }).then(doc => {
        if (isNullOrUndefined(doc)) {
            res.status(404);
            res.send({
                "message": "question not found"
            });
        } else {
            res.send(doc);
        }
    }).catch(err => {
        Log(err);
        res.send({
            "message": err.message
        });
    });
});


/* New router(s) added below ---- */
// Check if answer is correct and returns the correct answer
router.get('/check/:qid', (req, res, next) => {
    var objID;
    if (!/^[0-9a-f]{24}$/i.test(req.params.qid)) {
        Log('does not match qid, referring...');
        next();
        return;
    }
    try {
        objID = ObjectID.createFromHexString(req.params.qid);
    } catch (e) {
        res.status(400);
        res.send({
            "message": e.message
        });
        return;
    }

    console.log("In router");
    console.log(objID);
    console.log(req.body.ans);

    store.collection("questions").replaceOne({
        _id: objID
    }, req.body).then(r => {

        // Checking whether the selected answer is correct
        let answered = req.body.ans;
        let result = false;

        if(r.type == "multiple-choice"){
            if(r.answers.correct == answered){
                result = true;
            }
        } else if (r.type == "fill-in-the-blanks"){
            if(r.answers == answered){
                result = true;
            }
        }

        // Send the result
        res.send({
            correct: result,
            answer: r.answers.correct
        });
    }).catch(err => {
        res.status(500);
        res.send({
            "message": err.message
        });
    });


});


export default router;