
/*************************************************************************/
// Functions for the quiz
/*************************************************************************/

// Global quiz variable
var quiz;

/* Get input from user on number of questions to populate the quiz */
function _generateQuizQuestions() {

    // Allow users to choose only between 1-5 questions
    var num_questions = parseInt(prompt("How many questions would you like to answer? (1 - 5)"));
    if (num_questions > 0 && num_questions <= 5) {
        alert("Starting quiz with " + num_questions + " questions!");
        _startQuiz(num_questions);
    } else {
        var quiz_container = document.getElementById("quiz_container");
        quiz_container.innerHTML =
            "Sorry! Please enter a valid integer between 1 and 5";
    }
}

/* Start the Quiz */
function _startQuiz(num_ques) {

    Recyclabears.questions.getRandomQuestion(num_ques).then(function(data){
        var questions = data.docs;
        var question_list = [];
        var numQues = 0;
        var numVid = 0;

        // Create new Question object based on the question type
        for(var i = 0; i < questions.length; i++){
            if (questions[i].type === "multiple-choice") {
                var new_ques = new Mult_Question(questions[i]);
                question_list.push(new_ques);
                numQues++;
            } else if(questions[i].type === "fill-in-the-blanks"){
                var new_blanks = new Blanks_Question(questions[i]);
                question_list.push(new_blanks);
                numQues++;
            } else if (questions[i].type === "youtube-video") {
                var new_vid = new Video(questions[i]);
                question_list.push(new_vid);
                numVid++;
            }
        }

        // Create new Quiz object for current round of quizzes
        quiz = new Quiz(question_list, numQues, numVid);

        // Display the quiz
        populate();
        return 'done';
    });
}

/* Populate the page with a question Object */
function populate() {

    // If no more questions are remaining, display the score
    if (quiz.isEnded()) {
        // Show end result of quiz
        showScores();

        // Can only earn honey if user completed the whole quiz
        Recyclabears.users.updateWallet("add", Number(quiz.totalHoney)).then(function () {
            updatePrice();
        });
    }

    else {

        // Display question based on the type
        var ques_obj = quiz.getQuestionIndex();
        if (ques_obj instanceof Mult_Question) {
            _displayMult(ques_obj);
        } else if (ques_obj instanceof Blanks_Question) {
            _displayBlanks(ques_obj);
        } else if (ques_obj instanceof Video) {
            _displayVideo(ques_obj);
        }

        // Update footer text to show quiz progress
        showProgress();
    }
}

/* Function to be attached to the answer buttons for guessing that option */
function guessAnswer(button) {
    var button = document.getElementById(button.id);
    var guess = button.innerHTML;
    var ans_obj = quiz.guessAnswer(guess);
    showAnswer(ans_obj);
}

/* Show the correct answer to the user */
function showAnswer(answer_object) {
    var quesResultHTML = "";

    if (answer_object.correct === true) {
        quesResultHTML += "<h1>Correct Answer!</h1>";
    } else {
        quesResultHTML += "<h1>Wrong Answer!</h1>";
    }

    // Show question and correct answer for an MCQ-type question
    if (answer_object.type === "mult") {
        quesResultHTML += "<p>Question: <em>" + answer_object.question + "</em></p>";
        quesResultHTML += "<p>Correct answer:  <em>" + answer_object.answer + "</em></p>";
    }
    // Show correct statement for fill-in-the-blanks type question
    else if (answer_object.type === "blanks") {
        quesResultHTML += "<p>Correct Statement:</p>";
        for (var i = 0; i < answer_object.question.length; i++) {
            if (answer_object.question[i].type === "fill") {
                quesResultHTML += "<pre class='fill-blanks fill' ";
                quesResultHTML += ">" + answer_object.question[i].value + " </pre>";
            } else {

                quesResultHTML += "<pre class='fill-blanks blanks' ";
                quesResultHTML += "style='text-decoration: underline'> " + answer_object.question[i].value + " </pre>";
            }
        }
    }

    // Add a button to allow the user to progress to next part of quiz
    quesResultHTML += "<button onclick='toggleMessageWindow();populate();'>Next</button>";

    // Display the result of this question
    toggleMessageWindow();
    var msg_container = document.getElementById("msg_insert");
    msg_container.innerHTML = quesResultHTML;
}

