/* Populate the page with a question Object */
function populate() {

    console.log("Quiz length: " + quiz.getQuizLength());
    // If no more questions are remaining, display the score
    if (quiz.isEnded()) {
        showScores();
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
};


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
    var choices_HTML = '<div id="fill_buttons">';
    var blanks_index = 0;

    // HTML Strings for the statement and button options
    for (var i = 0; i < ques_details.fill_blanks.length; i++) {
        if (ques_details.fill_blanks[i].type === "fill") {
            statement_HTML += '<pre class="fill-blanks">' + ques_details.fill_blanks[i].value + '</pre>';
        } else {
            statement_HTML += '<pre id="blanks-' + blanks_index + '" class="fill-blanks"> ________________ </pre>';
            choices_HTML += '<button onclick="assignIndex(this)"><p class="value">' + ques_details.fill_blanks[i].value + '</p></button>';

            blanks_index++;
        }
    }
    statement_HTML += '</div>';
    choices_HTML += '</div>';

    var submit_HTML = '<button onclick="checkBlanks()">Submit</button>'

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
function guess(button) {
    var button = document.getElementById(button.id);
    var guess = button.innerHTML;
    quiz.guess(guess);
    populate();
};

/* Function to be attached to the answer buttons for guessing that option */
function guessAnswer(button) {

    var button = document.getElementById(button.id);
    var guess = button.innerHTML;
    var ans_obj = quiz.guessAnswer(guess);

    showAnswer(ans_obj);
}

/* Show the user the correct answer */
function showAnswer(answer_object) {


    var quesResultHTML = "";

    if (answer_object.correct == true) {
        quesResultHTML += "<h1>Correct Answer!</h1>";
    } else {
        quesResultHTML += "<h1>Wrong Answer!</h1>";
    }

    if (answer_object.type === "mult") {
        quesResultHTML += "<p>Question: <em>" + answer_object.question + "</em></p>";
        quesResultHTML += "<p>Correct answer:  <em>" + answer_object.answer + "</em></p>";
    } else if (answer_object.type === "blanks") {
        quesResultHTML += "<p>Statement:</p>";

        for (var i = 0; i < answer_object.question.length; i++) {
            quesResultHTML += "<pre class='fill-blanks' ";
            if (answer_object.question[i].type === "fill") {
                quesResultHTML += ">" + answer_object.question[i].value + "</pre>";
            } else {
                quesResultHTML += "style='text-decoration: underline'> " + answer_object.question[i].value + "</pre>";
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

/* Function to be attached to button on Video page, just skips to next question --- TO BE MODIFIED */
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
    gameOverHTML += "<h2 id='score'> You answered " + quiz.score + " out of " + quiz.mcq + " question(s) correctly!</h2>";
    gameOverHTML += "<h2 id='vid'> You watched " + quiz.videos + " video(s)!</h2>";
    gameOverHTML += "<button id='close_msg_window' onclick='toggleMessageWindow()'>Close Message Window</button>";


    // Display the result of quiz
    toggleMessageWindow();
    var msg_container = document.getElementById("msg_insert");
    msg_container.innerHTML = gameOverHTML;

    // Empty the contents of quiz container
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";
    var footer_text = document.getElementById("footer_text");
    footer_text.innerHTML = "";
};


// Global quiz variable
var quiz;

// For testing purpose --- Get input from user on number of questions to populate the quiz
function _generateQuizQuestions() {
    var num_questions = parseInt(prompt("How many questions would you like to answer?"));
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
    var question_list = [];
    var mcq = 0;
    var video = 0;


    var promises = []
    for (var i = 0; i < num_ques; i++) {
        promises.push(Recyclabears.questions.getRandomQuestion().then(function (data) {
            if (data.type == "multiple-choice") {
                var new_ques = new Mult_Question(data);
                question_list.push(new_ques);
                mcq++;
            } else if(data.type === "fill-in-the-blanks"){
                //var new_blanks = new Blanks_Question(data);
                //question_list.push(new_blanks);
                //mcq++;
            } else if (data.type == "youtube-video") {
                var new_vid = new Video(data);
                question_list.push(new_vid);
                video++;
            }
            return 'done';
        }));
    }

    Promise.all(promises).then(function () {
        quiz = new Quiz(question_list, mcq, video);

        //display the quiz
        populate();
    })
}






