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
        //Edit part of the text in popup based on ID of function caller
//        document.getElementById("flag-id").innerHTML = oObject.id;
    } else {
        overlay.style.display = "none";
        popup.style.display = "none";
        document.getElementById("quiz_container").innerHTML = "";
    }
}


/* Toggle the PopUp Window that displays status about the quizzes */
function toggleMessageWindow(obj) {
    //Set a variable to contain the DOM element of the overlay
    var overlay = document.getElementById("overlay_message");
    //Set a variable to contain the DOM element of the popup
    var popup = document.getElementById("popup_message");


    var obj_class = obj.className;


    // Toggle visibility of overlay and popup
    if (overlay.style.display === "none" || overlay.style.display === "") {
        overlay.style.display = "block";
        popup.style.display = "block";

        // Insert message depending on the class of element (correct/wrong answer)
        //Edit part of the text in popup based on ID of function caller
        if (obj_class === "correct") {
            document.getElementById("msg_insert").innerHTML = "Correct Answer!"
        } else {
            document.getElementById("msg_insert").innerHTML = "Wrong Answer!"
        }
    } else {
        overlay.style.display = "none";
        popup.style.display = "none";
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

    // Create element containing a generic "MCQ Page" title
    var mcq_head = document.createElement('h1');
    mcq_head.innerHTML = "Multiple Choice Quiz!";
    quiz_container.appendChild(mcq_head);

    // Create element containing the MCQ question
    var question = document.createElement('p');
    question.innerHTML = ques_details.question;
    quiz_container.appendChild(question);

    // Create div element to contain all the MCQ answer choices
    var options_container = document.createElement('div');
    options_container.id = "options_container";
    quiz_container.appendChild(options_container);

    // Prepare the set of answer options and shuffling them (randomize order of options)
    var correct_ans = ques_details.answers.correct;
    var options = ques_details.answers.other.concat(correct_ans);
    shuffle(options);


    // Create the elements for all the answer options
    for(var i=0; i<options.length; i++) {

        var option_class;
        if (options[i] === correct_ans) {
            option_class = "correct";
        } else {
            option_class = "wrong";
        }

        // Create a button element for an answer option
        var new_button = document.createElement('button');
        new_button.className = option_class;
        new_button.setAttribute("onClick", "toggleMessageWindow(this);");
        new_button.innerHTML = options[i];
        options_container.appendChild(new_button);
    }

}

function _testVideo(video_details){

    // Construct the full url of the Youtube video
    var full_url = "https://www.youtube.com/embed/" + video_details.vid;

    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // Create element containing a generic "Video Page" title
    var vid_head = document.createElement('h1');
    vid_head.innerHTML = "Let's Watch!";
    quiz_container.appendChild(vid_head);

    // Create element containing the video question/title
    var question = document.createElement('p');
    question.innerHTML = video_details.question;
    quiz_container.appendChild(question);

    // Create element containing the video
    var vid_iframe = document.createElement('iframe');
    vid_iframe.setAttribute("width", "420");
    vid_iframe.setAttribute("height", "345");
    vid_iframe.setAttribute("src", full_url);
    quiz_container.appendChild(vid_iframe);


}


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