/* TO BE MODIFIED (?) ---
   Current: When it is a video, just add honey pots and skip to next question*/
function proceedVideo() {
    quiz.proceed();
    populate();
}

/* Update the footer text to show the progress of the quiz */
function showProgress() {
    var currentQuestionNumber = quiz.questionIndex + 1;
    var element = document.getElementById("footer_text");
    element.innerHTML = "Question " + currentQuestionNumber + " of " + quiz.questions.length;
}

/* When quiz has ended, display the tally of scores */
function showScores() {

    var gameOverHTML = "<h1>Result</h1>";
    gameOverHTML += "<h2 id='score'> You answered " + quiz.score + " out of " + quiz.numQues + " question(s) correctly!</h2>";
    gameOverHTML += "<h2 id='vid'> You watched " + quiz.numVid + " video(s)!</h2>";
    gameOverHTML +=
        "<div class='price_container'> You earned a total of " +
            "<span>" + quiz.totalHoney + "</span>" +
            "<img src='/assets/images/honey_pot.png' width='25px' height='25px'>" +
        "</div><br>";
    gameOverHTML += "<button id='close_msg_window' onclick='toggleMessageWindow();togglePageWindow();'>Close Message Window</button>";

    // Display the result of quiz
    toggleMessageWindow();
    var msg_container = document.getElementById("msg_insert");
    msg_container.innerHTML = gameOverHTML;

    // Empty the contents of quiz container
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";
    var footer_text = document.getElementById("footer_text");
    footer_text.innerHTML = "";
}

/* Shuffle items in the array */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

/*************************************************************************/
// Functions for displaying (creating HTML elements) of the Quiz Questions
/*************************************************************************/

/* Populate the page with HTML elements for displaying a Multiple-Choice question */
function _displayMult(ques_details) {
    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for MCQ Page
    var head_HTML = '<div id="quiz_header"><h1>Multiple Choice Quiz!</h1></div>';
    var quiz_container_HTML = '<div id="quiz_content">';
    var ques_container_HTML = '<div id="ques_content">';
    var ques_HTML = '<h3>' + ques_details.question + '</h3>';

    // Prepare the set of answer options and shuffling them (randomize order of options)
    var options = ques_details.choice.concat(ques_details.answer);
    shuffle(options);

    // HTML Strings containing answer options
    var ans_options_HTML = [];
    for (var i = 0; i < options.length; i++) {
        // Button elements for each answer option
        ans_options_HTML.push(
            '<button id="btn-' + i + '" onclick="guessAnswer(this)">' +
            options[i] + '</button>'
        );
    }
    var ans_container_HTML = '<div id="options_container">' + ans_options_HTML.join(" ") + '</div>';
    quiz_container_HTML += ques_container_HTML + ques_HTML + ans_container_HTML + '</div></div>';

    // Final display of quiz container
    quiz_container.innerHTML = head_HTML + quiz_container_HTML;
}


