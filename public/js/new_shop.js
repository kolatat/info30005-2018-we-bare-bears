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
var inventory = [];

function populateShopMenu(show_type) {

    // Get the items_container element of the HTML to add items for display
    var items_container = document.getElementById("items_container");
    items_container.innerHTML = "";

    // Make all classes not active and make the target class active
    changeActive(show_type);

    // Get the type of items to be shown
    var add_item = 0;
    var new_item_HTML = "";

    for (var index = 0; index < items.length; index++) {

        add_item = 0;
        new_item_HTML = "";

        // Determine whether to show the item
        if (show_type === "tab_all") {
            add_item = 1;
        } else if (show_type === "tab_plants") {
            if (items[index].type === "plant") {
                add_item = 1;
            }
        } else if (show_type === "tab_animals") {
            if (items[index].type === "animal") {
                add_item = 1;
            }
        } else if (show_type === "tab_bins") {
            if (items[index].type === "bin") {
                add_item = 1;
            }
        }

        // Add the HTML elements for the item if to be shown
        if (add_item === 1) {
            new_item_HTML =
                "<div>" +
                "<button class='item_button' onclick='showDescription(" + index + ")'>" +
                "<img src='" + items[index].image + "' class='shop_item' >" +
                "<p>Name: <span class='name'>" + items[index].name + "</span></p>" +
                "<p class='price_container'>" +
                "<span>Cost: </span>" +
                "<span class='honey'>" + items[index].price + "</span>" +
                "<img src='/assets/images/honey_pot.png' width='25px' height='25px'>" +
                "</p>" +
                "</button>" +
                "</div>";
        }
        items_container.innerHTML += new_item_HTML;
    }

}


function showDescription(item_index) {
    //Set a variable to contain the DOM element of the popup
    var popup_status = document.getElementById("popup_base").style.display;
    if (popup_status === "none" || popup_status === "") {
        toggleShopWindow();
    }

    var item_obj = items[item_index];
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
        "</p>";

    attrib_container.innerHTML += "<p><em>" + description + "</em></p>";
    attrib_container.innerHTML += "<button onclick='purchaseItem(" + item_index + ")'>Buy Item</button>";
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

    Recyclabears.items.getShopItems().then(function(data){
        items = data.docs;
        populateShopMenu('tab_all');
    });

    Recyclabears.users.getInventory().then(function(data){
        inventory = data;
    });

});




function purchaseItem(item_index) {

    alert("Purchasing!!! " + items[item_index].name);
    Recyclabears.users.updateWallet("minus", items[item_index].price).then(function () {

        var purchase = items[item_index];
        var inv_index = -1;
        // search through the inventory to see if user already has one of the item
        for(var i = 0; i < inventory.length; i++){
            if(inventory[i].name === purchase.name){
                inv_index = i;
            }
        }

        if(inv_index === -1){
            inventory.push({
                name: purchase.name,
                quantity: 1,
                image: purchase.image,
                type: purchase.type
            })
        } else {
            inventory[inv_index].quantity++;
        }

        Recyclabears.users.updateInventory(inventory).then(function (res) {
            // show popup showing purchase successful

            console.log("Inventory successfully updated!");
            alert(purchase.name + " bought!!");
        }).catch(function (err) {
            alert("Purchase failed");
        });

        updateHoney();

    }).catch(function (err) {
        // show popup not enough honey
        alert("Not enough honey!");
    });

}

