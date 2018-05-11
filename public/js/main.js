/* should be last script in head */

var firstTime = true;

window.fbAsyncInit = function () {
    FB.init({
        appId: '590373231339046',
        cookie: true,
        xfbml: true,
        version: 'v3.0'
    });
    FB.AppEvents.logPageView();
    FB.getLoginStatus(statusChangeCallback);

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_AU/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
    // console.log(response);
    if (response.status != 'connected') {
        window.location = '/login/';
    }
    Recyclabears.__fbAuth = response;
    if (firstTime) {
        firstTime = false;
        if (wbbInit != null && wbbInit != undefined) {
            wbbInit();
        }
    }
}

function wbbInit() {

    // Code in header.js -- updates the strings that should show the user's waller amount
    updatePrice();
    if(document.title == "Recylabears | Rank"){
        loadRank();
    }

    // Code in new_play.js -- allow user to start playing once initialising is complete
    // - Prevent authAccess undefined problem
    try{
        enablePlayPage();
    } catch(err){
        console.log("Not on Play Page");
    }

}

var Recyclabears = {
    __fbAuth: null,
    __apiCall: function (method, url, data) {
        var config = {
            dataType: 'json',
            type: method,
            url: url,
            headers: {
                Authorization: 'Facebook ' + Recyclabears.__fbAuth.authResponse.accessToken
            }
        };
        if (data != null) {
            config.data = data;
        }
        return $.ajax(config);
    },
    questions: {
        getRandomQuestion: function (howMany) {
            req = {
                n: howMany || 1
            };
            return Recyclabears.__apiCall('GET', '/api/questions/random', req);
        },
        answerQuestion: function (qid, answer) {
            req = {
                qid: qid,
                ans: answer
            };
            // TODO add API endpoint to update list of answered questions and user score


        },
        addQuestion: function (data) {
            return Recyclabears.__apiCall('POST', '/api/questions', data);
        },


        /* Coz I accidently modified a bunch of questions and had to remove them ;( ....  */
        deleteQuestion: function(qid) {
            return Recyclabears.__apiCall('DELETE', '/api/questions/' +qid);
        },
        getQuestion: function (qid) {
            return Recyclabears.__apiCall('GET', '/api/questions/testQuery');
        }


    },
    users: {
        me: function () {
            return Recyclabears.__apiCall('GET', '/api/users/me');
        },
        getUserByFbId: function (fbId) {
            return Recyclabears.__apiCall('GET', '/api/users/' + fbId);
        },
        getFriendRequests: function () {
            return Recyclabears.__apiCall('GET', '/api/users/me/requests');
        },
        acceptFriendRequest: function (fbId) {
            return Recyclabears.__apiCall('PUT', '/api/users/me/requests/' + fbId, {
                action: 'accept'
            });
        },
        sendFriendRequest: function (fbId) {
            return Recyclabears.__apiCall('POST', '/api/users/' + fbId + '/request');
        },
        deleteFriendRequest: function (fbId) {
            return Recyclabears.__apiCall('DELETE', '/api/users/me/requests/' + fbId);
        },
        unFriend: function(fbId) {
            return Recyclabears.__apiCall('DELETE', '/api/users/me/friends/' + fbId);
        },


        /* New calls below */
        updateWallet: function(action, value){

            return Recyclabears.__apiCall('PUT', '/api/users/me/wallet/', {
                action: action,
                value: value
            });
        }
    }
}