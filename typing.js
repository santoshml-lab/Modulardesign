function typeWriter(element, text, speed = 12) {

    element.innerHTML = "";

    let i = 0;

    function type() {

        if (i < text.length) {

            element.innerHTML += text.charAt(i);

            // Markdown / HTML render hone do
            element.style.whiteSpace = "pre-wrap";
            element.style.wordBreak = "break-word";
            element.style.overflowWrap = "break-word";

            i++;
            setTimeout(type, speed);
        }
    }

    type();
}
