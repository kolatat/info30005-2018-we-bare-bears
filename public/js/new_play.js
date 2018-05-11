/* Toggle the PopUp Window that displays the quizzes */
function togglePageWindow() {
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
        document.getElementById("create_container").innerHTML = "";
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
       // document.getElementById("msg_insert").innerHTML = "";
    }
}


/* Show either the Play page or Create page in the PopUp Window */
function showPage(page_to_show) {
    togglePageWindow();
    document.getElementById(page_to_show).style.display = "block";

    if(page_to_show === "play_page"){
        document.getElementById("create_page").style.display = "none";
     //   document.getElementById("quiz_container").innerHTML = "";
    } else {
        document.getElementById("play_page").style.display = "none";
     //   document.getElementById("create_container").innerHTML = "";

    }
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



function _testBlanks(ques_details){

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

/* For Fill-in-the-blanks type questions: Remember the indices for order placement of answer choices */
var blanks_indices = [];


/* For Fill-in-the-blanks type questions: Get the next position to be assigned to an answer option */
function getNextIndex(){

    console.log("In getNextIndex() function");
    console.log(blanks_indices);
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

/* For Fill-in-the-blanks type questions: Remove the selected option from answer placement */
function removeIndex(button) {

    var remove_assigned = button.getElementsByClassName("assigned_order")[0];
    var remove_value = Number(remove_assigned.innerHTML) - 1;
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



/* For Fill-in-the-blanks type questions: Assign the selected option with an answer placement */
function assignIndex(button) {

    var cur_index = getNextIndex();
    console.log("After getNexIndex() function");
    console.log(blanks_indices);
    var assign_num = cur_index + 1;
    console.log("Assigning: " + assign_num);
    button.innerHTML += '<p class="assigned_container">(<span class="assigned_order">' + assign_num + '</span>)</p>';
    button.setAttribute("onclick", "removeIndex(this)");

    var preview_text = document.getElementById("blanks-" + cur_index);
    preview_text.innerHTML = " " + button.getElementsByClassName("value")[0].innerHTML + " ";
}


/* For Fill-in-the-blanks type questions: Check if the question has been answered correctly */
function checkBlanks() {
    var choices_container = document.getElementById("fill_buttons");
    var choice_buttons = choices_container.children;
    var answers = [];

    for (var i = 0; i < choice_buttons.length; i++) {

        // Get the value of this option
        var value = choice_buttons[i].getElementsByClassName("value")[0].innerHTML;

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


/* For Fill-in-the-blanks type questions:
Display an Error message if the not all blanks have been assigned */
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


// Allow users to start on Play Page once FB initialisation has been completed
function enablePlayPage(){

    var page_buttons = document.getElementsByClassName("page_buttons");

    for(var i=0; i<page_buttons.length; i++){
        page_buttons[i].disabled = false;
    }

}