/* Toggle the PopUp Window that displays the interface for creating quizzes */
function toggleCreateWindow(){
    //Set a variable to contain the DOM element of the overlay
    var overlay = document.getElementById("overlay_base");
    //Set a variable to contain the DOM element of the popup
    var popup = document.getElementById("popup_base");
    // Toggle visibility of overlay and popup
    if(overlay.style.display === "none" || overlay.style.display === ""){
        overlay.style.display = "block";
        popup.style.display = "block";
        //Edit part of the text in popup based on ID of function caller
//        document.getElementById("flag-id").innerHTML = oObject.id;
    } else {
        overlay.style.display = "none";
        popup.style.display = "none";
        document.getElementById("create_container").innerHTML = "";
    }
}







$(document).ready(function() {



    var $create_container = $('#create_container');


    $('#create_video').click(function() {
        toggleCreateWindow();
        $.get('create_video', test_vid_param)
            .done(function(data){
                $create_container.html(data);
            });

    });
});


function _createMult(){
    toggleCreateWindow();

    // Get the container element that will contain the quiz
    var create_container = document.getElementById("create_container");
    create_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for MCQ Page
    var head_HTML = '<h1>Create your multiple choice question!</h1>';

    // HTML String for form element to input question details
    var form_HTML = [];
    form_HTML.push('<form id="createQuestion" method="post" onsubmit="submitQuestion()">');
    form_HTML.push('<p class="container_text">Enter your question: </p>');
    form_HTML.push('<input type="text" name="question" required>');
    form_HTML.push('<p class="container_text">Enter the correct answer: </p>');
    form_HTML.push('<input type="text" name="correct_ans" required>');
    form_HTML.push('<p class="container_text">Enter other answer options: </p>');

    // HTML String for alternate answer options
    var input_container_HTML = [];
    input_container_HTML.push('<div id="input_fields_mult" class="input_fields_wrap">');
    input_container_HTML.push('<button id="add_field_button" onclick="addField(this.parentNode);">Add More Fields</button>');
    input_container_HTML.push('<div id="0"><input type="text" name="options-0" required></div>');
    input_container_HTML.push('</div>');

    // Complete the form element HTML string
    form_HTML.push(input_container_HTML.join(" "));
    form_HTML.push('</form>');

    // Final display of create container
    create_container.innerHTML = head_HTML + form_HTML.join(" ");
}



function _createBlanks(){
    toggleCreateWindow();

    // Get the container element that will contain the quiz
    var create_container = document.getElementById("create_container");
    create_container.innerHTML = "";  // Reset the container element for each use

    // HTML String for Blanks Page
    var head_HTML = '<h1>Create your blanks statement!</h1>';

    // HTML Strings for "Preview Statement" section
    var preview_HTML = [];
    preview_HTML.push('<p>Preview statement...</p>');
    preview_HTML.push('<div id="preview_container">');
    preview_HTML.push('<pre id="0-preview" class="preview"></pre>');
    preview_HTML.push('</div>');

    // HTML String for form element to input details
    var form_HTML = [];
    form_HTML.push('<form id="createQuestion" method="post" onsubmit="submitQuestion()">');

    // HTML String for elements to input details about the Fill/Blank statement
    var input_container_HTML = [];
    input_container_HTML.push('<div id="input_fields_blanks" class="input_fields_wrap">');
    input_container_HTML.push('<button id="add_field_button" onclick="addField(this.parentNode)">Add More Fields</button>');
    input_container_HTML.push('<div id="0">');
    input_container_HTML.push('<select name="fill_blank_type" onchange="modifyTextDecoration(this)">');
    input_container_HTML.push('<option value="fill">Fill</option>');
    input_container_HTML.push('<option value="blank">Blank</option>');
    input_container_HTML.push('</select>');
    input_container_HTML.push('<input type="text" name="options" onkeyup="previewText(this)" required>');
    input_container_HTML.push('</div>');
    input_container_HTML.push('</div>');

    // TO INCLUDE SUBMIT BUTTON
    // Complete the form element HTML string
    form_HTML.push(input_container_HTML.join(" "));
    form_HTML.push('</form>');

    // Final display of create container
    create_container.innerHTML = head_HTML + preview_HTML.join(" ") + form_HTML.join(" ");


}