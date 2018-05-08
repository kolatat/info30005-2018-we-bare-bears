
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
            {type: "fill", value: "Rendering this "},
            {type: "blank", value: "first answer"},
            {type: "fill", value: "Insert stuff here"},
            {type: "blank", value: "second answer"},
            {type: "fill", value: "yay"},
            {type: "blank", value: "this comes after yay"}],
        answers: ["first answer", "second answer", "this comes after yay"]
    };

    return test_blank_param;

}



function _testBlanks(ques_details){

    // Get the container element that will contain the quiz
    var quiz_container = document.getElementById("quiz_container");
    quiz_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for Fill in the Blanks Page
    var head_HTML = '<h1>Fill in the Blanks!</h1>';
    var statement_HTML = '<div>';
    var choices_HTML = '<div class="fill_buttons">';

    for(var i = 0; i<ques_details.fill_blanks.length; i++){
        if(ques_details.fill_blanks[i].type === "fill"){
            statement_HTML += '<pre class="fill-blanks">' + ques_details.fill_blanks[i].value + '</pre>';
        } else {
            statement_HTML += '<pre class="fill-blanks"> ________________ </pre>';
            choices_HTML += '<button onclick="assignIndex(this)">' + ques_details.fill_blanks[i].value + '</button>';
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
    console.log("Current index: " +  cur_index);
}

function getNextIndex(){

    if(blanks_indices.length === 0){
        blanks_indices.push(0);
        return 0;
    } else if(blanks_indices.length === 1){
        if(blanks_indices[0] === 0){
            blanks_indices.push(1);
            return 1;
        } else {
            blanks_indices.splice(0, 0, 0);
            return 0;
        }
    }

    // For arrays with 2 or more items
    for(var i = 0; i<blanks_indices.length -1; i++){
        
        if(i === blanks_indices[i]){
            if(i+1 === blanks_indices[i+1]){
                continue;
            } else {
                blanks_indices.splice(i+1, 0, i+1);
                return i+1;
            }
        } else {

            blanks_indices.splice(i, 0, i);
            return i;
        }
    }

    blanks_indices.push(i+1);
    return i+1;

}

function removeIndex(button) {


    var remove_assigned = button.getElementsByClassName("assigned_order")[0];
    var remove_value = Number(remove_assigned.innerHTML) - 1;

    console.log("Removing: " + remove_value);
    var index = blanks_indices.indexOf(remove_value);
    if(index > -1){
        blanks_indices.splice(index, 1);
    }

    var remove_container = button.getElementsByClassName("assigned_container")[0];
    remove_container.remove();
    console.log(blanks_indices);

    button.setAttribute("onclick", "assignIndex(this)");
}

function assignIndex(button) {

    var cur_index = getNextIndex() +1;
    console.log("Assigning: " + cur_index);
    button.innerHTML += '<p class="assigned_container">(<span class="assigned_order">' + cur_index + '</span>)</p>';
    button.setAttribute("onclick", "removeIndex(this)");
}

function submitOrder() {
    
}

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