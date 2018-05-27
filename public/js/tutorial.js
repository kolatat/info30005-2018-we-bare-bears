function getTutorialPage(page){
    document.getElementById("overlay-tutorial").style.display = "block";

    var tutorialDiv = document.getElementById("tutorial");
    tutorialDiv.style.display = "grid";
    tutorialDiv.innerHTML = "";
    if(page == 0){
        tutorialDiv.innerHTML += "<h2>World</h2><p>This is where you decorate your house with items and clean up rubbish.</p>";
    }
    if(page == 1){
        tutorialDiv.innerHTML += "<h2>Play</h2><p>This is where you can play quizzes and earn honey pots to buy items with.</p>";
    }
    if(page == 2){
        tutorialDiv.innerHTML += "<h2>Learn</h2><p>This is where you can learn extra information on recycling.</p>";
    }
    if(page == 3){
        tutorialDiv.innerHTML += "<h2>Friends</h2><p>This is where you add your friends and visit their worlds.</p>";
    }
    if(page == 4){
        tutorialDiv.innerHTML += "<h2>Shop</h2><p>This is where you can buy items for your world with your honey pots.</p>";
    }
    tutorialDiv.innerHTML += getPrevNextButtons(page);
    highlightNav(page);
}

function getPrevNextButtons(page){
    var buttonsHTML = "";
    if(page - 1 >= 0){
        buttonsHTML += "<button class='left-green-button' onclick='getTutorialPage(" + (page - 1) + ")'>Previous</button>";
    }
    else{
        buttonsHTML += "<button class='grayed-button'>Previous</button>";
    }
    if(page + 1 <= 4){
        buttonsHTML += "<button class='left-green-button' onclick='getTutorialPage(" + (page + 1) + ")'>Next</button>";
    }
    else{
        buttonsHTML += "<button class='right-orange-button' onclick='closeWelcome()'>Close</button>";
    }
    return buttonsHTML;
}

function highlightNav(index){
    var navNodes = document.getElementById("navigation").getElementsByTagName("a");
    document.getElementById("navigation").style.zIndex = "500";
    for(var i = 0; i < navNodes.length; i++) {
        if (i == index){
            navNodes[i].style.background = "#FCE185";
            navNodes[i].style.borderRadius = "10px";

        }
        else{
            navNodes[i].style.background = "none";
            navNodes[i].style.borderRadius = "0px";
        }
    }
}

function closeWelcome() {
    document.getElementById("tutorial").style.display = 'none';
    document.getElementById("overlay-tutorial").style.display = "none";
    highlightNav(-1);
    document.getElementById("navigation").style.zIndex = "200";
    Recyclabears.users.completeTutorial();
}


