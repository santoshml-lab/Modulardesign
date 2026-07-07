function typeWriter(element,text,speed=12){

element.innerHTML="";

let i=0;

function type(){

if(i<text.length){

element.innerHTML+=text.charAt(i);

i++;

setTimeout(type,speed);

}

}

type();

}
