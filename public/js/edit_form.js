/* What does this do?

document.getElementById("add_field_button").addEventListener("click", function(event){
    event.preventDefault()
});

*/


/* Let users add more input fields */
function addField(input_field_wrapper){

    var max_input = 10;
    var add_button = document.getElementById("add_field_button");


    // Create element for use with appendChild method to prevent losing information already inputted on form
    var input_field_html = document.createElement('div');
    // Ensure that new input field will have unique ID and also will always have bigger value than previous input fields' IDs
    var last_elem_id = input_field_wrapper.lastElementChild.id;
    var current_id = +last_elem_id +1;  // +last_elem_id casts the string to a number
    input_field_html.id = current_id;


    // Adding buttons for MCQ page
    if(input_field_wrapper.id === "input_fields_mult"){
        input_field_html.innerHTML = '<input type="text" name="options-' + current_id + '" '  +
        'required/><button class="remove_field" onclick="removeField(this, this.parentNode)">x</button>';
    }

    // Adding buttons for filling in the blanks page
    else if(input_field_wrapper.id === "input_fields_blanks"){
        input_field_html.innerHTML = '<select name="fill_blank_type" onchange="modifyTextDecoration(this)">\n' +
            '<option value="fill">Fill</option>\n' +
            '<option value="blank">Blank</option>\n' +
            '</select>\n' +
            '<input type="text" name="options-' + current_id + '" ' +
        'onkeyup="previewText(this)" required><button class="remove_field" onclick="removeField(this, this.parentNode)">x</button>';


        // Create new span element and add to the preview_container
        var preview_container = document.getElementById('preview_container');
        var new_span = document.createElement('pre');
        new_span.className = "preview";
        new_span.id = current_id + "-preview";
        preview_container.appendChild(new_span);

    }


    if(input_field_wrapper.childElementCount <= max_input){
        input_field_wrapper.appendChild(input_field_html);
    } else {

        add_button.disabled = true;
    }

}

function removeField(element, input_field_wrapper){




    // Only for Create Blanks page
    if(input_field_wrapper.parentNode.id === "input_fields_blanks"){
        // Remove the target preview span
        alert("preview id to remove: " + input_field_wrapper.id);
        var id_to_remove = element.parentNode.id;
        var span_id_to_remove = id_to_remove + "-preview";
        document.getElementById(span_id_to_remove).remove();
    }


    // Remove the target input field
    element.parentNode.remove();

    // If there are less input fields than the max amount now, enable the add field button
    var max_input = 10;
    var add_button = document.getElementById("add_field_button");
    if(input_field_wrapper.childElementCount <= max_input){
        add_button.disabled = false;
    }
}


/* Displaying the current input fill/blanks in one whole sentence --- for Create Blanks page */
function previewText(input_field){


    var input_id = input_field.parentNode.id;   // Get the id of parent div of input field
    var span_id = input_id + "-preview";    // Id of target span element
    var span_elem = document.getElementById(span_id);
    span_elem.innerHTML = input_field.value;    // Modify the content of the target span element

}

/* Modify the preview of input (underline/no underline --- for Create Blanks page */
function modifyTextDecoration(select_field){

    var select_id = select_field.parentNode.id;  // Get the id of parent div of select field
    var span_id = select_id + "-preview";    // Id of target span element
    var span_elem = document.getElementById(span_id);

    if(select_field.value === "blank"){
        span_elem.style.textDecoration = "underline";
    } else {
        span_elem.style.textDecoration = "none";
    }

}


function submitQuestion() {
    var form = document.getElementById('createQuestion');


    var answer_options = [];
    answer_options.push(form["correct_ans"].value);


    var input_fields_wrap = document.getElementsByClassName("input_fields_wrap")[0];
    if(input_fields_wrap.id === "input_fields_mult"){

        alert("Length of input fields wrap children is :" + input_fields_wrap.children.length);

        for(var i=1; i<input_fields_wrap.children.length; i++){

            var option_div = input_fields_wrap.children[i];

            console.log("Hi");
            var input_field = option_div.getElementsByTagName("input");
            answer_options.push(input_field.value);

        }
    }



    var new_question = {
        question: form["question"].value,
        options: answer_options,
        correct_ans: form["correct_ans"].value
    }


}