function generateFriends(){
    var friends = [];
    var name;
    var score;
    var photo;
    var id;
    var isFriend;

    for (var i = 0; i < 10; i++) {
        name = "User " + i;
        score = 1000 - i * 100;
        photo = "/assets/images/rank/user.png";
        id = i;
        isFriend = i%3; // 0 - friend, 1 - not friend, 2 - request sent

        friends[i] = {
            name: name,
            score: score,
            photo: photo,
            id: id,
            isFriend: isFriend
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
    console.log("loadrank called!");

    for(var i=0; i<friends.length; i++){
        var rankDiv = document.createElement("div");
        rankDiv.setAttribute("class", "rank");
        rankDiv.setAttribute("onclick", "openProfile(" + friends[i].id + ")");

        rankDiv.innerHTML = "<img src=\"" + friends[i].photo + "\">";
        rankDiv.innerHTML += "<span class=\"name\">" + friends[i].name + "</span>";
        rankDiv.innerHTML += "<span class=\"score\">" + friends[i].score + "</span>";
        rankDiv.innerHTML += "<button>X</button>";

        rankListDiv.appendChild(rankDiv);
    }

}

function openProfile(id){
    var overlay = document.getElementById("overlay");
    var popup = document.getElementById("pop-up");
    overlay.style.display = "block";
    popup.style.display = "block";
    popup.innerHTML = "";

    var friend = getFriend(id);
    var profileDiv = document.createElement("div")
    profileDiv.setAttribute("class", "grid-container");
    profileDiv.id = 'profile';

    var friendActionButton = document.createElement("button");
    friendActionButton.setAttribute("id", "friend-action");
    friendActionButton.setAttribute("class", "right-orange-button");
    if (friend.isFriend == 0){
        friendActionButton.setAttribute("onclick", "unfriend(" + JSON.stringify(friend) + ")");
        friendActionButton.innerHTML = 'Unfriend';
    }
    else if(friend.isFriend == 1){
        friendActionButton.setAttribute("onclick", "addFriend(" + id + ")");
        friendActionButton.innerHTML = 'Add Friend';
    }
    else{
        friendActionButton.setAttribute("onclick", "cancelRequest(" + id + ")");
        friendActionButton.innerHTML = 'Cancel Request';
    }
    profileDiv.appendChild(friendActionButton);

    var profileHTML = "<img id='profile-photo' src='" + friend.photo + "'>";
    profileHTML += "<span class='name'>" + friend.name + "</span>";
    profileHTML += "<span class='score'>" + friend.score + "</span>";
    profileHTML += "<button id='visit-world' class='left-green-button' onclick=''>Visit World</button>";
    profileHTML += "<button id='close' onclick='closeProfile()'>Close</button>";

    profileDiv.innerHTML += profileHTML;
    popup.appendChild(profileDiv);

}

function closeProfile(){
    var overlay = document.getElementById("overlay");
    var popup = document.getElementById("pop-up");
    overlay.style.display = "none";
    popup.style.display = "none";
}

function addFriend(id){
    var friendButton = document.getElementById('friend-action');
    friendButton.setAttribute('onclick', 'cancelRequest('+id+')');
    friendButton.innerHTML = "Cancel Request";
}

function cancelRequest(id){
    var friendButton = document.getElementById('friend-action');
    friendButton.setAttribute('onclick', 'addFriend('+id+')');
    friendButton.innerHTML = "Add Friend";
}

function unfriend(friend){
    var popup = document.getElementById("pop-up");
    var profileHTML = "<div id='profile' class='grid-container'>";
    profileHTML += "<img id='profile-photo' src='" + friend.photo + "'>";
    profileHTML += "<span class='name'>Are you sure you would like to delete " + friend.name + "?</span>";
    var functionName = "sendUnfriend(" + friend.id + ")"
    profileHTML += "<button class='left-green-button' onclick=" + functionName + ">Yes</button>";
    functionName = "openProfile(" + friend.id + ")"
    profileHTML += "<button class='right-orange-button' onclick=" + functionName + ">No</button>";
    profileHTML += "</div>";

    popup.innerHTML = profileHTML;
}

function sendUnfriend(id){
    // call db to unfriend
    openProfile(id);
}