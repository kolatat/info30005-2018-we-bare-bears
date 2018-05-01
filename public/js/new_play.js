
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
    }
}


/* Toggle the PopUp Window that displays status about the quizzes */
function toggleMessageWindow(){
    //Set a variable to contain the DOM element of the overlay
    var overlay = document.getElementById("overlay_message");
    //Set a variable to contain the DOM element of the popup
    var popup = document.getElementById("popup_message");
    // Toggle visibility of overlay and popup
    if(overlay.style.display === "none" || overlay.style.display === ""){
        overlay.style.display = "block";
        popup.style.display = "block";
        //Edit part of the text in popup based on ID of function caller
//        document.getElementById("flag-id").innerHTML = oObject.id;
    } else {
        overlay.style.display = "none";
        popup.style.display = "none";
    }
}



$(document).ready(function() {

    var $quiz_container = $('#quiz_container');

    $('#multiple').click(function () {
        $.get('play_mult', {buttons: ["hi", "yo", "la"]})
            .done(function(data){
           $quiz_container.html(data);
        });
//        $quiz_container.get('play_mult');
    });
    $('#blanks').click(function(){
        $.get('play_blanks', function(data){
            $quiz_container.html(data);
        })


//        $quiz_container.load('play_blanks');
    });
    $('#vid').click(function(){
        $.get('play_video', function(data){
            $quiz_container.html(data);
        });

        //        $quiz_container.get('play_video');
    });
});

