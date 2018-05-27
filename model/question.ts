import * as mongo from 'mongodb'
import {requireArray, requireInput, ValidationError} from "../utils";

export interface Question {
    _id: mongo.ObjectID;
    type: string;
    created: Date;
    createdBy: string;
    difficulty: number;
    points: number;
}

interface AnswerableQuestion extends Question {
    answers: any
}

export interface VideoQuestion extends Question {
    vid: string;
}

export interface MatchPairsQuestion extends Question {
    pairs: string[];
}

interface FillBlanksChoice {
    type: string;
    value: string;
}

export interface FillBlanksQuestion extends AnswerableQuestion {
    fill_blanks: FillBlanksChoice[];
    answers: string[];
}

export interface MultipleChoiceAnswer {
    question: string;
    correct: string;
    other: string[];
}

export interface MultipleChoiceQuestion extends AnswerableQuestion {
    answers: MultipleChoiceAnswer;
}

function validateAnswerableQuestion(question: any): AnswerableQuestion {
    requireInput(question.answers, "question.answers missing");
    return <AnswerableQuestion> question;
}

export function validateVideoQuestion(question: any): VideoQuestion {
    requireInput(question.vid, "question.vid missing");
    return <VideoQuestion>question;
}

export function validateMatchPairsQuestion(question: any): MatchPairsQuestion {

    // Should have four pairs
    if(question.pairs.length !== 4){
        throw new ValidationError(`question.pairs does not have four pairs`);
    }

    // Each "matching pair" should have two values in the array
    for(let pair in question.pairs){
        if(question.pairs[pair].length !== 2){
            throw new ValidationError(`One of the matching pairs, is not a pair!`);
        }
    }

    // Should not have any repeating value
    var value_set = [];
    for(let pair in question.pairs){
        for(let match in question.pairs[pair]){
            if(value_set.indexOf(question.pairs[pair][match]) >= 0){
                throw new ValidationError(`Should not have repeat values in any of the pairs`);
            }
            value_set.push(question.pairs[pair][match]);
        }
    }

    return <MatchPairsQuestion>question;
}

export function validateFillBlanksQuestion(question: any): FillBlanksQuestion {
    question = validateAnswerableQuestion(question);
    requireArray(question.answers, `question.answers=${question.answers} is not an array`);
    for (let answerId in question.answers) {
        if (typeof(question.answers[answerId]) !== "string") {
            throw new ValidationError(`question.answers[${answerId}]=${question.answers[answerId]} is not a string`, 400);
        }
    }
    requireInput(question.fill_blanks, "question.fill_blanks missing");
    requireArray(question.fill_blanks, `question.fill_blanks=${question.fill_blanks} is not an array`);
    for (let blankId in question.fill_blanks) {
        var comp = question.fill_blanks[blankId];
        var compName = `question.fill_blanks[${blankId}]`;
        // TODO validate actual value and type
        requireInput(comp.type, `${compName}.type missing`);
        if (!new Set(['fill', 'blank']).has(comp.type)) {
            throw new ValidationError(`${compName}.type=${comp.type} is not one of 'fill' or 'blank'`);
        }
        requireInput(comp.value, `${compName}.value missing`);
        if (typeof(comp.value) !== "string") {
            throw new ValidationError(`${compName}.value=${comp.value} is not a string`);
        }
    }
    return <FillBlanksQuestion>question;
}

export function validateMultipleChoiceQuestion(question: any): MultipleChoiceQuestion {
    question = validateAnswerableQuestion(question);
    requireInput(question.question, "question.question missing");
    requireInput(question.answers.correct, "question.answers.correct missing");
    requireInput(question.answers.other, "question.answers.other missing");
    requireArray(question.answers.other, `question.answers.other=${question.answers.other} is not an array`);
    for (let ansId in question.answers.other) {
        var ans = question.answers.other[ansId];
        var ansName = `question.answers.other[${ansId}]`;
        if (typeof(ans) !== "string") {
            throw new ValidationError(`${ansName}=${ans} is not a string`, 400);
        }
    }
    return <MultipleChoiceQuestion>question;
}
