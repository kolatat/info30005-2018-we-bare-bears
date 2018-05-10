
/* Display interface for creating a Multiple Choice question */
function _createMult(){
    // Hide the Create Page Menu
    document.getElementById("create_page_content").setAttribute("display", "none");

    // Get the container element that will contain the quiz
    var create_container = document.getElementById("create_container");
    create_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for MCQ Page
    var head_HTML = '<h1>Create your multiple choice question!</h1>';

    // HTML String for form element to input question details
    var form_HTML = [];
    form_HTML.push('<form id="createQuestion" class="multiple-choice" onsubmit="submitQuestion(event)">');
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
    form_HTML.push(input_container_HTML.join(" "));

    //HTML String for input of some extra information
    form_HTML.push('<p class="container-text">Difficulty Level: </p>');
    form_HTML.push('<input type="number" name="difficulty" required>');
    form_HTML.push('<p class="container-text">Score points: </p>');
    form_HTML.push('<input type="number" name="points" required>');
    //form_HTML.push('<p class="container-text">Created By: </p>');
    //form_HTML.push('<input type="text" name="createdBy" required>');


    // Complete the form element HTML string
    form_HTML.push('<button type="submit">Submit!</button>');
    form_HTML.push('</form>');

    // Final display of create container
    create_container.innerHTML = head_HTML + form_HTML.join(" ");
}


/* Display interface for creating a Fill-in-the-Blanks type question */
function _createBlanks(){

    // Hide the Create Page Menu
    document.getElementById("create_page_content").setAttribute("display", "none");

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
    form_HTML.push('<form id="createQuestion" class="fill-in-the-blanks" onsubmit="submitQuestion(event)">');

    // HTML String for elements to input details about the Fill/Blank statement
    var input_container_HTML = [];
    input_container_HTML.push('<div id="input_fields_blanks" class="input_fields_wrap">');
    input_container_HTML.push('<button id="add_field_button" onclick="addField(this.parentNode)">Add More Fields</button>');
    input_container_HTML.push('<div id="0">');
    input_container_HTML.push('<select name="type-0" onchange="modifyTextDecoration(this)">');
    input_container_HTML.push('<option value="fill">Fill</option>');
    input_container_HTML.push('<option value="blank">Blank</option>');
    input_container_HTML.push('</select>');
    input_container_HTML.push('<input type="text" name="options-0" onkeyup="previewText(this)" required>');
    input_container_HTML.push('</div>');
    input_container_HTML.push('</div>');
    form_HTML.push(input_container_HTML.join(" "));

    //HTML String for input of some extra information
    form_HTML.push('<p class="container-text">Difficulty Level: </p>');
    form_HTML.push('<input type="number" name="difficulty" required>');
    form_HTML.push('<p class="container-text">Score points: </p>');
    form_HTML.push('<input type="number" name="points" required>');
    form_HTML.push('<p class="container-text">Created By: </p>');
    form_HTML.push('<input type="text" name="createdBy" required><br>');

    // Complete the form element HTML string
    form_HTML.push('<button type="submit">Submit!</button>');
    form_HTML.push('</form>');

    // Final display of create container
    create_container.innerHTML = head_HTML + preview_HTML.join(" ") + form_HTML.join(" ");


}