/* Quiz object constructor */
function Quiz(max_ques) {
    this.score = 0;
    this.questions = []; // Array of question added along the quiz
    this.questionIndex = 0; // Current question
    this.mcq = 0; // Number of Multiple Choice questions
    this.videos = 0; // Number of videos
    this.maxQues = max_ques;
}

/* Get the maximum number of questions */
Quiz.prototype.getQuizLength = function () {
    return this.maxQues;
}


/* Get the current question */
Quiz.prototype.getQuestionIndex = function() {
    return this.questions[this.questionIndex];
}

/* *Unused function* Guess the answer selected by user */
Quiz.prototype.guess = function(answer) {
    if(this.getQuestionIndex().isCorrectAnswer(answer)) {
        this.score++;
    }
    this.questionIndex++;
}


/* Guess the answer selected by user and returns the object */
Quiz.prototype.guessAnswer = function (answer) {

    var ans_obj = this.getQuestionIndex().getCorrectAnswer(answer);

    if(ans_obj.correct){
        this.score++;
    }
    this.questionIndex++;

    // Return the correct answer to be shown to user
    return ans_obj;

}


/* Move along the list of questions (used for video-type questions */
Quiz.prototype.proceed = function(){
    this.questionIndex++;
}

/* Check if there are no more questions remaining */
Quiz.prototype.isEnded = function() {
    return this.questionIndex === this.maxQues;
}
