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
    var test_mult_param = {options: ["hi", "ko", "laaa", "help", "pick mee!"], correct_ans: "pick mee!"};
    var test_blank_param = {fill_array_objects: [{type: "fill", value: "Rendering this "}, {type: "blank", value: "first answer"}, {type: "fill", value: "Insert stuff here"}, {type: "blank", value:"second answer"}, {type:"fill", value:"yay"}, {type:"blank", value:"this comes after yay"}]};
    var test_vid_param = {url: "https://www.youtube.com/embed/_LXlxSZI_K8"};

    $('#create_mult').click(function () {

        toggleCreateWindow();
        $.get('create_mult', test_mult_param)
            .done(function(data){
                $create_container.html(data);
            });
    });

    $('#create_blanks').click(function () {
        toggleCreateWindow();
        $.get('create_blanks', test_blank_param)
            .done(function(data){
                $create_container.html(data);
            });
    });

    $('#create_video').click(function() {
        toggleCreateWindow();
        $.get('create_video', test_vid_param)
            .done(function(data){
                $create_container.html(data);
            });

    });
});