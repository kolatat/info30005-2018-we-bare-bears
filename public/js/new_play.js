
/* Toggle the PopUp Window that displays the quizzes */
function toggleQuizWindow(){
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
        document.getElementById("quiz_container").innerHTML = "";
    }
}


/* Toggle the PopUp Window that displays status about the quizzes */
function toggleMessageWindow(obj){
    //Set a variable to contain the DOM element of the overlay
    var overlay = document.getElementById("overlay_message");
    //Set a variable to contain the DOM element of the popup
    var popup = document.getElementById("popup_message");
    // Toggle visibility of overlay and popup


    var obj_class = obj.className;

    if(overlay.style.display === "none" || overlay.style.display === ""){
        overlay.style.display = "block";
        popup.style.display = "block";
        //Edit part of the text in popup based on ID of function caller
//

        if(obj_class === "correct"){
            document.getElementById("msg_insert").innerHTML = "Correct Answer!"
        } else {
            document.getElementById("msg_insert").innerHTML = "Wrong Answer!"
        }

    } else {
        overlay.style.display = "none";
        popup.style.display = "none";
    }
}





$(document).ready(function() {

    var $quiz_container = $('#quiz_container');
    var test_mult_param = {options: ["ko", "hi", "laaa", "pick mee!"], correct_ans: "pick mee!"};
    var test_blank_param = {fill_array_objects: [{type: "fill", value: "Rendering this "}, {type: "blank", value: "first answer"}, {type: "fill", value: "Insert stuff here"}, {type: "blank", value:"second answer"}, {type:"fill", value:"yay"}, {type:"blank", value:"this comes after yay"}]};
    var test_vid_param = {url: "https://www.youtube.com/embed/_LXlxSZI_K8"};

    $('#multiple').click(function () {
        $.get('play_mult', test_mult_param)
           .done(function(data){
               $quiz_container.html(data);
           });
    });

    $('#blanks').click(function () {
        $.get('play_blanks', test_blank_param)
            .done(function(data){
                $quiz_container.html(data);
            });
    });

    $('#vid').click(function() {
        $.get('play_video', test_vid_param)
            .done(function(data){
            $quiz_container.html(data);
        });

    });
});
