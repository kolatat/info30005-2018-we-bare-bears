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
        // Show the Create Page Menu
        $('#create_page_content').show();
     //   document.getElementById("create_container").innerHTML = "";

    }
}


/* Allow users to start on Play Page once FB initialisation has been completed */
function enablePlayPage(){

    var page_buttons = document.getElementsByClassName("page_buttons");

    // Enable play and create buttons
    for(var i=0; i<page_buttons.length; i++){
        page_buttons[i].disabled = false;
    }

}
wbbInit(enablePlayPage);


/* Change image of play/create button on hover */
function hoverImage(image){
    var random_val = Math.floor((Math.random() * 3));
    if(image === "play"){
        $("#play-flag").attr("src", "/assets/images/play/play_" + random_val + ".png");
    } else if (image === "create"){
        $("#create-flag").attr("src", "/assets/images/play/create_1.png");
    }
}
/* Reset image of play/create button*/
function defaultImage(){
    $("#play-flag").attr("src", "/assets/images/play/play_main.png");
    $("#create-flag").attr("src", "/assets/images/play/create_main.png");
}


/* Prevent enter button on play page --- It messes up with the quiz */
$('html').bind('keypress', function(e)
{
    if(e.keyCode === 13)
        return false;
});




