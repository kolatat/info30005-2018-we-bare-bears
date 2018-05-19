window.onresize = onResize;

const worldSize = [1122, 626];
const scrollbarOffset = 17;

function onResize() {
    //var items_container = document.getElementById("items-container");
    //var worldDivHeight = document.getElementById('world-img').clientHeight;
    // console.log(worldDivHeight + 'world');
    //items_container.offsetHeight = worldDivHeight;
    //items_container.style.height = worldDivHeight + 'px';
    //items_container.clientHeight = worldDivHeight;
    // console.log(items_container.offsetHeight + 'items');
    // console.log(items_container.style.height + 'items');
    //console.log('ayy');

    // too difficult lets just turn a blind eye on resizing
    // rip resize

    // Resize the overlay that covers the world-container when not in Edit mode
    var $overlay = $('.overlay');
    var $worldContainer = $('#world-container');
    $overlay.width($worldContainer.width());
    $overlay.height($worldContainer.height() - scrollbarOffset);
    $overlay.css({"top": $('#container').css("top")});

}

/*************************************************************************/
/******************************* TEST DATA *******************************/
/*************************************************************************/

var worldItems = [
    {
        name: "Yellow Bin",
        type: "bin",
        bin_type: "paper-bin",
        price: 10,
        image: "/assets/images/items/yellow_bin.png",
        description: "A bin that looks like it is made for disposing paper.",
        position_x: "200px",
        position_y: "550px"
    },
    {
        name: "Red Bin",
        type: "bin",
        bin_type: "plastic-bin",
        price: 10,
        image: "/assets/images/items/red_bin.png",
        description: "A bin that looks like it is made for disposing plastic.",
        position_x: "400px",
        position_y: "550px"
    },
    {
        name: "Blue Bin",
        type: "bin",
        bin_type: "metal-bin",
        price: 10,
        image: "/assets/images/items/blue_bin.png",
        description: "A bin that looks like it is made for disposing metal.",
        position_x: "600px",
        position_y: "550px"
    },
    {
        name: "Green Bin",
        type: "bin",
        bin_type: "glass-bin",
        price: 10,
        image: "/assets/images/items/green_bin.png",
        description: "A bin that looks like it is made for disposing glass.",
        position_x: "800px",
        position_y: "550px"
    },
    {
        name: "Black Bin",
        type: "bin",
        bin_type: "landfill-bin",
        price: 10,
        image: "/assets/images/items/black_bin.png",
        description: "A bin that looks like it is made for disposing landfill rubbish.",
        position_x: "1000px",
        position_y: "550px"
    }
];

var lastDumpSession = new Date("2018-05-15T12:00:00+10:00");

/*************************************************************************/
/************************ PAGE INITIALIZATION ****************************/
/*************************************************************************/

var inventory = [];

function worldPageInit() {

    $('.save-btn').prop('disabled', false);
    var $overlay = $('.overlay');
    var $worldContainer = $('#world-container');
    $overlay.width($worldContainer.width());
    $overlay.height($worldContainer.height() - scrollbarOffset);
    $overlay.css({"top": $('#container').css("top")});
    Recyclabears.worlds.getWorld().then(function (world) {
        populateWorld(world);
        checkDumpSession(world);
    });

    Recyclabears.users.getInventory().then(function(data){
        inventory = data;
        populateItemMenu('tab_all');
    });
}

wbbInit(worldPageInit);

/*************************************************************************/
/********************* FUNCTIONS FOR POPULATING WORLD ********************/
/*************************************************************************/

function populateWorld(world) {
    console.log("HELLO WORLD!!!!");

    for (var item in worldItems) {
        // console.log(JSON.stringify(worldItems[item]));
        showInWorld(worldItems[item]);
    }
    for (var item in world.items) {
        var obj = world.items[item];
        obj.x = parseFloat(obj.x);
        obj.y = parseFloat(obj.y);
        showInWorldEditable(obj, false);
    }

    for (var i = 0; i < world.rubbish.length; i++) {
        displayRubbish(world, world.rubbish[i]);
    }

    console.log(rubbishList);
}

