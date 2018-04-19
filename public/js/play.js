/* For responsive image map */

$(document).ready(function(e) {
    $('img[usemap]').rwdImageMaps();
});

/* Blinking checkpoint flags */

function setRandomCP() {
    var num = Math.floor(Math.random() * 10);
    document.querySelector('#cpimg').src = '/assets/images/checkpoints_' + num + '.png';
}

setInterval(setRandomCP, 500);

/* Toggle Overlay & Popup upon onClick */

function overlayPopUp(oObject) {
    //Set a variable to contain the DOM element of the overlay
    var overlay = document.getElementById("overlay");
    //Set a variable to contain the DOM element of the popup
    var popup = document.getElementById("popup");
    // Toggle visibility of overlay and popup
    if(overlay.style.display === "none"){
        overlay.style.display = "block";
        popup.style.display = "block";
        //Edit part of the text in popup based on ID of function caller
        document.getElementById("flag-id").innerHTML = oObject.id;
    } else {
        overlay.style.display = "none";
        popup.style.display = "none";
    }


}

/* When the user clicks on div, open the popup */

function onClickCheckpoint() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle('show');
}

