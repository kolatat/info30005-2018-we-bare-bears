function wrongAnswer(){
    document.getElementById("overlay").style.display = 'block'
    document.getElementById("answer_feedback").style.display = 'block';
    var feedback_text = document.getElementById("feedback_text");
    feedback_text.innerHTML="Wrong Answer!"
}

function correctAnswer(){
    document.getElementById("overlay").style.display = 'block';
    document.getElementById("answer_feedback").style.display = 'block';
    var feedback_text = document.getElementById("feedback_text");
    feedback_text.innerHTML="Correct Answer!"
}