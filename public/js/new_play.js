
/* Toggle the PopUp Window that displays the quizzes */
function toggleQuizWindow() {
    //Set a variable to contain the DOM element of the overlay
    var overlay = document.getElementById("overlay_base");
    //Set a variable to contain the DOM element of the popup
    var popup = document.getElementById("popup_base");
    // Toggle visibility of overlay and popup
    if (overlay.style.display === "none" || overlay.style.display === "") {
        overlay.style.display = "block";
        popup.style.display = "block";
    } else {
        overlay.style.display = "none";
        popup.style.display = "none";
        document.getElementById("quiz_container").innerHTML = "";
    }
}


/* Toggle the PopUp Window that displays status about the quizzes */
function toggleMessageWindow() {
    //Set a variable to contain the DOM element of the overlay
    var overlay = document.getElementById("overlay_message");
    //Set a variable to contain the DOM element of the popup
    var popup = document.getElementById("popup_message");

    // Toggle visibility of overlay and popup
    if (overlay.style.display === "none" || overlay.style.display === "") {
        overlay.style.display = "block";
        popup.style.display = "block";

    } else {
        overlay.style.display = "none";
        popup.style.display = "none";
        document.getElementById("msg_insert").innerHTML = "";
    }
}

/* Check whether selected option is the correct answer */
function checkAnswer(obj){

    toggleMessageWindow();

    var correct_ans_string = "Correct Answer!";
    var wrong_ans_string = "Wrong Answer!";
    var msg_container = document.getElementById("msg_insert");

    if(obj.className === "correct"){
        msg_container.innerHTML = correct_ans_string;
    } else if(obj.className === "wrong"){
        msg_container.innerHTML = wrong_ans_string;
    }
}

//
function getRandomQuestion() {
    var ques = {

        question: "Dummy question #1",
        ques_img: "",   // to store question image
        answers: {
            correct: "pick mee!",
            other: ["hi", "ko", "laaa", "help"]
        },
        options_img: ""     // to store images for each option
    };

    return ques;
}

//
function getRandomVideoLink() {
    var video = {
        question: "Recycling is fun",
        vid: "_LXlxSZI_K8"
        // To add: Link to related questions. maybe?
    };

    return video;
}


// Testing
$(document).ready(function () {

    var $quiz_container = $('#quiz_container');
    var test_blank_param = {
        fill_array_objects: [{type: "fill", value: "Rendering this "}, {
            type: "blank",
            value: "first answer"
        }, {type: "fill", value: "Insert stuff here"}, {type: "blank", value: "second answer"}, {
            type: "fill",
            value: "yay"
        }, {type: "blank", value: "this comes after yay"}]
    };


    $('#blanks').click(function () {
        $.get('play_blanks', test_blank_param)
            .done(function (data) {
                $quiz_container.html(data);
            });
    });


});


function _testAPI() {
    $.get('/api/questions/random', function (data, status, xhr) {
        console.log(data);
        if (data.type == "multiple-choice") {
            // display multichoice page
            _testMult(data);
        } else if (data.type == "youtube-video") {
            // display  youtube video
            _testVideo(data);
        }
    }, 'json');
}

function _testMult(ques_details){
    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for MCQ Page
    var head_HTML = '<h1>Multiple Choice Quiz!</h1>';
    var ques_HTML = '<p>' + ques_details.question + '</p>';

    // Prepare the set of answer options and shuffling them (randomize order of options)
    var correct_ans = ques_details.answers.correct;
    var options = ques_details.answers.other.concat(correct_ans);
    shuffle(options);

    // HTML Strings containing answer options
    var ans_options_HTML = [];
    for(var i=0; i<options.length; i++) {

        // For identifying the correct answer (maybe to be changed to a better way in future?)
        var option_class;
        if (options[i] === correct_ans) {
            option_class = "correct";
        } else {
            option_class = "wrong";
        }

        // Button elements for each answer option
        ans_options_HTML.push(
          '<button class="' + option_class + '" onclick="checkAnswer(this)">' +
            options[i] + '</button>'
        );
    }
    var ans_container_HTML = '<div id="options_container">' + ans_options_HTML.join(" ") + '</div>';

    // Final display of quiz container
    quiz_container.innerHTML = head_HTML + ques_HTML + ans_container_HTML;
}


function _testVideo(video_details){

    // Construct the full url of the Youtube video
    var full_url = "https://www.youtube.com/embed/" + video_details.vid;

    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for Video Page
    var head_HTML = "<h1>Let's Watch!</h1>";
    var ques_HTML = '<p>' + video_details.question + '</p>';

    // HTML String for Iframe Element containing the video
    var iframe_HTML = '<iframe width="420" height="345" src=' + full_url +'></iframe>';

    // Final display of quiz container
    quiz_container.innerHTML = head_HTML + ques_HTML + iframe_HTML;
}

function _testBlanks(ques_details){

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