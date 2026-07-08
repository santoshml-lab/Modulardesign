function openLink(url){
window.open(url, "_blank");
}
const aiTips = [

"📘 Revise Biology for 30 minutes.",

"🧮 Solve 15 Algebra questions today.",

"⚛ Practice 10 Physics numericals.",

"🧪 Revise Organic Chemistry reactions.",

"📄 Upload one PDF and generate AI Notes.",

"🎯 Attempt one Mock Test today.",

"🔥 Keep your study streak alive!"

];

function nextTip(){

const random =
Math.floor(Math.random()*aiTips.length);

document.getElementById("aiMessage").innerHTML =
aiTips[random];

}
