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
        if (wbbInit) {
            wbbInit();
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
    questions: {
        getRandomQuestion: function () {
            return Recyclabears.__apiCall('GET', '/api/questions/random');
        },
        addQuestion: function (data) {
            return Recyclabears.__apiCall('POST', '/api/questions', data);
        }
    }
}