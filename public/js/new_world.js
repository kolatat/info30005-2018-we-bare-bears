window.onresize = onResize;

const worldSize = [1122, 626];

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
}

/*************************************************************************/
/******************************* TEST DATA *******************************/
/*************************************************************************/

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
        bin_type: "paper",
        price: 10,
        image: "/assets/images/items/yellow_bin.png",
        description: "A bin that looks like it is made for disposing paper."
    },
    {
        name: "Red Bin",
        type: "bin",
        bin_type: "plastic",
        price: 10,
        image: "/assets/images/items/red_bin.png",
        description: "A bin that looks like it is made for disposing plastic."
    },
    {
        name: "Blue Bin",
        type: "bin",
        bin_type: "metal",
        price: 10,
        image: "/assets/images/items/blue_bin.png",
        description: "A bin that looks like it is made for disposing metal."
    },
    {
        name: "Green Bin",
        type: "bin",
        bin_type: "glass",
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
    }
];

var lastDumpSession = new Date("2018-05-15T12:00:00+10:00");

function worldPageInit() {
    populateItemMenu('tab_all');
    Recyclabears.worlds.getWorld().then(function (world) {
        populateWorld(world);
        checkDumpSession(world);
    });
}

wbbInit(worldPageInit);

/*************************************************************************/
/********************* FUNCTIONS FOR POPULATING WORLD ********************/

/*************************************************************************/

function populateWorld(world) {
    // TODO populate world based on rubbish in world.rubbish array
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
}

