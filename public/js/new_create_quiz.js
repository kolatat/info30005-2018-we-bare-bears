
/************************************************************************************/
/* Functions for manipulating the form input fields                                 */
/************************************************************************************/

/* Let users add more input fields */
function addField(input_field_wrapper) {

    var max_input = 10;
    var add_button = document.getElementById("add_field_button");

    // Ensure that new input field will have unique ID and also will always have bigger value than previous input fields' IDs
    var last_elem_id = input_field_wrapper.lastElementChild.id;
    var current_id = +last_elem_id + 1;  // +last_elem_id casts the string to a number

    // Create element for use with appendChild method to prevent losing information already inputted on form
    var input_field_html = document.createElement('div');
    input_field_html.id = current_id;


    // Adding buttons for MCQ page
    if (input_field_wrapper.id === "input_fields_mult") {
        input_field_html.innerHTML = '<input type="text" name="options-' + current_id + '" ' +
            'required/><button class="remove_field" onclick="removeField(this, this.parentNode)">x</button>';
    }

    // Adding buttons for filling in the blanks page
    else if (input_field_wrapper.id === "input_fields_blanks") {
        input_field_html.innerHTML =
            '<select name="type-' + current_id + '" onchange="modifyTextDecoration(this)">' +
            '<option value="fill">Fill</option>' +
            '<option value="blank">Blank</option>' +
            '</select>' +
            '<input type="text" name="options-' + current_id + '" onkeyup="previewText(this)" required>' +
            '<button class="remove_field" onclick="removeField(this, this.parentNode)">x</button>';


        // Create new span element and add to the preview_container
        var preview_container = document.getElementById('preview_container');
        var new_preview_HTML = '<pre class="preview" id="' + current_id + '-preview"></pre>';
        preview_container.innerHTML += new_preview_HTML;

    }

    // TODO modify max input for MCQ to 3~4  (for "kids")
    // If there are less than the max amount of inputs allowed, then add the input field
    if (input_field_wrapper.childElementCount <= max_input) {
        input_field_wrapper.appendChild(input_field_html);
    }
    // otherwise disable the add input field button
    else {
//        add_button.disabled = true;
        // Let users know that no more input fields can be added
        alert("Max number of answer options is: " + max_input);
    }
}


/* Let users remove an input field */
function removeField(element, input_field_wrapper) {

    // Only for Create Blanks page
    if (input_field_wrapper.parentNode.id === "input_fields_blanks") {
        // Remove the target preview span
        var id_to_remove = element.parentNode.id;
        var span_id_to_remove = id_to_remove + "-preview";
        document.getElementById(span_id_to_remove).remove();
    }

    // Remove the target input field
    element.parentNode.remove();

    // If there are less input fields than the max amount now, enable the add field button
    var max_input = 10;
    var add_button = document.getElementById("add_field_button");
    if (input_field_wrapper.childElementCount <= max_input) {
        add_button.disabled = false;
    }
}

/* Displaying the current input fill/blanks in one whole sentence --- for Create Blanks page */
function previewText(input_field) {
    var input_id = input_field.parentNode.id;   // Get the id of parent div of input field
    var span_id = input_id + "-preview";    // Id of target span element
    var span_elem = document.getElementById(span_id);
    span_elem.innerHTML = " " + input_field.value + " ";    // Modify the content of the target span element
}

/* Modify the preview of input (underline/no underline --- for Create Blanks page */
function modifyTextDecoration(select_field) {
    var select_id = select_field.parentNode.id;  // Get the id of parent div of select field
    var span_id = select_id + "-preview";    // Id of target span element
    var span_elem = document.getElementById(span_id);
    if (select_field.value === "blank") {
        span_elem.style.textDecoration = "underline";
    } else {
        span_elem.style.textDecoration = "none";
    }
}

/************************************************************************************/
/* Functions for error-checking and submitting question to database                 */
/************************************************************************************/

