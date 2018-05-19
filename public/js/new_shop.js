/* Toggle the PopUp Window that displays the quizzes */
function toggleShopWindow() {
    //Set a variable to contain the DOM element of the overlay
     var overlay = document.getElementById("overlay_base");
    //Set a variable to contain the DOM element of the popup
    var popup = document.getElementById("popup_base");
    // Toggle visibility of overlay and popup
    if (popup.style.display === "none" || popup.style.display === "") {
          overlay.style.display = "block";
        popup.style.display = "block";
    } else {
          overlay.style.display = "none";
        popup.style.display = "none";
        //document.getElementById("popup_base").innerHTML = "";
    }

    const overlay_base = $('#overlay_base');
    overlay_base.click(toggleShopWindow);
}

function closeShop(){
    const overlay = $('#overlay');
    const popup = $('#world-pop-up');

    // Clear modified inline styles when popup is closed
    popup.attr('style', '');

    overlay.off('click');
    overlay.hide();
    popup.hide();
}


var items = [];
var inventory = [];

function populateShopMenu(show_type) {

    if($('#popup_base').css("display") === "block"){
        toggleShopWindow();
    }

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
        "<span id='honey_price' class='honey'>" + price + "</span>" +
        "<img src='/assets/images/honey_pot.png' width='25px' height='25px'>" +
        "</p>";

    attrib_container.innerHTML += "<p><em>" + description + "</em></p>";
    attrib_container.innerHTML += "<div class='purchase_detail'><button class='minus' onclick='updateQuantity(this)'>-</button>" +
                                  "<pre>    <span id='purchase_quantity'>1</span>    </pre>" +
                                  "<button class='add' onclick='updateQuantity(this)'>+</button></div>";

    attrib_container.innerHTML += "<button onclick='purchaseItem(" + item_index + ")'>Buy Item</button>";
    attrib_container.innerHTML += "<div ><button class='close-btn'onclick='toggleShopWindow()'>Close</button></div>"

}


function updateQuantity(updateButton){

    var quantity_HTML = $('#purchase_quantity');
    var price_HTML = $('#honey_price');

    var amount = Number(quantity_HTML.html());
    var item_price = Number(price_HTML.html())/amount;

    if(updateButton.className === "minus"){
        console.log("minus");
        // cannot go below 0
        if(amount <= 1){
            return;
        }
        amount--;
    } else if(updateButton.className === "add"){
        console.log("plus");
        amount++;
    }

    item_price *= amount;
    quantity_HTML.html(amount);
    price_HTML.html(item_price);
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
    var quantity = Number($('#purchase_quantity').html());
    var total_price = items[item_index].price * quantity;
    Recyclabears.users.updateWallet("minus", total_price).then(function () {

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
                quantity: Number(quantity),
                image: purchase.image,
                type: purchase.type
            })
        } else {
            // how to save as number, not string ???
            var new_quantity = Number(inventory[inv_index].quantity) + quantity;
            inventory[inv_index].quantity = new_quantity;
        }

        Recyclabears.users.updateInventory(inventory).then(function (res) {
            // TODO show popup showing purchase successful
            console.log("Inventory successfully updated!");
            alert(purchase.name + " x" + quantity + " bought!!");
        }).catch(function (err) {
            alert("Purchase failed");
        });

        updateHoney();

    }).catch(function (err) {
        // TODO show popup not enough honey
        alert("Not enough honey!");
    });

}