function saveWorld() {

    var saveBtn = $('.save-btn');
    saveBtn.text('Saving...');
    saveBtn.prop('disabled', true);

    // sanitize
    var updateList = [];
    for (var i = 0; i < itemList.length; i++) {
        var item = itemList[i];
        var copy = {};
        for (var k in item) {
            // put your list of keys to ignore here
            if (["div", "redraw"].indexOf(k) < 0) {
                copy[k] = item[k];
            }
        }
        updateList.push(copy);
    }
    //console.log(updateList);

    // If array empty, send "empty" string and update the user's world items to empty array
    var updateObj;
    if(updateList.length === 0){
        updateObj = { items: "empty" };
    } else {
        updateObj = { items: updateList };
    }
    Recyclabears.worlds.updateWorld('me', updateObj ).then(function () {
        saveBtn.text('Saved');

        function restore() {
           // saveBtn.text('Save');
            saveBtn.text('Edit');
            saveBtn.prop('disabled', false);
            saveBtn.attr('onclick', "editWorld()");
           // saveBtn.hide();

            $('.overlay').css({"display":"block"});
            $('.delete-img').css("visibility", "hidden");
        }

        setTimeout(restore, 1000);
    });
}

function showInWorld(obj) {
    var objDiv = document.createElement("div");
    objDiv.classList.add("item-in-world");
    if (obj.type == 'bin') {
        objDiv.classList.add(obj.bin_type);
    }
    objDiv.innerHTML += "<img src='" + obj.image + "'>";
    objDiv.style.left = obj.position_x;
    objDiv.style.top = obj.position_y;

    $('#world-container').append(objDiv);
}

/*************************************************************************/
/******************* FUNCTIONS FOR DUMPING NEW RUBBISH *******************/

/*************************************************************************/

function worldEdited() {
    // call this when u modify world state
    editWorld();
}

function editWorld() {
    console.log("Edit World clicked");
    var saveBtn = $('.save-btn');
    saveBtn.text("Save");
    saveBtn.attr("onclick", "saveWorld()");


    $('.overlay').css({"display":"none"});
    $('.delete-img').css("visibility", "visible");


}

function checkDumpSession(world) {
    console.log(world);

    var lastDumpSession = new Date(world.lastDump);
    // convert diff from msecs to secs (1000), secs to min (60), min to hrs (60)
    var diff = (new Date() - lastDumpSession) / 1000 / 60 / 60;
    // calculate rubbish amount, logarithmically increasing with time difference
    var rubbishAmt = Math.floor(Math.log2(diff)) * 2;

    console.log("time diff " + diff);
    console.log("adding rubbish " + rubbishAmt);

    // if negative rubbishAmt from log function, then not enough time has passed
    if (rubbishAmt <= 0) {
        return;
    }

    // If world already has too much rubbish, stop producing more
    // P/s cleaning up x50 rubbish is not fun -- but i'm richer nao
    if(world.rubbish.length >= 20){
        rubbishAmt = 0;
        console.log("World is super dirty, no more rubbish to be added for now");
    }

    produceRubbish(world, rubbishAmt);
}

function produceRubbish(world, amount) {
    console.log("producing rubbish")
    for (var i = 0; i < amount; i++) {
        var type_ind = Math.floor(Math.random() * 5);
        var rubbish_types = ['landfill', 'paper', 'glass', 'metal', 'plastic'];
        createRubbish(world, rubbish_types[type_ind]);
    }
    console.log("Dump!!");
    console.log("Current world:");
    console.log(world);
    Recyclabears.worlds.updateWorld(world.owner, world);
}

function createRubbish(world, type) {
    var objDiv = document.createElement("div");
    objDiv.id = "rubbish-" + nextRubbishIndex;
    nextRubbishIndex++;
    objDiv.setAttribute("class", "rubbish-to-move " + type);
    objDiv.style.left = Math.floor(Math.random() * 1000) + "px";
    objDiv.innerHTML = "<img src='/assets/images/rubbish/" + type + "/" + type + Math.floor(Math.random() * 3) + ".png'>";
    dragElement(objDiv);
    $('#world-container').append(objDiv);
    world.rubbish.push({
        name: type,
        x: objDiv.style.left,
        y: 69
    });
    rubbishList.push({
        name: type,
        x: objDiv.style.left,
        y: 69,
        id: objDiv.id
    });
}

