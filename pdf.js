pdfjsLib.GlobalWorkerOptions.workerSrc =
"https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// 👇 Uploaded PDF ka text yahan store hoga
let pdfText = "";
let quizQuestions = [];
let currentQuestion = 0;
let userAnswers = [];

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

    console.log("PDF Length:", pdfText.length);

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
                    text: pdfText.substring(0, 12000) // Test ke liye limit
                })
            }
        );

        console.log("HTTP Status:", response.status);

        const data = await response.json();
        quizQuestions = data.questions;

        console.log("API Response:", data);
        alert(JSON.stringify(data));

        if (!response.ok) {
            output.innerHTML = "❌ HTTP Error: " + response.status;
            return;
        }

        if (data.status !== "success") {
            output.innerHTML =
                "<h3>❌ Backend Error</h3><pre>" +
                JSON.stringify(data, null, 2) +
                "</pre>";
            return;
        }

        if (!Array.isArray(data.questions)) {
            output.innerHTML = "❌ Invalid questions data.";
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

html += `
<br><br>
<button class="btn primary" onclick="startQuiz()">
▶️ Start Quiz
</button>
`;

output.innerHTML = html;

    } catch (err) {

        console.error(err);

        output.innerHTML =
            "<h3>❌ JavaScript Error</h3><pre>" +
            err.message +
            "</pre>";

    }

}

window.generateMCQs = generateMCQs;


async function generateNotes() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");
    output.innerHTML = "🤖 Generating Notes...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-notes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: pdfText.substring(0, 12000)
                })
            }
        );

        const data = await response.json();

        if (data.status !== "success") {
            output.innerHTML = "❌ Failed to generate notes.";
            return;
        }

        output.innerHTML = marked.parse(data.notes);

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }
}

window.generateNotes = generateNotes;

async function generateFlashcards() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");
    output.innerHTML = "🧠 Generating Flashcards...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-flashcards",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: pdfText.substring(0, 12000)
                })
            }
        );

        const data = await response.json();

        if (data.status !== "success") {
            output.innerHTML = "❌ Failed to generate flashcards.";
            return;
        }

        output.innerHTML = marked.parse(data.flashcards);

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }
}

window.generateFlashcards = generateFlashcards;
function startQuiz() {

    currentQuestion = 0;
    userAnswers = [];

    showQuestion();

}

function showQuestion() {

    const q = quizQuestions[currentQuestion];
    const selected = userAnswers[currentQuestion];
    const output = document.getElementById("pdfOutput");

    const progress =
        ((currentQuestion + 1) / quizQuestions.length) * 100;

    output.innerHTML = `

<div style="margin-bottom:20px;">

<div style="
width:100%;
height:12px;
background:#ddd;
border-radius:20px;
overflow:hidden;
">

<div style="
width:${progress}%;
height:100%;
background:#2563eb;
transition:.3s;
">
</div>

</div>

<p style="text-align:center;margin-top:8px;">
Question ${currentQuestion + 1} of ${quizQuestions.length}
</p>

</div>

<h3>${q.question}</h3>

<button class="${selected === 'A' ? 'selected-option' : ''}" onclick="selectAnswer('A')">
A. ${q.options[0]}
</button><br><br>

<button class="${selected === 'B' ? 'selected-option' : ''}" onclick="selectAnswer('B')">
B. ${q.options[1]}
</button><br><br>

<button class="${selected === 'C' ? 'selected-option' : ''}" onclick="selectAnswer('C')">
C. ${q.options[2]}
</button><br><br>

<button class="${selected === 'D' ? 'selected-option' : ''}" onclick="selectAnswer('D')">
D. ${q.options[3]}
</button><br><br>

<button onclick="previousQuestion()">⬅ Previous</button>
<button onclick="nextQuestion()">Next ➡</button>

`;
}
    
        



function selectAnswer(answer) {

    userAnswers[currentQuestion] = answer;

    showQuestion();

}
    


function nextQuestion() {

    if (currentQuestion < quizQuestions.length - 1) {

        currentQuestion++;

        showQuestion();

    } else {

        submitQuiz();

    }

}

function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

    }

}

function submitQuiz() {

    let score = 0;

    let review = "";
    let strengths = [];
    let weaknesses = [];

    quizQuestions.forEach((q, index) => {
        

        const correct = userAnswers[index] === q.answer;
        if (correct) {
       strengths.push(`Q${index + 1}`);
} else {
    weaknesses.push(`Q${index + 1}`);
        }

        if (correct) score++;

        review += `
        <div class="action-card">

        <h3>Q${index + 1}. ${q.question}</h3>

        <p>Your Answer:
        <b>${userAnswers[index] || "Not Answered"}</b></p>

        <p>Correct Answer:
        <span style="color:green;"><b>${q.answer}</b></span></p>

        <p>${correct ? "✅ Correct" : "❌ Incorrect"}</p>

        <p><b>Explanation:</b> ${q.explanation}</p>

        </div><br>
        `;
    });

    document.getElementById("pdfOutput").innerHTML = `
    <h2>🎉 Quiz Completed</h2>

    <h3>Your Score: ${score} / ${quizQuestions.length}</h3>

    <div class="action-card">

        <h3>📊 AI Performance Analysis</h3>

        <p><b>Strong Questions:</b>
        ${strengths.length ? strengths.join(", ") : "None"}
        </p>

        <p><b>Needs Improvement:</b>
        ${weaknesses.length ? weaknesses.join(", ") : "None"}
        </p>

        <p><b>💡 Recommendation:</b>
        ${
            score >= quizQuestions.length * 0.8
            ? "Excellent! Try another chapter."
            : "Revise the Notes and retry the quiz."
        }
        </p>

    </div>

    <br>

    <button class="btn primary" onclick="startQuiz()">
        🔄 Retry Quiz
    </button>

    <br><br>

    ${review}
`;
    
}    

