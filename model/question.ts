import * as mongo from 'mongodb'

export interface Question {
    _id: mongo.ObjectID;
    type: string;
    created: Date;
    createdBy: string;
    difficulty: number;
    points: number;
}

interface AnswerableQuestion extends Question {
    question: string;
    answers: any
}

export interface VideoQuestion extends Question {
    vid: string;
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
    correct: string;
    other: string[];
}

export interface MultipleChoiceQuestion extends AnswerableQuestion {
    answers: MultipleChoiceAnswer;
}