function displayRubbish(world, rubbish) {
    var objDiv = document.createElement("div");
    objDiv.id = "rubbish-" + nextRubbishIndex;
    nextRubbishIndex++;
    objDiv.classList.add("rubbish-to-move", rubbish.name);
    objDiv.style.left = rubbish.x;
    objDiv.innerHTML = "<img src='/assets/images/rubbish/" + rubbish.name + "/" + rubbish.name + Math.floor(Math.random() * 3) + ".png'>";
    dragElement(objDiv);
    $('#world-container').append(objDiv);

    // New object, not just referencing
    var rubbish_obj = $.extend({}, rubbish);
    rubbish_obj.id = objDiv.id;
    rubbishList.push(rubbish_obj);
}

/* Get the index in rubbishList array of rubbish to be removed */
function indexOfRubbishList(findObjId){

    for(var i = 0; i < rubbishList.length; i++){
        if(findObjId !== rubbishList[i].id)
            continue;

        return i;
    }
    // -1 indicates object not found in rubbishList
    return -1;
}

/*************************************************************************/
/********************** FUNCTIONS FOR THE INVENTORY **********************/
/*************************************************************************/

function populateItemMenu(show_type) {
    console.log("Showing inventory");
    console.log(inventory);

    // Get the items_container element of the HTML and remove current items
    var items_container = document.getElementById("items-container");
    items_container.innerHTML = "";

    items_container.innerHTML += createItemTabs();

    // Get the type of items to be shown
    var add_item = 0;
    var new_item_HTML = "";

    // Show a message to indicate to users that there is nothing in inventory
    if(inventory.length == 0){

        items_container.innerHTML += "<div id='no-item'><p>No items in your inventory yet. Play quizzes and buy items!</p></div>";
    }

    // Loop over items from database and determine whether to display them based on user selection
    for (var i = 0; i < inventory.length; i++) {

        add_item = 0;
        new_item_HTML = "";

        // Determine whether to show the item
        if (show_type == "tab_all") {
            add_item = 1;
        } else if (show_type === "tab_plants") {
            if (inventory[i].type === "plant") {
                add_item = 1;
            }
        } else if (show_type === "tab_animals") {
            if (inventory[i].type === "animal") {
                add_item = 1;
            }
        } else if (show_type === "tab_bins") {
            if (inventory[i].type === "bin") {
                add_item = 1;
            }
        }

        // Add the HTML elements for the item if to be shown
        if (add_item == 1) {
            var functionName = "showInWorldEditable(" + JSON.stringify(inventory[i]) + "); checkItems(\""+inventory[i].name+"\")";
            new_item_HTML +=
                "<div class='item'>" +
                "<button id='inv-btn-" + i + "' class='item_desc' onclick='" + functionName + "'>" +
                "<img src='" + inventory[i].image + "' class='inv_item' >" +
                "<p>Name: <span class='name'>" + inventory[i].name + "</span></p>" +
                "<p>Placed: <span class='placed'>0</span> || Quantity: <span class='price'>" + inventory[i].quantity + "</span></p>" +
            "</button>" +
            "</div>";
        }

        items_container.innerHTML += new_item_HTML;
    }

    var worldDivHeight = document.getElementById('world-img').clientHeight;
    items_container.offsetHeight = worldDivHeight;
    items_container.style.height = worldDivHeight + 'px';
    items_container.clientHeight = worldDivHeight;
}