function submitQuestion(event) {
    // Prevent the page from refreshing
    event.preventDefault();

    // Error validation
    var errorCount = 0;
    $('#createQuestion input').each(function (index, val) {
        var msg_container = document.getElementById("msg_insert");

        // Display error message for any empty inputs
        if ($(this).val() === '') {
            errorCount++;
            toggleMessageWindow();
            msg_container.innerHTML = "Error! Please ensure all information has been entered!";
            return false;
        }

        // Display error message for unsuitable number inputs
        if ($(this).attr("type") === "number") {
            var num = Number($(this).val());

            if (Math.floor(num) != num || num < 1 || num > 10) {
                errorCount++;
                toggleMessageWindow();
                msg_container.innerHTML = "<p>(" + $(this).attr("name") + "): Please enter a valid integer between 1 and 10!</p>";
                msg_container.innerHTML += "<button onclick='toggleMessageWindow()'>Close</button>";
                return false;
            }
        }
    });

    // If there are no errors, process the data
    if (errorCount === 0) {
        var form = document.getElementById('createQuestion');

        var new_question;

        var input_fields_wrap = document.getElementsByClassName("input_fields_wrap")[0];
        if (input_fields_wrap.id === "input_fields_mult") {

            var answer_options = [];

            // Starting index from 1 to ignore the "Add fields" button
            for (var i = 1; i < input_fields_wrap.children.length; i++) {
                var option_div = input_fields_wrap.children[i];
                var option_value = form["options-" + option_div.id].value;
                answer_options.push(option_value);
            }

            // Create the question object
            new_question = {
                question: form["question"].value,
                type: form.className,
                answers: {
                    correct: form["correct_ans"].value,
                    other: answer_options
                },
                difficulty: Number(form["difficulty"].value),
                points: Number(form["points"].value)
            };

            // Preview the question to user before POST-ing to database
            toggleMessageWindow();
            var msg_container = document.getElementById("msg_insert");
            msg_container.innerHTML = previewMultQues(new_question);

        } else if (input_fields_wrap.id === "input_fields_blanks") {

            var fill_blanks = [];
            var answers = [];

            for (var i = 1; i < input_fields_wrap.children.length; i++) {
                var value_div = input_fields_wrap.children[i];
                var value_type = form["type-" + value_div.id].value;
                var value = form["options-" + value_div.id].value;

                var fill_blank_obj = {
                    type: value_type,
                    value: value
                };

                fill_blanks.push(fill_blank_obj);
                if (value_type === "blank") {
                    answers.push(value);
                }
            }

            new_question = {
                fill_blanks: fill_blanks,
                answers: answers,
                type: form.className,
                difficulty: Number(form["difficulty"].value),
                points: Number(form["points"].value)
            };

            // Preview the question to user before POST-ing to database
            toggleMessageWindow();
            var msg_container = document.getElementById("msg_insert");
            var preview_text = document.getElementById("preview_container").innerHTML;
            msg_container.innerHTML = previewBlanks(new_question, preview_text);
        } else if (input_fields_wrap.id === "input_fields_video") {

            new_question = {
                vid: form["vid"].value,
                type: form.className,
                difficulty: Number(form["difficulty"].value),
                points: Number(form["points"].value)
            };

            // Preview the question to user before POST-ing to database
            toggleMessageWindow();
            var msg_container = document.getElementById("msg_insert");
            var preview_text = document.getElementById("preview_container").innerHTML;
            msg_container.innerHTML = previewBlanks(new_question, preview_text);
        }

        console.log(new_question);

        // POST the data to the database
        document.getElementById("submitDataButton").addEventListener("click", function () {
            Recyclabears.questions.addQuestion(new_question).then(function (data) {
                console.log('success --> data :', data);

                // Show success message to user
                var msg_container = document.getElementById("msg_insert");
                msg_container.innerHTML = "<p>Question successfully entered into database!</p>";
                msg_container.innerHTML += "<button id='close_msg'>Close</button>";
                document.getElementById("close_msg").addEventListener("click", function () {
                    $('#create_page_content').show();
                    toggleMessageWindow();
                    togglePageWindow();
                    showPage("create_page");
                });

            }).catch(function (err) {
                console.log('error: ', err.responseJSON);
                alert(err.responseJSON.originalMessage);
                // console.log('text: ', text);
                // console.log('xhr: ', xhr);
                console.log("there is a problem with your request, please check ajax request");

                // Show an error message to user
                var msg_container = document.getElementById("msg_insert");
                msg_container.innerHTML = "<p>Sorry! Your question could not be created at this time. Please try again later.</p>";
                msg_container.innerHTML += "<button id='close_msg'>Close</button>";
                document.getElementById("close_msg").addEventListener("click", function () {
                    $('#create_page_content').show();
                    toggleMessageWindow();
                    togglePageWindow();
                    showPage("create_page");
                });

            });
        });
    }
}

/************************************************************************************/
/* Functions for previewing (creating HTML elements) the created questions before
   submitting to database                                                           */
/************************************************************************************/

