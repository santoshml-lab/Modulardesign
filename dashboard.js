// ===============================
// EXAMPANIC DASHBOARD V2
// ===============================

// AI Tips
const aiTips = [
"📘 Revise Biology for 30 minutes.",
"🧮 Solve 20 Maths questions today.",
"⚛ Practice Physics numericals.",
"🧪 Revise Organic Chemistry.",
"📄 Upload one PDF for AI Notes.",
"🎯 Attempt today's Mock Test.",
"🔥 Keep your study streak alive.",
"🤖 Ask AI Study Companion your doubts."
];

let tipIndex = 0;

function changeTip(){

const tip = document.getElementById("aiTip");

if(!tip) return;

tip.innerHTML = aiTips[tipIndex];

tipIndex++;

if(tipIndex >= aiTips.length){
tipIndex = 0;
}

}

setInterval(changeTip,5000);

// ===============================
// Progress
// ===============================

let progress =
Number(localStorage.getItem("progress")) || 75;

function updateProgress(){

const fill =
document.querySelector(".progress-fill");

const text =
document.getElementById("progressText");

if(fill){
fill.style.width = progress + "%";
}

if(text){
text.innerHTML = progress + "% Completed";
}

}

updateProgress();

// ===============================
// XP
// ===============================

let xp =
Number(localStorage.getItem("xp")) || 2350;

const xpText =
document.getElementById("xpValue");

if(xpText){
xpText.innerHTML = xp;
}

// ===============================
// Streak
// ===============================

let streak =
Number(localStorage.getItem("streak")) || 15;

const streakText =
document.getElementById("streakValue");

if(streakText){
streakText.innerHTML =
streak + " Days";
}

// ===============================
// Card Animation
// ===============================

const cards =
document.querySelectorAll(".platform-card,.tool-card,.progress-card");

cards.forEach((card,index)=>{

card.style.opacity="0";
card.style.transform="translateY(30px)";

setTimeout(()=>{

card.style.transition=".6s";

card.style.opacity="1";

card.style.transform="translateY(0px)";

},index*120);

});

// ===============================
// Greeting
// ===============================

const hour = new Date().getHours();

const title =
document.getElementById("greeting");

if(title){

if(hour<12){

title.innerHTML="🌞 Good Morning";

}

else if(hour<18){

title.innerHTML="☀ Good Afternoon";

}

else{

title.innerHTML="🌙 Good Evening";

}

}

// ===============================
// Continue Button
// ===============================

function continueLearning(){

window.location.href="school.html";

}

// ===============================
// Random Background Glow
// ===============================

setInterval(()=>{

document.body.style.backgroundPosition =
Math.random()*100+"% "+
Math.random()*100+"%";

},8000);
