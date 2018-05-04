
/* Multiple-choice Question Object constructor */
function Mult_Question(ques_obj){
    this.question = ques_obj.question;
    this.choice = ques_obj.answers.other;
    this.answer = ques_obj.answers.correct;
//    this.points = ques_obj.points;
//    this.difficulty = ques_obj.difficulty;
}

/* Check if the answer chosen by user is correct */
Mult_Question.prototype.isCorrectAnswer = function(choice) {
    return this.answer === choice;
}


function Video(ques_obj){
    this.question = ques_obj.question;
    this.embed = ques_obj.vid;
//  this.points = ques_obj.points;


}