/* Create the HTML for previewing the created Multiple Choice question */
function previewMultQues(ques_details) {

    // Preview Header
    var preview_HTML = '<h1>Preview Question</h1>';

    // Question text
    var ques_HTML = '<p>' + ques_details.question + '</p>';

    // Buttons of answer options
    var options = ques_details.answers.other.concat(ques_details.answers.correct);
    var options_HTML = '<div>';
    for (var i = 0; i < options.length; i++) {
        options_HTML += '<button disabled>' + options[i] + '</button>';
    }
    options_HTML += '</div>';

    // Correct answer text
    var correct_HTML = '<p>Correct answer: ' + ques_details.answers.correct + '</p>';

    // Difficulty level text
    var dif_HTML = '<p>Difficulty level: ' + ques_details.difficulty + '</p>';

    // Score points text
    var points_HTML = '<p>Score points: ' + ques_details.points + '</p>';

    // Back button if they changed their mind
    var back_button_HTML = '<button onclick="toggleMessageWindow();">Back</button>';

    // Submit button to submit this question to database
    var submit_button_HTML = '<button id="submitDataButton">Submit!</button>';

    return preview_HTML + ques_HTML + options_HTML + correct_HTML + dif_HTML +
        points_HTML + back_button_HTML + submit_button_HTML;
}

function previewBlanks(ques_details, preview) {
    // Preview Header
    var preview_HTML = '<h1>Preview Question</h1>';

    // Preview Content
    var content_HTML = preview + '<br>';

    // Back button if they changed their mind
    var back_button_HTML = '<button onclick="toggleMessageWindow();">Back</button>';

    // Submit button to submit this question to database
    var submit_button_HTML = '<button id="submitDataButton">Submit!</button>';

    return preview_HTML + content_HTML + back_button_HTML + submit_button_HTML;
}

/************************************************************************************/
/* Functions for displaying (creating HTML elements) the "Create Question" features */
/************************************************************************************/

/* Display interface for creating a Multiple Choice question */
function _createMult() {
    // Hide the Create Page Menu
    $('#create_page_content').hide();

    // Get the container element that will contain the quiz
    var create_container = document.getElementById("create_container");
    create_container.innerHTML = "";  // Reset the container element for each use

    // HTML Strings for MCQ Page
    var head_HTML = '<div id="create_header"><h1>Create your multiple choice question!</h1></div>';
    var create_content_HTML = '<div id="create_content">';

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

    // Complete the form element HTML string
    form_HTML.push('<button type="submit">Submit!</button>');
    form_HTML.push('</form>');

    create_content_HTML += form_HTML.join(" ");

    // Final display of create container
    create_container.innerHTML = head_HTML + create_content_HTML;
}

/* Display interface for creating a Fill-in-the-Blanks type question */
function _createBlanks() {
    // Hide the Create Page Menu
    $('#create_page_content').hide();

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

    // Complete the form element HTML string
    form_HTML.push('<button type="submit">Submit!</button>');
    form_HTML.push('</form>');

    // Final display of create container
    create_container.innerHTML = head_HTML + preview_HTML.join(" ") + form_HTML.join(" ");
}

/* Display interface for entering new video into database */
function _createVideo() {
    // Hide the Create Page Menu
    $('#create_page_content').hide();

    // Get the container element that will contain the quiz
    var create_container = $('#create_container');
    create_container.html('');  // Reset the container element for each use

    // HTML String for Blanks Page
    var head_HTML = '<h1>Create your video!</h1>';

    // HTML Strings for "Preview Video" section
    var preview_HTML = [];
    preview_HTML.push('<p>Preview video...</p>');
    preview_HTML.push('<div id="preview_container">');
    preview_HTML.push("<iframe width=\"560\" height=\"315\" id='youtube-video' src=\"about:blank\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>");
    preview_HTML.push('</div>');

    // HTML String for form element to input details
    var form_HTML = [];
    form_HTML.push('<form id="createQuestion" class="youtube-video" onsubmit="submitQuestion(event)">');
    form_HTML.push('<div id="input_fields_video" class="input_fields_wrap">');
    form_HTML.push('<label>https://www.youtube.com/watch?v=</label><input type="text" name="vid" required="required" oninput="$(\'#youtube-video\').attr(\'src\',\'https://www.youtube.com/embed/\'+this.value)"></label>');
    form_HTML.push('</div>');

    //HTML String for input of some extra information
    form_HTML.push('<p class="container-text">Difficulty Level: </p>');
    form_HTML.push('<input type="number" name="difficulty" required>');
    form_HTML.push('<p class="container-text">Score points: </p>');
    form_HTML.push('<input type="number" name="points" required>');

    // Complete the form element HTML string
    form_HTML.push('<button type="submit">Submit!</button>');
    form_HTML.push('</form>');

    // Final display of create container
    create_container.html(head_HTML + preview_HTML.join(" ") + form_HTML.join(" "));
}