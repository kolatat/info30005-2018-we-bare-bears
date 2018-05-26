/* Functions here used for header responsive-ness-- can be moved to main.js when merged with the fb-login branch
*  Note: jQuery is also needed! */

// dynamically copy contents of new/nav to nav box
$(document).ready(function () {
    $.get('/new/nav.html', function (html) {
        $('nav#header').html(html);

        var as = $('#navigation a.navlink');
        for (var i = 0; i < as.length; i++) {
            if (as[i].href == window.location) {
                as[i].classList.add('active');
            }
        }

    });
});

// Used on smaller screens: Toggle the navigation menu for view
function toggleNavMenu() {
    var nav_menu = document.getElementById("navigation");
    if (nav_menu.style.display === "none" || nav_menu.style.display === "") {
        nav_menu.style.display = "inline-block";

    } else {
        nav_menu.style.display = "none";
    }
}

// Check size of window for handling of navigation element styles
$(window).resize(function () {

    if (!window.matchMedia("(max-width: 760px)").matches || screen.width === window.innerWidth) {

        // Clear inline styles when window is resized beyond 760px or maximised
        $('#navigation').attr('style', '');
    }

    // If the screen is 760px or less -- do nothing

});


/* Updates the strings that should show the user's waller amount */
updateHoney = function () {
    Recyclabears.users.me().then(function (data) {
        var user_name = data.name;
        var honey_amount = data.wallet;

        // Load all the HTML Elements that needs to be inserted with the 'honey_amount'
        var name_span = document.getElementById("score");
        name_span.innerHTML = user_name;

        // Load all the HTML Elements that needs to be inserted with the 'honey_amount'
        var honey_spans = document.getElementsByClassName("honey_wallet");
        for (var i = 0; i < honey_spans.length; i++) {

            // For editing value in profile dropdown menu in header
            if (honey_spans[i].id === "honey") {
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

wbbInit(updateHoney);

function updateProfilePicture() {
    $('img#user_dp').attr('src', Recyclabears.users.getUserDpUrl());
}

wbbInit(updateProfilePicture);