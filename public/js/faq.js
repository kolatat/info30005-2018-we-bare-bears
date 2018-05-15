function loadWhat() {
    var info_box = document.getElementById('info-details');
    info_box.innerHTML = "<p>What you should recycle are</p>";

    for (var i = 0; i < 8; i++) {

        var new_recyclable = document.createElement('div');
        new_recyclable.className = 'icon-content';
        new_recyclable.innerHTML = 'Recyclable ' + i;
        document.getElementById('info-details').appendChild(new_recyclable);

    }
}

function loadHow() {
    var info_box = document.getElementById('info-details');
    info_box.innerHTML = "<p>How you should recycle is</p>";
}

function loadWhy() {
    var info_box = document.getElementById('info-details');
    info_box.innerHTML = "<p>Why you should recycle is</p>";

    // info_box.innerHTML += "<iframe width=\"100%\" height=\"100%\"src=\"https://www.youtube.com/embed/osjRUoodb7Q\" frameBorder=\"0\" allow=\"autoplay; encrypted-media\" allowFullScreen></iframe>";
    info_box.innerHTML += "<iframe class=\"video\" src=\"https://www.youtube.com/embed/osjRUoodb7Q\" frameBorder=\"0\" allow=\"autoplay; encrypted-media\" allowFullScreen></iframe>";
    // info_box.innerHTML += "<iframe width=560 height=315 src=\"https://www.youtube.com/embed/osjRUoodb7Q\" frameBorder=\"0\" allow=\"autoplay; encrypted-media\" allowFullScreen></iframe>";
}

function loadFAQ() {
    var info_box = document.getElementById('info-details');
    info_box.innerHTML = "<p>Some frequently-asked questions</p>";
    // info_box.innerHTML += "<ul id='questions'></ul>"

    var list = document.createElement('ol');
    for (var i = 0; i < 8; i++) {
        var new_question = document.createElement('li');
        new_question.innerHTML = 'Here is a question.'
        list.appendChild(new_question);

    }

    info_box.appendChild(list);
}

function onLoad(){
    loadWhat();
}