async function generateMindMap() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");

    output.innerHTML = "🧠 Generating Mind Map...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-mindmap",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: pdfText.substring(0, 12000)
                })
            }
        );

        const data = await response.json();

        if (data.status !== "success") {

            output.innerHTML = "❌ Failed to generate Mind Map.";

            return;

        }

        output.innerHTML = `
       <div class="mermaid">
       ${data.mindmap}
       </div>
`;

await mermaid.run();

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }

}

window.generateMindMap = generateMindMap;

async function generateProblems() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");

    output.innerHTML = "🧮 Solving Problems...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-problems",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    text:pdfText.substring(0,12000)
                })
            }
        );

        const data = await response.json();

        if(data.status!="success"){
            output.innerHTML="❌ Failed";
            return;
        }

        output.innerHTML = marked.parse(data.problems);

    } catch(err){

        output.innerHTML="❌ "+err.message;

    }

}

window.generateProblems = generateProblems;

async function generateFormulaSheet() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");

    output.innerHTML = "📐 Generating Formula Sheet...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-formulas",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: pdfText.substring(0, 12000)
                })
            }
        );

        const data = await response.json();

        if (data.status !== "success") {
            output.innerHTML = "❌ Failed to generate Formula Sheet.";
            return;
        }

        output.innerHTML = marked.parse(data.formulas);

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }

}

window.generateFormulaSheet = generateFormulaSheet;

async function generateDefinitions() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");

    output.innerHTML = "📖 Generating Definitions...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-definitions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: pdfText.substring(0, 12000)
                })
            }
        );

        const data = await response.json();

        if (data.status !== "success") {
            output.innerHTML = "❌ Failed to generate definitions.";
            return;
        }

        output.innerHTML = marked.parse(data.definitions);

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }

}

window.generateDefinitions = generateDefinitions;

async function generateImportantQuestions() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");

    output.innerHTML = "⭐ Generating Expected Questions...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-important-questions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: pdfText.substring(0, 12000)
                })
            }
        );

        const data = await response.json();

        if (data.status !== "success") {
            output.innerHTML = "❌ Failed to generate questions.";
            return;
        }

        output.innerHTML = marked.parse(data.questions);

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }

}

window.generateImportantQuestions = generateImportantQuestions;

async function downloadPDF() {

    const element = document.getElementById("pdfOutput");

    if (!element.innerText.trim()) {
        alert("Please generate Notes first.");
        return;
    }

    const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = 210;
    const pageHeight = 297;

    const imgWidth = pageWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;

    while (heightLeft > 0) {

        position = heightLeft - imgHeight;

        pdf.addPage();

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

        heightLeft -= pageHeight;

    }

    pdf.save("Exampanic-Study-Kit.pdf");

}

window.downloadPDF = downloadPDF;

async function generateStudyPlan() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");

    output.innerHTML = "📅 Creating AI Study Plan...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-study-plan",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: pdfText.substring(0, 12000)
                })
            }
        );

        const data = await response.json();

        if (data.status !== "success") {
            output.innerHTML = "❌ Failed to generate study plan.";
            return;
        }

        output.innerHTML = marked.parse(data.study_plan);

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }

}

window.generateStudyPlan = generateStudyPlan;

async function generateDifficultyAnalysis() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");
    output.innerHTML = "📊 Analyzing Chapter Difficulty...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-difficulty",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: pdfText.substring(0, 12000)
                })
            }
        );

        const data = await response.json();

        if (data.status !== "success") {
            output.innerHTML = "❌ Failed to analyze difficulty.";
            return;
        }

        output.innerHTML = marked.parse(data.analysis);

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }

}

window.generateDifficultyAnalysis = generateDifficultyAnalysis;

async function generateRevisionPlan() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");
    output.innerHTML = "🔄 Creating Revision Plan...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-revision-plan",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: pdfText.substring(0, 12000)
                })
            }
        );

        const data = await response.json();

        if (data.status !== "success") {
            output.innerHTML = "❌ Failed to generate revision plan.";
            return;
        }

        output.innerHTML = marked.parse(data.revision);

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }

}

window.generateRevisionPlan = generateRevisionPlan;

async function generateDiagram() {

    if (!pdfText) {
        alert("Please upload a PDF first.");
        return;
    }

    const output = document.getElementById("pdfOutput");
    output.innerHTML = "📊 Generating Diagram...";

    try {

        const response = await fetch(
            "https://student-learning-system-r6bi.onrender.com/pdf-diagram",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: pdfText.substring(0, 12000)
                })
            }
        );

        const data = await response.json();

        if (data.status !== "success") {
            output.innerHTML = "❌ Failed to generate diagram.";
            return;
        }

        output.innerHTML = `
            <pre class="mermaid">
${data.diagram}
            </pre>
        `;

        mermaid.init(undefined, document.querySelectorAll(".mermaid"));

    } catch (err) {

        output.innerHTML = "❌ Error: " + err.message;

    }

}

window.generateDiagram = generateDiagram;
    

    

    
            
        
    

    



        

        
            

    

    

        

    
        

        

    



    





