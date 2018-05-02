

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



// $(document).ready(function() {
//     $.get('/new/play/', {'id': obj})
//         .done(function (data) {
//             popup.html(data);
//         });
// }
