function generateFriends() {
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
        isFriend = i % 3; // 0 - friend, 1 - request received, 2 - request sent

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
        if (friends[i].id == id) {
            return friends[i];
        }
    }
    return null;
}

function loadRank() {
    Recyclabears.users.me().then(function (data) {
        var friends = data.friends.list;
        var requests_received = data.friends.reqReceived;
        var requests_sent = data.friends.reqSent;

        /*console.log("loadrank called!");
        console.log(data);
        console.log(data.friends);
        console.log(friends);
        console.log(requests_sent);
        console.log(requests_received);*/

        populateWithUsers(document.getElementById('rank-list'), friends);
        populateWithUsers(document.getElementById('req-received'), requests_received);
        populateWithUsers(document.getElementById('req-sent'), requests_sent);

        return 'done';
    });


}

function populateWithUsers(div, friends){
    if (friends.length <= 0)
        return;

    console.log("populating with users");
    div.innerHTML = "";

    var isFriend = 0;
    if (div.id == 'rank-list'){
        div.innerHTML += "<span class='user-div-title'>Friends</span>";
    }
    if (div.id == 'req-received'){
        div.innerHTML += "<span class='user-div-title'>Received Requests</span>";
        isFriend = 1;
    }
    else if(div.id == 'req-sent'){
        div.innerHTML += "<span class='user-div-title'>Sent Requests</span>";
        isFriend = 2
    }

    for (var i = 0; i < friends.length; i++) {
        Recyclabears.users.getUserByFbId(friends[i]).then(function (data) {
            console.log(data)
            data.isFriend = isFriend;
            var rankDiv = document.createElement("div");
            rankDiv.setAttribute("class", "rank");
            rankDiv.innerHTML = "<img src=\"" + Recyclabears.users.getUserDpUrl(friends[i]) + "\">";
            var nameSpan = document.createElement("span");
            nameSpan.setAttribute("class", "name");
            nameSpan.setAttribute("onclick", "openProfile(" + JSON.stringify(data) + ")");
            nameSpan.innerHTML = data.name;
            rankDiv.appendChild(nameSpan);
            rankDiv.innerHTML += "<span class=\"score\">" + data.wallet + "</span>";
            div.appendChild(rankDiv);
        });
    }

}

function openProfile(friend) {
    var overlay = document.getElementById("overlay");
    var popup = document.getElementById("pop-up");
    overlay.style.display = "block";
    popup.style.display = "block";
    popup.innerHTML = "";

    var profileDiv = document.createElement("div")
    profileDiv.setAttribute("class", "grid-container");
    profileDiv.id = 'profile';

    var friendActionButton = document.createElement("button");
    friendActionButton.setAttribute("id", "friend-action");
    friendActionButton.setAttribute("class", "right-orange-button");
    if (friend.isFriend == 0) {
        friendActionButton.setAttribute("onclick", "unfriend(" + JSON.stringify(friend) + ")");
        friendActionButton.innerHTML = 'Unfriend';
        profileDiv.appendChild(friendActionButton);
    }
    else if (friend.isFriend == 1) {
        friendActionButton.setAttribute("onclick", "deleteRequestReceived(" + friend.fbId + ")");
        friendActionButton.innerHTML = 'Decline';
        profileDiv.appendChild(friendActionButton);
    }
    else {
        friendActionButton.setAttribute("onclick", "cancelRequest(" + friend.fbId + ")");
        friendActionButton.innerHTML = 'Cancel Request';
        profileDiv.appendChild(friendActionButton);
    }

    var profileHTML = "<img id='profile-photo' src='" + "/assets/images/rank/user.png" + "'>";
    profileHTML += "<span class='name'>" + friend.name + "</span>";
    profileHTML += "<span class='score'>" + friend.wallet + "</span>";

    if (friend.isFriend == 0) {
        profileHTML += "<button id='visit-world' class='left-green-button' onclick=''>Visit World</button>";
    }
    else if (friend.isFriend == 1) {
        var functionName = "acceptRequest(" + friend.fbId + ")";
        profileHTML += "<button onclick=" + functionName + " class='left-green-button' onclick=''>Accept</button>";
    }

    profileHTML += "<button id='close' onclick='closeProfile()'>Close</button>";

    profileDiv.innerHTML += profileHTML;
    popup.appendChild(profileDiv);

}

function closeProfile() {
    var overlay = document.getElementById("overlay");
    var popup = document.getElementById("pop-up");
    overlay.style.display = "none";
    popup.style.display = "none";
}

function acceptRequest(id) {
    Recyclabears.users.acceptFriendRequest(id).then(function (data) {
        console.log(data);
        closeProfile();
        loadRank();
    });
}

function deleteRequestReceived(id) {
    Recyclabears.users.deleteFriendRequest(id).then(function (data) {
        console.log(data);
        closeProfile();
        loadRank();
    });
}

function cancelRequest(id) {
    Recyclabears.users.deleteSentFriendRequest(id).then(function (data) {
        console.log(data);
        closeProfile();
        loadRank();
    });
}

function unfriend(friend) {
    var popup = document.getElementById("pop-up");
    var profileHTML = "<div id='profile' class='grid-container'>";
    profileHTML += "<img id='profile-photo' src='" + "/assets/images/rank/user.png" + "'>";
    profileHTML += "<span class='name'>Are you sure you would like to delete " + friend.name + "?</span>";
    var functionName = "sendUnfriend(" + friend.fbId + ")";
    profileHTML += "<button class='left-green-button' onclick=" + functionName + ">Yes</button>";
    functionName = "closeProfile()";
    profileHTML += "<button class='right-orange-button' onclick=" + functionName + ">No</button>";
    profileHTML += "</div>";

    popup.innerHTML = profileHTML;
}

function sendUnfriend(id) {
    console.log(id);
    Recyclabears.users.unFriend(id).then(function (data) {
        closeProfile();
        loadRank();
    })
}

wbbInit(loadRank);

function showFriendsDialog() {
    FB.ui({
        method: 'apprequests',
        message: 'Add friends'
    }, friendsDialogCallback);
}

function friendsDialogCallback(res) {
    console.log(res.to);
    for (var i = 0; i < res.to.length; i++) {
        Recyclabears.users.sendFriendRequest(res.to[i]);
    }
    loadRank();
}