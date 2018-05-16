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


/* Populate the page with HTML elements for displaying a Multiple-Choice question */
function _displayMult(ques_details) {
    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for MCQ Page
    var head_HTML = '<h1>Multiple Choice Quiz!</h1>';
    var ques_HTML = '<p>' + ques_details.question + '</p>';

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

    // Final display of quiz container
    quiz_container.innerHTML = head_HTML + ques_HTML + ans_container_HTML;
}


/* Populate the page with HTML elements for displaying a fill-in-the-blanks-type question */
function _displayBlanks(ques_details) {

    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for Fill in the Blanks Page
    var head_HTML = '<h1>Fill in the Blanks!</h1>';
    var statement_HTML = '<div>';
    var blanks_index = 0;
    var choice_options = [];

    // HTML Strings for the statement
    for (var i = 0; i < ques_details.question.length; i++) {

        if (ques_details.question[i].type === "fill") {
            statement_HTML += '<pre class="fill-blanks">' + ques_details.question[i].value + '</pre>';
        } else {
            statement_HTML += '<pre id="blanks-' + blanks_index + '" class="fill-blanks"> ________________ </pre>';
            choice_options.push(ques_details.question[i].value);
            blanks_index++;
        }
    }
    statement_HTML += '</div>';

    // Shuffle option choices and HTML Strings for button options
    shuffle(choice_options);
    var choices_HTML = '<div id="fill_buttons">';
    for(var j = 0; j< choice_options.length; j++){
        choices_HTML += '<button onclick="assignIndex(this)"><p class="value">' + choice_options[j] + '</p></button>';
    }
    choices_HTML += '</div>';

    var submit_HTML = '<button onclick="checkBlanks()">Submit</button>'

    // Clear the indices array for future blanks question use
    blanks_indices = [];

    // Final display of quiz container
    quiz_container.innerHTML = head_HTML + statement_HTML + choices_HTML + submit_HTML;
}


/* Populate the page with HTML elements for displaying a video */
function _displayVideo(video_details) {

    // Construct the full url of the Youtube video
    var full_url = "https://www.youtube.com/embed/" + video_details.embed;

    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for Video Page
    var head_HTML = "<h1>Let's Watch!</h1>";
    var ques_HTML = '<p>' + video_details.question + '</p>';

    // HTML String for Iframe Element containing the video
    var iframe_HTML = '<iframe width="420" height="345" src=' + full_url + '></iframe>';

    var proceed_button_HTML = '<div><button onclick="proceedVideo()">Next</button></div>';

    // Final display of quiz container
    quiz_container.innerHTML = head_HTML + ques_HTML + iframe_HTML + proceed_button_HTML;
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
            quesResultHTML += "<pre class='fill-blanks' ";
            if (answer_object.question[i].type === "fill") {
                quesResultHTML += ">" + answer_object.question[i].value + " </pre>";
            } else {
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


// Global quiz variable
var quiz;


// Get input from user on number of questions to populate the quiz
function _generateQuizQuestions() {

    // Allow users to choose only between 1-5 questions
    var num_questions = parseInt(prompt("How many questions would you like to answer? (1 - 5)"));
    if (num_questions > 0 && num_questions <= 5) {
        alert("Starting quiz with " + num_questions + " questions!");
        _startQuiz(num_questions);
    } else {
        var quiz_container = document.getElementById("quiz_container");
        quiz_container.innerHTML = "Sorry! Please enter a valid integer between 1 and 5";
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






