/* Quiz object constructor */
function Quiz(ques_list, numQues, numVid) {
    this.questions = ques_list; // Array of questions
    this.questionIndex = 0; // Current question
    this.numQues = numQues; // Number of Multiple Choice/Fill in the Blanks questions
    this.numVid = numVid; // Number of Videos in this quiz
    this.score = 0;
    this.totalHoney = 0;
}


/* Get the current question */
Quiz.prototype.getQuestionIndex = function() {
    return this.questions[this.questionIndex];
};


/* Guess the answer selected by user and returns the object */
Quiz.prototype.guessAnswer = function (answer) {

    var ans_obj = this.getQuestionIndex().getCorrectAnswer(answer);
    if(ans_obj.correct){
        this.score++;
        this.totalHoney += this.questions[this.questionIndex].points;
    }
    this.questionIndex++;

    // Return the correct answer to be shown to user
    return ans_obj;

};


/* Move along the list of questions (used for video-type questions */
Quiz.prototype.proceed = function(){
    this.totalHoney += this.questions[this.questionIndex].points;
    this.questionIndex++;
};


/* Check if there are no more questions remaining */
Quiz.prototype.isEnded = function() {
    return this.questionIndex === this.questions.length;
};
