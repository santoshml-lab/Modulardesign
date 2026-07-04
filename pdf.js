pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// 👇 Uploaded PDF ka text yahan store hoga
let pdfText = "";

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

    // 👇 PDF text save karo
    pdfText = text;

    loading.style.display = "none";

    output.innerHTML =
        "<pre>" + text.substring(0, 5000) + "</pre>";

    console.log(text);

}

window.uploadPDF = uploadPDF;


// =====================
// ASK PDF AI
// =====================

async function askPDF() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const question =
        document.getElementById("pdfQuestion").value;

    if (!question) {
        alert("Enter your question.");
        return;
    }

    const output =
        document.getElementById("pdfOutput");

    output.innerHTML = "🤖 Thinking...";

    try {

        const response = await fetch("https://student-learning-system-r6bi.onrender.com/pdf-chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: pdfText,
                question: question
            })

        });

        const data = await response.json();

        output.innerHTML = marked.parse(data.reply);

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }

}

window.askPDF = askPDF;

async function generateMCQs() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");

    output.innerHTML = "🤖 Generating MCQs...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-mcq",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: pdfText
                })
            }
        );

        const data = await response.json();

        if (data.status !== "success") {
            output.innerHTML = "❌ Failed to generate MCQs.";
            return;
        }

        let html = "<h2>❓ AI MCQs</h2>";

        data.questions.forEach((q, index) => {

            html += `
            <div class="action-card">
                <h3>Q${index + 1}. ${q.question}</h3>

                <p>A. ${q.options[0]}</p>
                <p>B. ${q.options[1]}</p>
                <p>C. ${q.options[2]}</p>
                <p>D. ${q.options[3]}</p>

                <br>
                <b>✅ Answer:</b> ${q.answer}
                <br><br>
                <i>${q.explanation}</i>
            </div><br>
            `;

        });

        output.innerHTML = html;

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }

}

window.generateMCQs = generateMCQs;
