/* Quiz object constructor */
function Quiz(questions, mcq, vid) {
    this.score = 0;
    this.questions = questions; // Array of questions
    this.questionIndex = 0; // Current question
    this.mcq = mcq; // Number of Multiple Choice questions
    this.videos = vid; // Number of videos
}

/* Get the total number of questions */
Quiz.prototype.getQuizLength = function () {
    return this.questions.length;
}


/* Get the current question */
Quiz.prototype.getQuestionIndex = function() {
    return this.questions[this.questionIndex];
}

/* Guess the answer selected by user */
Quiz.prototype.guess = function(answer) {
    if(this.getQuestionIndex().isCorrectAnswer(answer)) {
        this.score++;
    }
    this.questionIndex++;
}

/* Move along the list of questions (used for video-type questions */
Quiz.prototype.proceed = function(){
    this.questionIndex++;
}

/* Check if there are no more questions remaining */
Quiz.prototype.isEnded = function() {
    return this.questionIndex === this.questions.length;
}
