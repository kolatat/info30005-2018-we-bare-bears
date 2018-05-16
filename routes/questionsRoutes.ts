import * as debug from 'debug';
import {ObjectID} from 'mongodb';
import {isNullOrUndefined} from "util";
import {requireInput, sendError, ValidationError, WbbError, WbbRouter} from "../utils";
import {
    FillBlanksQuestion,
    MultipleChoiceQuestion,
    Question, validateFillBlanksQuestion, validateMultipleChoiceQuestion,
    validateVideoQuestion,
    VideoQuestion
} from "../model/question";

const Log = debug('wbb:model:question');

export function initRouter(router: WbbRouter): WbbRouter {
    function validateInputQuestion(question: any): Question {
        requireInput(question.type, "question.type not specified");
        if (question.type == "youtube-video") {
            question = validateVideoQuestion(question);
        } else if (question.type == "fill-in-the-blanks") {
            question = validateFillBlanksQuestion(question);
        } else if (question.type == "multiple-choice") {
            question = validateMultipleChoiceQuestion(question);
        } else {
            throw new ValidationError(`Invalid question.type '${question.type}'`, 400);
        }
        return question;
    }

    router.post('/', (req, res) => {
        var question: Question = <Question>req.body;
        try {
            question = validateInputQuestion(question);
        } catch (err) {
            if (err instanceof ValidationError) {
                sendError(res, "Validation Error", err);
            } else {
                sendError(res, "Uncaught generic error", err);
            }
            return;
        }

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
            // Returning an object (?) that contains an array of questions
            return {docs: doc};
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
            sendError(res, "Bad request - hint: it's the object ID", e, 404);
            return;
        }
        var question: Question = <Question>req.body;
        try {
            question = validateInputQuestion(question);
        } catch (err) {
            if (err instanceof ValidationError) {
                sendError(res, "Validation Error", err);
            } else {
                sendError(res, "Uncaught generic error", err);
            }
            return;
        }
        res.sendPromise(router.mongo("questions").replaceOne({
            _id: objID
        }, question).then(r => {
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


    /* TO DELETE CODE BELOW !! */
    router.get('/testQuery', (req, res) => {
        // what is this?
        router.mongo('worlds').find({}).toArray(function (error, documents) {
            if (error) {
                throw error;
            }
            res.send(documents);
        });

    });
    /* END TO DELETE CODE BELOW !! */


    return router;
}