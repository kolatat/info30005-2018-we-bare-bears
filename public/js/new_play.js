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
function checkAnswer(obj) {

    toggleMessageWindow();

    var correct_ans_string = "Correct Answer!";
    var wrong_ans_string = "Wrong Answer!";
    var msg_container = document.getElementById("msg_insert");

    if (obj.className === "correct") {
        msg_container.innerHTML = correct_ans_string;
    } else if (obj.className === "wrong") {
        msg_container.innerHTML = wrong_ans_string;
    }

    // Button to close this popup
    var button_HTML = '<br><button onclick="toggleMessageWindow()">Close</button>';
    msg_container.innerHTML += button_HTML;

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

function getRandomBlanks() {
    var test_blank_param = {
        fill_blanks: [
            {type: "fill", value: "Rendering this"},
            {type: "blank", value: "first answer"},
            {type: "fill", value: "Insert stuff here"},
            {type: "blank", value: "second answer"},
            {type: "fill", value: "yay"},
            {type: "blank", value: "this comes after yay"}],
        answers: ["first answer", "second answer", "this comes after yay"]
    };

    return test_blank_param;

}


function _testBlanks(ques_details) {

    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for Fill in the Blanks Page
    var head_HTML = '<h1>Fill in the Blanks!</h1>';
    var statement_HTML = '<div>';
    var choices_HTML = '<div class="fill_buttons">';
    var blanks_index = 0;

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

    // Final display of quiz container
    quiz_container.innerHTML = head_HTML + statement_HTML + choices_HTML;
}

var blanks_indices = [];

function testIndex() {
    var cur_index = getNextIndex();
    console.log(blanks_indices);
    console.log("Current index: " + cur_index);
}

function getNextIndex() {

    if (blanks_indices.length === 0) {
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

function removeIndex(button) {


    var remove_assigned = button.getElementsByClassName("assigned_order")[0];
    var remove_value = Number(remove_assigned.innerHTML) - 1;
    console.log(remove_value);

    console.log("Removing: " + remove_value);
    var index = blanks_indices.indexOf(remove_value);
    if (index > -1) {
        blanks_indices.splice(index, 1);
    }

    var remove_container = button.getElementsByClassName("assigned_container")[0];
    remove_container.remove();
    console.log(blanks_indices);


    var preview_text = document.getElementById("blanks-" + remove_value);
    preview_text.innerHTML = " ________________ ";

    button.setAttribute("onclick", "assignIndex(this)");
}

function _testCanvas() {

    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    quiz_container.innerHTML += '<canvas id="myCanvas" style="width:50%;height:50%;border:1px solid black;background:#fff;"></canvas>';

    quiz_container.innerHTML +=
        '<div>' +
        '<button>' +
        '<img src="/assets/images/items/penguin.png" alt="/assets/images/items/penguin.png" class="shop_item" style="width:100px;height:100px;">' +
        '</button>';


    console.log("HI!");
}

function add_image(image_button) {
    var image_link = image_button.getElementsByClassName("shop_item")[0].alt;
    console.log(image_link);
    var canvas = document.getElementById("myCanvas");

    var ctx = c.getContext("2d");
    var img = document.getElementById("scream");
    ctx.drawImage(img, 10, 10);

}


function make_pic(ctx) {
    ctx.clearRect(0, 0, 400, 550);

    // Mask for clipping
    var mask_image = new Image();
    mask_image.src = 'http://i.imgur.com/yOc0YHC.png';
    ctx.drawImage(mask_image, 0, 0);
    ctx.save();

    var pic_image = new Image();
    pic_image.src = 'http://i.imgur.com/DVhVSH1.jpg';
    xfact = prep_image();

//    var im_width = parseInt(pic_image.width + $('#resize').slider('value') / xfact);
    //  var im_height = parseInt(pic_image.height + $('#resize').slider('value') / xfact);
    // alert(im_width);
    ctx.translate(200, 275);
    ctx.rotate($('#rotat').slider('value') * Math.PI / 180);
    ctx.globalCompositeOperation = "source-in";
    //   ctx.drawImage(pic_image, -400 / 2 + moveXAmount, -550 / 2 + moveYAmount, im_width, im_height);
    ctx.restore();
}


function assignIndex(button) {

    var cur_index = getNextIndex();
    var assign_num = cur_index + 1;
    console.log("Assigning: " + assign_num);
    button.innerHTML += '<p class="assigned_container">(<span class="assigned_order">' + assign_num + '</span>)</p>';
    button.setAttribute("onclick", "removeIndex(this)");

    var preview_text = document.getElementById("blanks-" + cur_index);
    preview_text.innerHTML = " " + button.getElementsByClassName("value")[0].innerHTML + " ";
}

function checkBlanks() {
    var choices_container = document.getElementById("fill_buttons");
    var choice_buttons = choices_container.children;
    var answers = [];

    for (var i = 0; i < choice_buttons.length; i++) {

        // Get the value of this option
        var value = choice_buttons.getElementsByClassName("value")[0].innerHTML;

        // Get the position of answer assigned to this value
        var position_string = choice_buttons[i].getElementsByClassName("assigned_order")[0].innerHTML;

        if (position_string === "") {
            showError();
            return;
        }

        var assigned_position = Number(position_string) - 1;
        answers.splice(assigned_position, 0, value);
    }

    var ans_obj = quiz.guessAnswer(answers);
    showAnswer(ans_obj);
}

function showError() {
    var errorHTML = "<h1>Error!</h1>";
    errorHTML += "Please ensure all blanks have been filled!";

    // Add a button to allow the user to progress to next part of quiz
    errorHTML += "<button onclick='toggleMessageWindow();'>Close</button>";

    // Display the error message
    toggleMessageWindow();
    var msg_container = document.getElementById("msg_insert");
    msg_container.innerHTML = errorHTML;
}

function _testAPI() {
    Recyclabears.questions.getRandomQuestion().then(function (data) {
        if (data.type == "multiple-choice") {
            // display multichoice page
            _testMult(data);
        } else if (data.type == "youtube-video") {
            // display  youtube video
            _testVideo(data);
        }
    });
}

function _testMult(ques_details) {
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
    for (var i = 0; i < options.length; i++) {

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


function _testVideo(video_details) {

    // Construct the full url of the Youtube video
    var full_url = "https://www.youtube.com/embed/" + video_details.vid;

    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for Video Page
    var head_HTML = "<h1>Let's Watch!</h1>";
    var ques_HTML = '<p>' + video_details.question + '</p>';

    // HTML String for Iframe Element containing the video
    var iframe_HTML = '<iframe width="420" height="345" src=' + full_url + '></iframe>';

    // Final display of quiz container
    quiz_container.innerHTML = head_HTML + ques_HTML + iframe_HTML;
}

function _testBlanks(ques_details) {

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