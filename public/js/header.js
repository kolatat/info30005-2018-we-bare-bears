
/* Functions here used for header responsive-ness-- can be moved to main.js when merged with the fb-login branch
*  Note: jQuery is also needed! */

// Used on smaller screens: Toggle the navigation menu for view
function toggleNavMenu() {
    var nav_menu = document.getElementById("navigation");
    if(nav_menu.style.display === "none" || nav_menu.style.display === ""){
        nav_menu.style.display = "inline-block";

    } else {
        nav_menu.style.display = "none";
    }
}

// Check size of window for handling of navigation element styles
$(window).resize(function(){

    if(!window.matchMedia("(max-width: 720px)").matches || screen.width === window.innerWidth){

        // Clear inline styles when window is resized beyond 720px or maximised
        $('#navigation').attr('style', '');
    }

    // If the screen is 720px or less -- do nothing

});