/* Populate the page with HTML elements for displaying a fill-in-the-blanks-type question */
function _displayBlanks(ques_details) {

    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for Fill in the Blanks Page
    var head_HTML = '<div id="quiz_header"><h1>Fill in the Blanks!</h1></div>';
    var quiz_container_HTML = '<div id="quiz_content">';
    var ques_container_HTML = '<div id="ques_content" class="ques_fitb">';
    var statement_HTML = '<div id="preview_statement">';
    var blanks_index = 0;
    var choice_options = [];
    // HTML Strings for Video Page
    var head_HTML = "<div id='quiz_header'><h1>Let's Watch!</h1></div>";
    var ques_HTML = "";
    // HTML Strings for the statement
    for (var i = 0; i < ques_details.question.length; i++) {

        if (ques_details.question[i].type === "fill") {
            statement_HTML += '<pre class="fill-blanks fill">' + ques_details.question[i].value + '</pre>';
        } else {
            statement_HTML += '<pre id="blanks-' + blanks_index + '" class="fill-blanks blanks"> ________________ </pre>';
            choice_options.push(ques_details.question[i].value);
            blanks_index++;
        }
    }
    statement_HTML += '</div>';

    // Shuffle option choices and HTML Strings for button options
    shuffle(choice_options);
    var choices_HTML = '<div id="fitb_container" class="fitb_container">';
    for(var j = 0; j< choice_options.length; j++){
        choices_HTML += '<button onclick="assignIndex(this)"><p class="value">' + choice_options[j] + '</p></button>';
    }
    choices_HTML += '</div>';

    var submit_HTML = '<button class="submit-btn" onclick="checkBlanks()">Submit</button>'

    // Clear the indices array for future blanks question use
    blanks_indices = [];

    ques_container_HTML += statement_HTML + choices_HTML + submit_HTML;
    quiz_container_HTML += ques_container_HTML + "</div></div";

    // Final display of quiz container
    quiz_container.innerHTML = head_HTML + quiz_container_HTML;
}


/* Populate the page with HTML elements for displaying a video */
function _displayVideo(video_details) {

    // Construct the full url of the Youtube video
    var full_url = "https://www.youtube.com/embed/" + video_details.embed;

    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for Video Page
    var head_HTML = "<div id='quiz_header'><h1>Let's Watch!</h1></div>";
    var quiz_container_HTML = '<div id="quiz_content">';
    var ques_container_HTML = '<div id="ques_content">';
    var ques_HTML = "";

    // Some videos may have a title
    if(video_details.question){
        ques_HTML = '<h3>' + video_details.question + '</h3>';
    }

    // HTML String for Iframe Element containing the video
    var iframe_HTML = '<iframe width="420" height="345" src=' + full_url + '></iframe>';

    // HTML String to proceed to next question
    var proceed_button_HTML = '<div id="options_container"><button onclick="proceedVideo()">Next</button></div>';

    // Complete the quiz container
    quiz_container_HTML += ques_container_HTML + ques_HTML + iframe_HTML + proceed_button_HTML + '</div></div>';

    // Final display of quiz container
    quiz_container.innerHTML = head_HTML + quiz_container_HTML;
}


/*************************************************************************/
// Helper Functions for Fill-in-the-blanks type question
/*************************************************************************/

/* Keep track of assigned order placement of answer choices */
var blanks_indices = [];

/* Get the next position to be assigned to an answer option */
function getNextIndex(){

    // Base case for arrays with 0 or 1 items
    if(blanks_indices.length === 0){
        blanks_indices.push(0);
        return 0;
    } else if (blanks_indices.length === 1) {
        if (blanks_indices[0] === 0) {
            blanks_indices.push(1);
            return 1;
        } else {
            blanks_indices.splice(0, 0, 0);
            return 0;
        }
    }

    // For arrays with 2 or more items
    for (var i = 0; i < blanks_indices.length - 1; i++) {
        if (i === blanks_indices[i]) {
            if (i + 1 === blanks_indices[i + 1]) {
                continue;
            } else {
                blanks_indices.splice(i + 1, 0, i + 1);
                return i + 1;
            }
        } else {
            blanks_indices.splice(i, 0, i);
            return i;
        }
    }
    blanks_indices.push(i + 1);
    return i + 1;
}

/* Remove the selected option from answer placement
Note: This function is used on onclick event for answer options (if already assigned) */
function removeIndex(button) {

    var remove_assigned = button.getElementsByClassName("assigned_order")[0];
    var remove_value = Number(remove_assigned.innerHTML) - 1;   // -1 to get index of the array
    console.log(remove_value);

    console.log("Removing: " + remove_value);
    console.log(blanks_indices);
    var index = blanks_indices.indexOf(remove_value);
    if (index > -1) {
        blanks_indices.splice(index, 1);
    }
    console.log("After removing");
    console.log(blanks_indices);

    var remove_container = button.getElementsByClassName("assigned_container")[0];
    remove_container.remove();
    console.log(blanks_indices);

    // Remove the value from preview statement
    var preview_text = document.getElementById("blanks-" + remove_value);
    preview_text.innerHTML = " ________________ ";

    // Allow the button to be re-assigned an index value
    button.setAttribute("onclick", "assignIndex(this)");
}

