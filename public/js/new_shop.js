/* Toggle the PopUp Window that displays the quizzes */
function toggleShopWindow() {
    //Set a variable to contain the DOM element of the overlay
    // var overlay = document.getElementById("overlay_base");
    //Set a variable to contain the DOM element of the popup
    var popup = document.getElementById("popup_base");
    // Toggle visibility of overlay and popup
    if (popup.style.display === "none" || popup.style.display === "") {
        //  overlay.style.display = "block";
        popup.style.display = "block";
    } else {
        //  overlay.style.display = "none";
        popup.style.display = "none";
        //document.getElementById("popup_base").innerHTML = "";
    }
}


var items = [];
var stored = 0;

function populateShopMenu(show_type) {

    // Get the items_container element of the HTML to add items for display
    var items_container = document.getElementById("items_container");
    items_container.innerHTML = "";

    // Make all classes not active and make the target class active
    changeActive(show_type);

    // Get the type of items to be shown
    var add_item = 0;
    var new_item_HTML = "";


    // If first time on page, fetch items from database and save it locally;
    // Display page with all items (default)
    if(stored === 0){
        Recyclabears.items.getShopItems().then(function(data){

            items = data.docs;
            stored = 1;
            console.log(items);
            for (var i = 0; i < items.length; i++){
                new_item_HTML =
                    "<div>" +
                    "<button class='item_button' onclick='showDescription(" + JSON.stringify(items[i]) + ")'>" +
                    "<img src='" + items[i].image + "' class='shop_item' >" +
                    "<p>Name: <span class='name'>" + items[i].name + "</span></p>" +
                    "<p class='price_container'>" +
                    "<span>Cost: </span>" +
                    "<span class='honey'>" + items[i].price + "</span>" +
                    "<img src='/assets/images/honey_pot.png' width='25px' height='25px'>" +
                    "</p>" +
                    "</button>" +
                    "</div>";
                items_container.innerHTML += new_item_HTML;
            }
        }).catch(function(err){
            console.log(err);
        });

    } else {
        // If items have been previously fetched from database, iterate over the saved list
        for (var i = 0; i < items.length; i++) {

            add_item = 0;
            new_item_HTML = "";

            // Determine whether to show the item
            if (show_type === "tab_all") {
                add_item = 1;
            } else if (show_type === "tab_plants") {
                if (items[i].type === "plant") {
                    add_item = 1;
                }
            } else if (show_type === "tab_animals") {
                if (items[i].type === "animal") {
                    add_item = 1;
                }
            } else if (show_type === "tab_bins") {
                if (items[i].type === "bin") {
                    add_item = 1;
                }
            }

            // Add the HTML elements for the item if to be shown
            if (add_item === 1) {
                new_item_HTML =
                    "<div>" +
                    "<button class='item_button' onclick='showDescription(" + JSON.stringify(items[i]) + ")'>" +
                    "<img src='" + items[i].image + "' class='shop_item' >" +
                    "<p>Name: <span class='name'>" + items[i].name + "</span></p>" +
                    "<p class='price_container'>" +
                    "<span>Cost: </span>" +
                    "<span class='honey'>" + items[i].price + "</span>" +
                    "<img src='/assets/images/honey_pot.png' width='25px' height='25px'>" +
                    "</p>" +
                    "</button>" +
                    "</div>";
            }
            items_container.innerHTML += new_item_HTML;
        }

    }

}


function showDescription(item_obj) {
    //Set a variable to contain the DOM element of the popup
    var popup_status = document.getElementById("popup_base").style.display;
    if (popup_status === "none" || popup_status === "") {
        toggleShopWindow();
    }

    var name = item_obj.name;
    var price = item_obj.price;
    var description = item_obj.description;
    var img_link = item_obj.image;

    // Insert image of item
    var image_container = document.getElementById("item_image");
    image_container.innerHTML = "";
    image_container.innerHTML = "<img src='" + img_link + "' class='shop_item' >";

    // Insert details about the item
    var attrib_container = document.getElementById("item_attributes");
    attrib_container.innerHTML = "";
    attrib_container.innerHTML += "<p>Name: " + name + "</p>";
    attrib_container.innerHTML +=
        "<p class='price_container'>" +
        "<span>Cost: </span>" +
        "<span class='honey'>" + price + "</span>" +
        "<img src='/assets/images/honey_pot.png' width='25px' height='25px'>" +
        "</p>"


    attrib_container.innerHTML += "<p><em>" + description + "</em></p>";
    attrib_container.innerHTML += "<button onclick='alert(\"Credit card declined.\")'>Buy Item</button>";
    attrib_container.innerHTML += "<button onclick='toggleShopWindow()'>Close</button>"
}

function changeActive(show_type) {
    var buttons_container = document.getElementById("tab_buttons");

    for (var i = 0; i < buttons_container.children.length; i++) {
        buttons_container.children[i].className = "";
    }

    document.getElementById(show_type).className = "active";
}

wbbInit(function populateShopMenuHelper() {
    populateShopMenu('tab_all');
});


function testItemAPI() {

    Recyclabears.items.getShopItems().then(function(data){
        console.log(data);
    });
}