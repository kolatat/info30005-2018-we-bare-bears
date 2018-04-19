// var width = document.getElementById('foo').offsetWidth;

function onLoad(){
    var rank_bg_width = document.getElementById('rank_bg').offsetWidth;
    console.log(rank_bg_width);
    document.getElementById('leaderboard').offsetWidth = rank_bg_width;
    // document.getElementById('board_table').style.backgroundColor = "green";

}

window.onload = onLoad;