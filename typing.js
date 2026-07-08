function typeWriter(element, html, speed = 10) {

    element.innerHTML = "";

    let i = 0;

    function type() {

        if (i < html.length) {

            element.innerHTML = html.substring(0, i);

            i++;

            setTimeout(type, speed);

        }

    }

    type();
}

window.typeWriter = typeWriter;
