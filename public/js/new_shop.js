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
        price: 100,
        image: "/assets/images/items/tree.png",
        description: "A big tree."
    },
    {
        name: "Penguin",
        type: "animal",
        price: 20,
        image: "/assets/images/items/penguin.png",
        description: "A cute little penguin."
    },
    {
        name: "Ice Bear",
        type: "animal",
        price: 1000,
        image: "/assets/images/items/ice_bear.png",
        description: "The strongest and youngest bear."
    },
    {
        name: "Yellow Bin",
        type: "bin",
        price: 10,
        image: "/assets/images/items/yellow_bin.png",
        description: "A bin that looks like it is made for disposing paper."
    },
    {
        name: "Red Bin",
        type: "bin",
        price: 10,
        image: "/assets/images/items/red_bin.png",
        description: "A bin that looks like it is made for disposing plastic."
    },
    {
        name: "Blue Bin",
        type: "bin",
        price: 10,
        image: "/assets/images/items/blue_bin.png",
        description: "A bin that looks like it is made for disposing metal."
    },
    {
        name: "Green Bin",
        type: "bin",
        price: 10,
        image: "/assets/images/items/green_bin.png",
        description: "A bin that looks like it is made for disposing glass."
    },
    {
        name: "Panda Bear",
        type: "animal",
        price: 1000,
        image: "/assets/images/items/panda_bear.png",
        description: "The bear link that holds them all together."
    },
    {
        name: "Sunflower",
        type: "plant",
        price: 35,
        image: "/assets/images/items/sunflower.png",
        description: "Making your world more lively - one flower at a time."
    },
    {
        name: "Grizzly Bear",
        type: "animal",
        price: 1000,
        image: "/assets/images/items/grizzly_bear.png",
        description: "The bubbly, hyperactive, loud and talkative bear."
    },
    {
        name: "Turtle",
        type: "animal",
        price: 27,
        image: "/assets/images/items/turtle.png",
        description: "Save me from plastic bags!"
    }

];


function populateShopMenu(show_type){

    // Get the items_container element of the HTML to add items for display
    var items_container = document.getElementById("items_container");
    items_container.innerHTML = "";

    // Make all classes not active and make the target class active
    changeActive(show_type);

    // Get the type of items to be shown
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
                        "<img src='" + testItemList[i].image + "' class='shop_item' >" +
                        "<p>Name: <span class='name'>" + testItemList[i].name + "</span></p>" +
                        "<p>Cost: <span class='price'>" + testItemList[i].price + "</span></p>" +
                        "<p style='display: none'>Type: <span class='type'>" + testItemList[i].type + "</span></p>" +
                        "<p style='display: none'>Image Link: <span class='img_link'>" + testItemList[i].image + "</span></p>" +
                        "<p style='display: none'>Desc: <span class='description'>" + testItemList[i].description + "</span></p>" +
                    "</button>" +
                "</div>";
        }

        items_container.innerHTML += new_item_HTML;
    }
}

function changeActive(show_type) {
    var buttons_container = document.getElementById("tab_buttons");
    console.log(buttons_container);

    for(var i=0; i<buttons_container.children.length; i++){
        buttons_container.children[i].className = "";
    }

    document.getElementById(show_type).className = "active";
}


function showDescription(item_button) {

    //Set a variable to contain the DOM element of the popup
    var popup_status = document.getElementById("popup_base").style.display;
    if(popup_status === "none" || popup_status === ""){
        toggleShopWindow();
    }

    var name = item_button.getElementsByClassName("name")[0].innerHTML;
    var price = item_button.getElementsByClassName("price")[0].innerHTML;
    var description = item_button.getElementsByClassName("description")[0].innerHTML;
    var img_link = item_button.getElementsByClassName("img_link")[0].innerHTML;

    // Insert image of item
    var image_container = document.getElementById("item_image");
    image_container.innerHTML = "";
    image_container.innerHTML = "<img src='" + img_link + "' class='shop_item' >";

    // Insert details about the item
    var attrib_container = document.getElementById("item_attributes");
    attrib_container.innerHTML = "";
    attrib_container.innerHTML += "<p>Name: " + name + "</p>";
    attrib_container.innerHTML += "<p>Price: " + price +"</p>";
    attrib_container.innerHTML += "<p><em>" + description + "</em></p>";
    attrib_container.innerHTML += "<button>Buy Item</button>";
    attrib_container.innerHTML += "<button onclick='toggleShopWindow()'>Close</button>"


}