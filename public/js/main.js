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
                answer: answer
            };
            // TODO add API endpoint to update list of answered questions and user score

            // To be modified??
            Recyclabears.__apiCall('GET', '/api/questions/' + qid).then(function(data){
                var answer_obj = {
                    question: data.question,
                    correct: false
                };
                if(data.type === "multiple=choice"){
                    if(data.answers.correct === answer){
                        answer_obj.correct = true;
                        answer_obj.answer = data.answers.correct;
                        answer_obj.type = "mult";
                    }
                } else if(data.type === "fill-in-the-blanks"){
                    if(data.answers === answer){
                        answer_obj.correct = true;
                        answer_obj.type = "blanks";
                    }
                }


                // add honey pots if ans true
                if(answer_obj.correct == true){
                    req = {
                        action: "add",
                        value: data.points
                    };
                    Recyclabears.__apiCall('PUT', '/api/users/me/wallet', req);
                }

                console.log(answer_obj);
                return answer_obj;
            });
            // End to be modified ??

        },
        addQuestion: function (data) {
            return Recyclabears.__apiCall('POST', '/api/questions', data);
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
        updateWallet: function(action, amount){

            return Recyclabears.__apiCall('PUT', '/api/users/me/wallet/', {
                action: action,
                value: amount
            });
        }
    }
}