function createItemTabs() {
    var itemTabsHTML = '<button id="tab_all" class="tabs" onclick="populateItemMenu(this.id)">All</button>';
    itemTabsHTML += '<button id="tab_plants" class="tabs" onclick="populateItemMenu(this.id)">Plants</button>';
    itemTabsHTML += '<button id="tab_animals" class="tabs" onclick="populateItemMenu(this.id)">Animals</button>';
    itemTabsHTML += '<button id="tab_bins" class="tabs" onclick="populateItemMenu(this.id)">Bins</button>';
    return itemTabsHTML;
}

function getScaleFactors() {
    const ref = $('#world-img');
    return {
        x0: ref.offset().left,
        y0: ref.offset().top,
        mx: ref.width() / worldSize[0],
        my: ref.height() / worldSize[1]
    }
}

/* Store objects with original item data from db */
var itemList = [];

/* Store objects with original rubbish data from db,
   along with an extra property, id
   (for referencing purposes when removing rubbish) */
var rubbishList = [];
// Attach as id to the DOM element to allow referencing to rubbishList when needed
var nextRubbishIndex = 0;

function showInWorldEditable(obj, edit=true) {
    var sf = getScaleFactors();
    var size = (120 * sf.mx) + 'px';
    var gObj = {
        x: worldSize[0] / 2,
        y: worldSize[1] / 2,
        div: $('<div/>', {
            'class': 'item-to-move'
        }),
        redraw: function () {
            var sf = getScaleFactors();
            gObj.div.css('left', (sf.x0 + gObj.x * sf.mx) + 'px');
            gObj.div.css('top', (gObj.y * sf.my) + 'px');
        }
    };
    Object.assign(gObj, obj); // copies and replace gObj with whats in obj
    var delImg = $('<img/>', {
        src: '/assets/images/world/delete2.png',
        'class': 'delete-img',
        width: size,
        'style': 'visibility:hidden'
    });
    delImg.click(function () {
        gObj.div.remove();
        var i = itemList.indexOf(gObj);
        if (i >= 0) {
            itemList.splice(i, 1);
            //worldEdited();
        } else {
            console.log('ERROR cannot delete non-existent object');
        }
        // Updates the numbers in item menu and enable/disable item placement
        checkItems(gObj.name);
    });
    var objImg = $('<img/>', {
        src: gObj.image,
        width: size,
        // used for keeping track of how many items of this type have been placed on world
        alt: gObj.name
    });
    gObj.div.append(delImg, objImg);
    dragElement2(gObj);
    gObj.redraw();
    $('#world-container').append(gObj.div);
    itemList.push(gObj);
    if (edit) worldEdited();

}

function deleteDiv(obj) {
    console.log(obj.id);
    obj.remove();
}


function checkItems(itemName){
    console.log("In check Items");

    // find how many items of this type has been placed on world
    var onWorld = $('img[alt="' + itemName + '"]').toArray().length;
    console.log(onWorld);

    // find the matching item in the inventory list
    for(var i = 0; i < inventory.length; i++){
        if(itemName === inventory[i].name){
            // get the HTML button of this item from item menu
            var button = $('#inv-btn-' + i);

            // update how many items have been placed
            $(button).find("span.placed").html(onWorld);

            // check the quantity of item in inventory, and enable/disable accordingly
            if(onWorld >= inventory[i].quantity){
                console.log("Over!!");
               button.attr("disabled", true);
            } else {
                button.attr("disabled", false);
            }
        }
    }
}

/*************************************************************************/
/****************** FUNCTIONS FOR DRAG AND DROP ELEMENTS *****************/

