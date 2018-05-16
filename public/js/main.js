/* should be last script in head */

var firstTime = true;

var appId;

function getAppId(save) {
    var request = new XMLHttpRequest();
    request.open('GET', '/config/fbAppId', false);
    request.send(null);
    if (request.status === 200) {
        if (save) {
            sessionStorage.setItem('fbAppId', request.responseText);
        }
        return request.responseText;
    }
    alert('Error reading config.');
}

if (typeof(Storage) !== "undefined") {
    appId = sessionStorage.getItem('fbAppId');
    if (appId == null) {
        appId = getAppId(true);
    }
} else {
    appId = getAppId(false);
}

window.fbAsyncInit = function () {
    FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v3.0'
    });
    FB.AppEvents.logPageView();
    // FB.getLoginStatus(statusChangeCallback);
    // mock facebook callback
    getLoginStatus(statusChangeCallback);
};

function getLoginStatus(callback) {
    if (typeof(Storage) !== "undefined") {
        var sess_auth = sessionStorage.getItem('fbAuth');
        if (sess_auth != null) {
            sess_auth = JSON.parse(sess_auth);
            if (new Date() < new Date(sess_auth.expiresAt)) {
                console.log('HIT login status');
                callback(sess_auth);
                return;
            } else {
                console.log('STALE login status');
            }
        }
        FB.getLoginStatus(function (response) {
            if (response.status == 'connected') {
                response.expiresAt = new Date(new Date().getTime() + response.authResponse.expiresIn * 500);
                sessionStorage.setItem('fbAuth', JSON.stringify(response));
            }
            callback(response);
        });
    } else {
        // do it the old hard way
        FB.getLoginStatus(callback);
    }
}

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

var wbbInitList = [];

function wbbInit(callback) {
    if (firstTime) {
        console.log("queued initializer " + callback.name);
        wbbInitList.push(callback);
    } else {
        console.log("past initialization time, directly invoking " + callback.name);
        setTimeout(callback, 0);
    }
}

function statusChangeCallback(response) {
    // console.log(response);
    if (response.status != 'connected') {
        window.location = '/login/';
    }
    Recyclabears.__fbAuth = response;
    if (firstTime) {
        firstTime = false;
        for (var i = 0; i < wbbInitList.length; i++) {
            wbbInitList[i]();
        }
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
    loginId: function () {
        return Recyclabears.__fbAuth.authResponse.userID;
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
        getInventory: function () {
            return Recyclabears.users.me().then(function (me) {
                if (me.inventory) {
                    return me.inventory;
                } else {
                    return [];
                }
            });
        },
        updateInventory: function (newInv) {
            if (Array.isArray(newInv)) {
                return Recyclabears.__apiCall('PUT', '/me/inventory', newInv);
            } else {
                console.log('WARNING Recyclabears.users.updateInventory expects Array, ' + typeof(newInv) + ' given.');
            }
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
        deleteSentFriendRequest: function (fbId) {
            return Recyclabears.__apiCall('DELETE', '/api/users/me/sent-requests/' + fbId);
        },
        deleteFriendRequest: function (fbId) {
            return Recyclabears.__apiCall('DELETE', '/api/users/me/requests/' + fbId);
        },
        unFriend: function (fbId) {
            return Recyclabears.__apiCall('DELETE', '/api/users/me/friends/' + fbId);
        },
        getUserDpUrl: function (fbId=Recyclabears.loginId()) {
            /*if(fbId==null){
                fbId=Recyclabears.loginId();
            }
            console.log("finding profile photo of " + fbId);*/
            return "https://graph.facebook.com/v3.0/"
                + fbId
                + "/picture?type=large&access_token="
                + Recyclabears.__fbAuth.authResponse.accessToken;
        },


        /* New calls below */
        updateWallet: function (action, value) {
            return Recyclabears.__apiCall('PUT', '/api/users/me/wallet', {
                action: action,
                value: value
            });
        }
    },
    worlds: {
        getWorld: function (fbId='me') {
            return Recyclabears.__apiCall('GET', '/api/worlds/' + fbId);
        },
        updateWorld: function (fbId='me', update) {
            return Recyclabears.__apiCall('PUT', '/api/worlds/' + fbId, update);
        }
    }
};