function saveWorld() {
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
    var saveBtn = $('.save-btn');
    saveBtn.text('Saving...');
    saveBtn.prop('disabled', true);
    Recyclabears.worlds.updateWorld('me', {
        items: updateList
    }).then(function () {
        saveBtn.text('Saved');

        function restore() {
            saveBtn.text('Save');
            saveBtn.prop('disabled', false);
            saveBtn.hide();
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

    document.getElementsByTagName('body')[0].appendChild(objDiv);
}

/*************************************************************************/
/******************* FUNCTIONS FOR DUMPING NEW RUBBISH *******************/

/*************************************************************************/

function worldEdited() {
    // call this when u modify world state
    $('button.save-btn').show();
}

function checkDumpSession(world) {
    var currDateLessThanHr = new Date("2018-05-15T12:30:00+10:00");
    var currDateTwoHrs = new Date("2018-05-15T14:00:00+10:00");
    var currDateEightHrs = new Date("2018-05-15T20:00:00+10:00");
    var currDate24Hrs = new Date("2018-05-16T12:00:00+10:00");
    var currDate3Mos = new Date("2018-08-15T12:00:00+10:00");

    lastDumpSession = new Date(world.lastDump);

    // convert diff from msecs to secs (1000), secs to min (60), min to hrs (60)
    // var diff = (currDateLessThanHr - lastDumpSession)/1000/60/60;
    // var diff = (currDateTwoHrs - lastDumpSession)/1000/60/60;
    // var diff = (currDateEightHrs - lastDumpSession)/1000/60/60;
    var diff = (new Date() - lastDumpSession) / 1000 / 60 / 60;
    // var diff = (currDate3Mos - lastDumpSession)/1000/60/60;

    // calculate rubbish amount, logarithmically increasing with time difference
    var rubbishAmt = Math.floor(Math.log2(diff)) * 2;

    console.log("time diff " + diff);
    console.log("adding rubbish " + rubbishAmt);

    for (var i = 0; i < world.rubbish.length; i++) {
        var type_ind = world.rubbish[i].type;
        // rubbish is pree dirty in there now HA GET iT??
        // no :(
        // so might not contain .type
        if (!type_ind) continue;
        displayRubbish(world, world.rubbish[i]);
    }

    // if negative rubbishAmt from log function, then not enough time has passed
    if (rubbishAmt <= 0) {
        return;
    }

    produceRubbish(world, rubbishAmt);
    lastDumpSession = new Date();
}

function produceRubbish(world, amount) {
    console.log("producing rubbish")
    for (var i = 0; i < amount; i++) {
        var type_ind = Math.floor(Math.random() * 5);
        var rubbish_types = ['landfill', 'paper', 'glass', 'metal', 'plastic'];
        createRubbish(world, rubbish_types[type_ind]);
    }
    console.log("Dump!!");
    Recyclabears.worlds.updateWorld(world.owner, world);
}

function createRubbish(world, type) {
    var objDiv = document.createElement("div");
    objDiv.setAttribute("class", "rubbish-to-move " + type);
    objDiv.style.left = Math.floor(Math.random() * 1000) + "px";
    objDiv.innerHTML = "<img src='/assets/images/rubbish/" + type + "/" + type + Math.floor(Math.random() * 3) + ".png'>";
    dragElement(objDiv);
    document.getElementsByTagName('body')[0].appendChild(objDiv);
    world.rubbish.push({
        name: type,
        x: objDiv.style.left,
        y: 69
    });
}

function displayRubbish(world, rubbish) {
    // console.log(rubbish);
    var objDiv = document.createElement("div");
    objDiv.classList.add("rubbish-to-move", rubbish.type);
    objDiv.style.left = rubbish.x;
    objDiv.innerHTML = "<img src='/assets/images/rubbish/" + rubbish.type + "/" + rubbish.type + Math.floor(Math.random() * 3) + ".png'>";
    dragElement(objDiv);
    document.body.appendChild(objDiv);
}

/*************************************************************************/
/********************** FUNCTIONS FOR THE INVENTORY **********************/

/*************************************************************************/

function populateItemMenu(show_type) {

    // Get the items_container element of the HTML and remove current items
    var items_container = document.getElementById("items-container");
    items_container.innerHTML = "";

    items_container.innerHTML += createItemTabs();

    // Get the type of items to be shown
    var add_item = 0;
    var new_item_HTML = "";

    // Loop over items from database and determine whether to display them based on user selection
    for (var i = 0; i < testItemList.length; i++) {

        add_item = 0;
        new_item_HTML = "";

        // Determine whether to show the item
        if (show_type == "tab_all") {
            add_item = 1;
        } else if (show_type === "tab_plants") {
            if (testItemList[i].type === "plant") {
                add_item = 1;
            }
        } else if (show_type === "tab_animals") {
            if (testItemList[i].type === "animal") {
                add_item = 1;
            }
        } else if (show_type === "tab_bins") {
            if (testItemList[i].type === "bin") {
                add_item = 1;
            }
        }

        // Add the HTML elements for the item if to be shown
        if (add_item == 1) {
            var functionName = "showInWorldEditable(" + JSON.stringify(testItemList[i]) + ")";
            new_item_HTML +=
                "<div class='item'>" +
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

var itemList = [];

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
        width: size
    });
    delImg.click(function () {
        gObj.div.remove();
        var i = itemList.indexOf(gObj);
        if (i >= 0) {
            itemList.splice(i, 1);
            worldEdited();
        } else {
            console.log('ERROR cannot delete non-existent object');
        }
    });
    var objImg = $('<img/>', {
        src: gObj.image,
        width: size
    });
    gObj.div.append(delImg, objImg);
    dragElement2(gObj);
    gObj.redraw();
    $('#world-container').append(gObj.div);
    itemList.push(gObj);
    if (edit) worldEdited();
    return;

    var objDiv = document.createElement("div");
    objDiv.setAttribute("class", "item-to-move");
    objDiv.innerHTML = "<img src='/assets/images/world/delete2.png' class='delete-img' onclick='deleteDiv(this.parentNode)'>";
    objDiv.innerHTML += "<img src='" + obj.image + "'>";

    dragElement(objDiv);
    document.getElementsByTagName('body')[0].appendChild(objDiv);
}

function deleteDiv(obj) {
    console.log(obj.id);
    obj.remove();
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
        worldEdited();
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
    console.log("point " + point);
    console.log("obj " + obj);
    // obj = coords as follows [left, right, top, bottom]
    if (obj[0] <= point[0] && point[0] <= obj[1] &&
        obj[2] <= point[1] && point[1] <= obj[3]) {
        return true;
    }
    return false;
}