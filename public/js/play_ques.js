
/* Multiple-choice Question Object constructor */
function Mult_Question(ques_obj){
    this.question = ques_obj.question;
    this.choice = ques_obj.answers.other;
    this.answer = ques_obj.answers.correct;
//    this.points = ques_obj.points;
//    this.difficulty = ques_obj.difficulty;
}

/* *Unused function* Check if the answer chosen by user is correct */
Mult_Question.prototype.isCorrectAnswer = function(choice) {
    return this.answer === choice;
}


/* Check if the answer chosen by user is correct and get the correct answer */
Mult_Question.prototype.getCorrectAnswer = function (choice) {
    var ans_obj = {
        question: this.question,
        answer: this.answer,
        correct: this.answer === choice,
        type: "mult"
    }

    return ans_obj;
}

function Blanks_Question(ques_obj){
    this.question = ques_obj.fill_blanks;
    this.answer = ques_obj.answer;
}

Blanks_Question.prototype.getCorrectAnswer = function(answer_order){
    // answer_order is an array containing the answer choices in order specified by user

    var correct = true;

    for(var i=0; i<answer_order.length; i++){
        if(answer_order[i] === this.answer[i]){
            continue;
        } else {
            correct = false;
            break;
        }
    }

    var ans_obj = {
        question: this.question,
        correct: correct,
        type: "blanks"
    }

    return ans_obj;

}

function Video(ques_obj){
    this.question = ques_obj.question;
    this.embed = ques_obj.vid;
//  this.points = ques_obj.points;


}