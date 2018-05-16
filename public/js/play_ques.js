//////////////////////////////
/* MULTIPLE CHOICE QUESTION */
//////////////////////////////

/* Multiple-choice Question Object constructor */
function Mult_Question(ques_obj){
    this.question = ques_obj.question;
    this.choice = ques_obj.answers.other;
    this.answer = ques_obj.answers.correct;
    this.id = ques_obj._id;
    this.points = Number(ques_obj.points);  // Make sure this is a number
    this.difficulty = Number(ques_obj.difficulty);  // For storing score (?)
}

/* Check if the answer chosen by user is correct and get the correct answer */
Mult_Question.prototype.getCorrectAnswer = function (choice) {

    // Return data about the question for displaying to the user
    // Structure to be modified if API call used in future to check answer
    return {
        question: this.question,
        answer: this.answer,
        correct: this.answer === choice,
        type: "mult"
    };
};


/////////////////////////////////
/* FILL-IN-THE-BLANKS QUESTION */
/////////////////////////////////

/* Fill-in-the-Blanks Question Object constructor */
function Blanks_Question(ques_obj){
    this.question = ques_obj.fill_blanks;
    this.answer = ques_obj.answers;
    this.id = ques_obj.id;
    this.points = Number(ques_obj.points);
    this.difficulty = Number(ques_obj.difficulty);  // For storing score (?)
}

Blanks_Question.prototype.getCorrectAnswer = function(answer_order){
    // answer_order is an array of strings containing the answer choices in order specified by user

    console.log(answer_order);
    var correct = true;
    for(var i=0; i<answer_order.length; i++){
        if(answer_order[i] === this.answer[i]){
            continue;
        } else {
            correct = false;
            break;
        }
    }
    // Return data about the question for displaying to the user
    return {
        question: this.question,
        correct: correct,
        type: "blanks"
    };
};


////////////
/* VIDEO */
////////////
/* Video Object Constructor */
function Video(ques_obj){
    this.question = ques_obj.question;
    this.embed = ques_obj.vid;
    this.points = Number(ques_obj.points);
    this.difficulty = Number(ques_obj.difficulty);  // For storing score (?)

}
