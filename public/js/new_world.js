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

function populateItemMenu(button){

    // Get the items_container element of the HTML to add items for display
    var items_container = document.getElementById("items-container");
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
            var functionName = "showInWorld(" + JSON.stringify(testItemList[i]) + ")";
            new_item_HTML +=
                "<div>" +
                "<button class='item_desc' onclick='" + functionName + "'>" +
                "<img src='" + testItemList[i].image + "' class='shop_item' >" +
                "<p>Name: <span class='name'>" + testItemList[i].name + "</span></p>" +
                "<p>Cost: <span class='price'>" + testItemList[i].price + "</span></p>" +
                "<p style='display: none'>Type: <span class='type'>" + testItemList[i].type + "</span></p>" +
                "<p style='display: none'>Image Link: <span class='img_link'>" + testItemList[i].image + "</span></p>" +
                "<p style='display: none'>Desc: <span class='description'>" + testItemList[i].description + "</span></p>"
            "</button>" +
            "</div>";
        }

        items_container.innerHTML += new_item_HTML;
    }
}

var id = 0

function showInWorld(obj){
    var objDiv = document.createElement("div");
    objDiv.setAttribute("class", "item-to-move");
    objDiv.setAttribute("id", "id1");
    objDiv.innerHTML = "<img src='/assets/images/world/delete2.png' class='delete-img' onclick='deleteDiv(this.parentNode)'>";
    objDiv.innerHTML += "<img src='" + obj.image + "'>";

    dragElement(objDiv);
    document.getElementsByTagName('body')[0].appendChild(objDiv);

}

function deleteDiv(obj){
    console.log(obj.id);
    obj.remove();
    // document.getElementsByTagName('body')[0].removeChild(obj);
}

function runDraggables(){
    var items = document.getElementsByClassName("item-to-move");
    for(var i= 0; i < items.length; i++)
    {
        dragElement(items.item(i));
        console.log(items.item(i));
    }

}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}