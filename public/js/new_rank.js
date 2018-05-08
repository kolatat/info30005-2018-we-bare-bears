

function generateFriends(){
    var friends = [];
    var name;
    var score;
    var photo;
    var id;

    for (var i = 0; i < 10; i++) {
        name = "User " + i;
        score = 1000 - i * 100;
        photo = "/assets/images/rank/user.png";
        id = i;

        friends[i] = {
            name: name,
            score: score,
            photo: photo,
            id: id
        };
    }

    return friends;
}

function getFriend(id) {
    var friends = generateFriends();
    for (var i = 0; i < 10; i++) {
        if (friends[i].id == id){
            return friends[i];
        }
    }
    return null;
}

function loadRank(){
    var friends = generateFriends();
    var rankListDiv = document.getElementById("rank-list");
    console.log("loadrank called!")

    for(var i=0; i<friends.length; i++){
        var rankDiv = document.createElement("div");
        rankDiv.setAttribute("class", "rank");
        rankDiv.setAttribute("onclick", "openProfile(" + friends[i].id + ")");

        rankDiv.innerHTML = "<img src=\"" + friends[i].photo + "\">";
        rankDiv.innerHTML += "<span class=\"name\">" + friends[i].name + "</span>";
        rankDiv.innerHTML += "<span class=\"score\">" + friends[i].score + "</span>";
        rankDiv.innerHTML += "<button>X</button>"

        rankListDiv.appendChild(rankDiv);
    }

}

function openProfile(obj){
    //Set a variable to contain the DOM element of the overlay
    var overlay = document.getElementById("overlay");
    //Set a variable to contain the DOM element of the popup
    var popup = document.getElementById("selected-profile");
    // Toggle visibility of overlay and popup
    if(overlay.style.display === "none" || overlay.style.display === "") {
        // popup.innerHTML = createProfile(obj);
        overlay.style.display = "block";
        popup.style.display = "block";

        // client.get('/new/profile/?id='+obj, function(response) {
        //     popup.html = response;
        // });
        popup.innerHTML = httpGet('/new/profile/'+obj);

    }
}

function closeProfile(){
    var overlay = document.getElementById("overlay");
    var popup = document.getElementById("selected-profile");
    overlay.style.display = "none";
    popup.style.display = "none";
}

function createProfile(obj){
    var string = "<p>" + obj + "</p>";
    string += "<button onclick='closeProfile()'>X</button>";
    return string;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}