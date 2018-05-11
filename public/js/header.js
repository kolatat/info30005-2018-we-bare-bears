
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


/* Updates the strings that should show the user's waller amount */
updatePrice = function() {
    Recyclabears.users.me().then( function(data) {
        var honey_amount = data.wallet;
        console.log("Received --> " + honey_amount);

        // Load all the HTML Elements that needs to be inserted with the 'honey_amount'
        var honey_spans = document.getElementsByClassName("honey_wallet");
        for(var i=0; i<honey_spans.length; i++){

            // For editing value in profile dropdown menu in header
            if(honey_spans[i].id === "honey"){
                honey_spans[i].innerHTML = "Honey Pots: " + honey_amount;
            }
            // Most likely for editing the current amount in user's wallet on Shop Page
            else {
                honey_spans[i].innerHTML = honey_amount;
            }
        }
        return 'done';
    });
};

