pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

async function uploadPDF() {

    const file =
        document.getElementById("pdfFile").files[0];

    const output =
        document.getElementById("pdfOutput");

    const loading =
        document.getElementById("loading");

    if (!file) {
        alert("Please select a PDF");
        return;
    }

    loading.style.display = "block";
    output.innerHTML = "Reading PDF...";

    const arrayBuffer = await file.arrayBuffer();

    const pdf =
        await pdfjsLib.getDocument({
            data: arrayBuffer
        }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {

        const page = await pdf.getPage(i);

        const content =
            await page.getTextContent();

        text += content.items
            .map(item => item.str)
            .join(" ");

        text += "\n\n";
    }

    loading.style.display = "none";

    output.innerHTML =
        "<pre>" + text.substring(0, 5000) + "</pre>";

    console.log(text);

}

window.uploadPDF = uploadPDF;