/*************************************************************************/
function dragElement2(obj) {
    // for OOP and not DOM, obj.div to get the div container
    var cx, cy, dx, dy; // client pos, delta pos
    obj.div.mousedown(function (e) {
        e = e || window.event;
        cx = e.clientX;
        cy = e.clientY;
        $(window).mousemove(drag);
        $(window).mouseup(closeDrag);
    });

    function drag(e) {
        var sf = getScaleFactors();
        e = e || window.event;
        obj.x += (e.clientX - cx) / sf.mx;
        obj.y += (e.clientY - cy) / sf.my;
        cx = e.clientX;
        cy = e.clientY;
        obj.redraw();
       // worldEdited();
    }

    function closeDrag(e) {
        $(window).off('mousemove');
        $(window).off('mouseup');
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

        if (elmnt.classList.contains('rubbish-to-move')) {
            if (elmnt.classList.contains('landfill')) {
                checkCollision(elmnt, document.getElementsByClassName("landfill-bin"));
                console.log("i am landfill")
            }
            else if (elmnt.classList.contains('paper')) {
                checkCollision(elmnt, document.getElementsByClassName("paper-bin"));
                console.log("i am paper")
            }
            else if (elmnt.classList.contains('glass')) {
                checkCollision(elmnt, document.getElementsByClassName("glass-bin"));
                console.log("i am glass")
            }
            else if (elmnt.classList.contains('metal')) {
                checkCollision(elmnt, document.getElementsByClassName("metal-bin"));
                console.log("i am metal")
            }
            else if (elmnt.classList.contains('plastic')) {
                checkCollision(elmnt, document.getElementsByClassName("plastic-bin"));
                console.log("i am plastic")
            }
        }
    }
}

function checkCollision(dom, bins) {
    for (var i = 0; i < bins.length; i++) {
        if (collide(dom, bins[i])) {
            console.log("collide");

            // DOM id used as identifier for finding position in rubbishList array
            var obj_id_to_remove = dom.id;
            var removed_index = indexOfRubbishList(obj_id_to_remove);
            console.log("Found index: " + removed_index);

            if(removed_index >= 0){
                rubbishList.splice(removed_index, 1);
                console.log("Updated: Rubbish List");
                console.log(rubbishList);


                // sanitize rubbish list
                var updateRubbishList = [];
                for (var i = 0; i < rubbishList.length; i++) {
                    var rubbish = rubbishList[i];
                    var copy = {};
                    for (var k in rubbish) {
                        // put your list of keys to ignore here
                        if (["id"].indexOf(k) < 0) {
                            copy[k] = rubbish[k];
                        }
                    }
                    updateRubbishList.push(copy);
                }


                // If array empty, send "empty" string and update the user's world rubbish to empty array
                var send_obj;
                if(updateRubbishList.length === 0){
                    send_obj = { rubbish: "empty" };
                } else {
                    send_obj = { rubbish: updateRubbishList };
                }

                Recyclabears.worlds.updateWorld('me',send_obj).then(function(){
                    console.log("Removed rubbish!");
                }).catch (function(error){
                    console.log(error);
                });


                // Update wallet
                Recyclabears.users.updateWallet("add", 1);

            } else {
                console.log('ERROR cannot delete non-existent rubbish!');
            }

            // Remove the object from view
            dom.remove();
        }
    }
}


function collide(dom, obj) {
    var dom_top_left = [parseInt(dom.style.left, 10), parseInt(dom.style.top, 10)];
    var dom_top_right = [parseInt(dom.style.left, 10) + dom.offsetWidth, parseInt(dom.style.top, 10)];
    var dom_bot_left = [parseInt(dom.style.left, 10), parseInt(dom.style.top, 10) + dom.offsetHeight];
    var dom_bot_right = [parseInt(dom.style.left, 10) + dom.offsetWidth, parseInt(dom.style.top, 10) + dom.offsetHeight];

    var obj_left = parseInt(obj.style.left, 10);
    var obj_right = obj_left + obj.offsetWidth;
    var obj_top = parseInt(obj.style.top, 10);
    var obj_bottom = obj_top + obj.offsetHeight;
    var obj = [obj_left, obj_right, obj_top, obj_bottom];

    if (overlap(dom_top_left, obj) || overlap(dom_top_right, obj) ||
        overlap(dom_bot_left, obj) || overlap(dom_bot_right, obj)) {
        return true;
    }
    return false;
}

function overlap(point, obj) {
   // console.log("point " + point);
    //console.log("obj " + obj);
    // obj = coords as follows [left, right, top, bottom]
    if (obj[0] <= point[0] && point[0] <= obj[1] &&
        obj[2] <= point[1] && point[1] <= obj[3]) {
        return true;
    }
    return false;
}