/* Assign the selected option with an answer order placement */
function assignIndex(button) {
    var cur_index = getNextIndex();
    var assign_num = cur_index + 1;
    button.innerHTML += '<p class="assigned_container">(<span class="assigned_order">' + assign_num + '</span>)</p>';
    button.setAttribute("onclick", "removeIndex(this)");
    var preview_text = document.getElementById("blanks-" + cur_index);
    preview_text.innerHTML = " " + button.getElementsByClassName("value")[0].innerHTML + " ";
}

/* Check if the question has been answered correctly */
function checkBlanks() {
    var choices_container = document.getElementById("fitb_container");
    var choice_buttons = choices_container.children;

    /* answers array will store an object consisting of :
       - index: the assigned position (of answer option) and
       - value: the answer option value */
    var answers = [];
    for (var i = 0; i < choice_buttons.length; i++) {
        // Get the value of this option
        var value = choice_buttons[i].getElementsByClassName("value")[0].innerHTML;

        // Get the position of answer assigned to this value
        var position_string = choice_buttons[i].getElementsByClassName("assigned_order")[0];

        // An answer option has not been assigned a position, show error message
        if (!position_string) {
            showError();
            return;
        }
        var assigned_position_index = Number(position_string.innerHTML) - 1;
        answers.push({
            index: assigned_position_index,
            value: value
        })
    }

    // Sort the answers array based on index key
    answers.sort(function (a,b){
        const indexA = a.index;
        const indexB = b.index;
        var comparison = 0;
        if (indexA > indexB) {
            comparison = 1;
        } else if (indexA < indexB) {
            comparison = -1;
        }
        return comparison;
    });

    /* Create new string array containing just the answer option values
       based on the assigned positions by user */
    var submit_answer = [];
    for(var x = 0; x < answers.length; x++){
        submit_answer.push(answers[x].value);
    }

    // Guess the answer made by user and then show results
    var ans_obj = quiz.guessAnswer(submit_answer);
    showAnswer(ans_obj);
}

/* Display an Error message if the not all blanks have been assigned */
function showError(){
    var errorHTML = "<h1>Error!</h1>";
    errorHTML += "Please ensure all blanks have been filled!";

    // Add a button to allow the user to progress to next part of quiz
    errorHTML += "<button onclick='toggleMessageWindow();'>Close</button>";

    // Display the error message
    toggleMessageWindow();
    var msg_container = document.getElementById("msg_insert");
    msg_container.innerHTML = errorHTML;
}


/*************************************************************************/
// QUIZ OBJECT
/*************************************************************************/

/* Quiz object constructor */
function Quiz(ques_list, numQues, numVid) {
    this.questions = ques_list; // Array of questions
    this.questionIndex = 0; // Current question
    this.numQues = numQues; // Number of MCQ/Fill in the Blanks questions
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


/*************************************************************************/
/* MULTIPLE CHOICE QUESTION OBJECT
/*************************************************************************/

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


/*************************************************************************/
// FILL-IN-THE-BLANKS QUESTION OBJECT
/*************************************************************************/

/* Fill-in-the-Blanks Question Object constructor */
function Blanks_Question(ques_obj){
    this.question = ques_obj.fill_blanks;
    this.answer = ques_obj.answers;
    this.id = ques_obj.id;
    this.points = Number(ques_obj.points);
    this.difficulty = Number(ques_obj.difficulty);  // For storing score (?)
}

Blanks_Question.prototype.getCorrectAnswer = function(answer_order){

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

/*************************************************************************/
// VIDEO OBJECT
/*************************************************************************/

/* Video Object Constructor */
function Video(ques_obj){
    this.question = ques_obj.question;
    this.embed = ques_obj.vid;
    this.points = Number(ques_obj.points);
    this.difficulty = Number(ques_obj.difficulty);  // For storing score (?)
}
