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


var testItemList = [
    {
        name: "Tree",
        type: "plant",
        price: 100
    },
    {
        name: "Penguin",
        type: "animal",
        price: 20
    },
    {
        name: "Shrub",
        type: "plant",
        price: 10
    },
    {
        name: "Potato",
        type: "plant",
        price: 2
    },
    {
        name: "Ice Bear",
        type: "animal",
        price: 1000
    },
    {
        name: "Yellow Recycling Bin",
        type: "bin",
        price: 10
    },
    {
        name: "Blue Recycling Bin",
        type: "bin",
        price: 10
    },
    {
        name: "Red Recycling Bin",
        type: "bin",
        price: 10
    },
    {
        name: "Purple Recycling Bin",
        type: "bin",
        price: 10
    },
    {
        name: "Grizzly Bear",
        type: "animal",
        price: 1000
    },
    {
        name: "Potted Plant",
        type: "plant",
        price: 30
    },
    {
        name: "Panda Bear",
        type: "animal",
        price: 1000
    },
    {
        name: "Watermelon Plant",
        type: "plant",
        price: 25
    },    {
        name: "Compost Bin",
        type: "bin",
        price: 30
    },
    {
        name: "Landfill Bin",
        type: "bin",
        price: 20
    },
    {
        name: "Cute Plant",
        type: "plant",
        price: 35
    },
    {
        name: "Grizzly Bear",
        type: "animal",
        price: 1000
    },
    {
        name: "Rose Plant",
        type: "plant",
        price: 27
    }

];


function populateShopMenu(button){

    // Get the items_container element of the HTML to add items for display
    var items_container = document.getElementById("items_container");
    items_container.innerHTML = "";

    // Get the type of items to be shown
    var show_type = button.id;
    var add_item = 0;
    var new_item_HTML = "";

    // Loop over items from database and determine whether to display them based on user selection
    for(var i=0; i<testItemList.length; i++){

        add_item = 0;
        new_item_HTML = "";

        // Determine whether to show the item
        if(show_type == "tab_all"){
            add_item = 1;
        } else if(show_type === "tab_plants"){
            if(testItemList[i].type === "plant"){
                add_item = 1;
            }
        } else if(show_type === "tab_animals"){
            if(testItemList[i].type === "animal"){
                add_item = 1;
            }
        } else if(show_type === "tab_bins"){
            if(testItemList[i].type === "bin"){
                add_item = 1;
            }
        }

        // Add the HTML elements for the item if to be shown
        if(add_item == 1){
            new_item_HTML +=
                "<div>" +
                    "<button class='item_desc' onclick='showDescription(this)'>" +
                        "<p>Name: <span class='name'>" + testItemList[i].name + "</span></p>" +
                        "<p>Cost: <span class='price'>" + testItemList[i].price + "</span></p>" +
                        "<p style='display: none'>Type: <span class='type'>" + testItemList[i].type + "</span></p>" +
                       // "<p>Desc: <span class='description' style='display: none'>" + testItemList[i].description + "</span></p>"
                    "</button>" +
                "</div>";
        }

        items_container.innerHTML += new_item_HTML;
    }
}


function showDescription(item_button) {

    var popup_status = document.getElementById("");

    toggleShopWindow();
    var name = item_button.getElementsByClassName("name")[0].innerHTML;
    var price = item_button.getElementsByClassName("price")[0].innerHTML;
//    var description = item_button.getElementsByClassName("description")[0].innerHTML;

    var name_container = document.getElementById("item_name");
    var price_container = document.getElementById("item_price");
    var description_container = document.getElementById("item_description");


    name_container.innerHTML = "Name: " + name;
    price_container.innerHTML = "Price: " + price;
    description_container.innerHTML = "<em>*Insert item description here*</em>";


}