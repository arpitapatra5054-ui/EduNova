/* =====================================================
   EDUNOVA - COMPLETE QUIZ JAVASCRIPT
   ===================================================== */


/* =========================
   QUIZ DATABASE
   ========================= */

const quizData = {

    "Data Structure": [
        {
            question: "Which data structure follows FIFO?",
            options: ["Stack", "Queue", "Tree", "Graph"],
            answer: 1,
            topic: "Queue"
        },
        {
            question: "Which data structure follows LIFO?",
            options: ["Queue", "Stack", "Tree", "Array"],
            answer: 1,
            topic: "Stack"
        },
        {
            question: "Which data structure consists of nodes connected by links?",
            options: ["Array", "Linked List", "Stack", "Queue"],
            answer: 1,
            topic: "Linked List"
        },
        {
            question: "Which data structure has root and child nodes?",
            options: ["Queue", "Tree", "Stack", "Array"],
            answer: 1,
            topic: "Tree"
        },
        {
            question: "Which data structure stores elements in contiguous memory?",
            options: ["Linked List", "Tree", "Array", "Graph"],
            answer: 2,
            topic: "Array"
        },
        {
            question: "Which structure is commonly used for function calls?",
            options: ["Queue", "Stack", "Graph", "Array"],
            answer: 1,
            topic: "Stack"
        },
        {
            question: "Which operation adds an element to a queue?",
            options: ["Push", "Pop", "Enqueue", "Delete"],
            answer: 2,
            topic: "Queue"
        },
        {
            question: "Which traversal visits the root between left and right subtrees?",
            options: ["Preorder", "Inorder", "Postorder", "Level order"],
            answer: 1,
            topic: "Tree"
        }
    ],

    "C Programming": [
        {
            question: "Which symbol terminates a C statement?",
            options: [".", ";", ":", ","],
            answer: 1,
            topic: "Basics"
        },
        {
            question: "Which data type stores a character?",
            options: ["int", "float", "char", "double"],
            answer: 2,
            topic: "Data Types"
        },
        {
            question: "Which loop executes at least once?",
            options: ["for", "while", "do-while", "if"],
            answer: 2,
            topic: "Loops"
        },
        {
            question: "Which keyword returns a value from a function?",
            options: ["break", "return", "continue", "exit"],
            answer: 1,
            topic: "Functions"
        },
        {
            question: "Which symbol represents the address-of operator?",
            options: ["*", "&", "#", "%"],
            answer: 1,
            topic: "Pointers"
        },
        {
            question: "Which loop is generally used when the number of iterations is known?",
            options: ["for", "while", "do-while", "switch"],
            answer: 0,
            topic: "Loops"
        },
        {
            question: "Which function is the starting point of a C program?",
            options: ["start()", "main()", "begin()", "run()"],
            answer: 1,
            topic: "Functions"
        },
        {
            question: "Which data type stores whole numbers?",
            options: ["int", "char", "float", "double"],
            answer: 0,
            topic: "Data Types"
        }
    ],

    "Operating System": [
        {
            question: "Which of the following is an operating system?",
            options: ["Windows", "HTML", "CSS", "JavaScript"],
            answer: 0,
            topic: "Basics"
        },
        {
            question: "Which scheduling algorithm executes processes in arrival order?",
            options: ["FCFS", "SJF", "Round Robin", "Priority"],
            answer: 0,
            topic: "CPU Scheduling"
        },
        {
            question: "Which scheduling algorithm uses a time quantum?",
            options: ["FCFS", "Round Robin", "SJF", "Priority"],
            answer: 1,
            topic: "CPU Scheduling"
        },
        {
            question: "Which technique divides memory into fixed-size pages?",
            options: ["Paging", "Segmentation", "Swapping", "Compaction"],
            answer: 0,
            topic: "Memory Management"
        },
        {
            question: "Which mechanism allows processes to communicate?",
            options: ["IPC", "HTML", "CSS", "FTP"],
            answer: 0,
            topic: "Process Management"
        },
        {
            question: "Which problem occurs when processes wait forever for resources?",
            options: ["Deadlock", "Paging", "Fragmentation", "Compilation"],
            answer: 0,
            topic: "Deadlock"
        },
        {
            question: "Which memory is closest to the CPU?",
            options: ["Hard Disk", "Cache", "USB", "DVD"],
            answer: 1,
            topic: "Memory Management"
        },
        {
            question: "Which software manages computer hardware and resources?",
            options: ["Operating System", "Browser", "Compiler", "Editor"],
            answer: 0,
            topic: "Basics"
        }
    ],

    "Computer Network": [
        {
            question: "What does LAN stand for?",
            options: [
                "Local Area Network",
                "Large Area Network",
                "Long Area Network",
                "Local Access Network"
            ],
            answer: 0,
            topic: "Networking Basics"
        },
        {
            question: "Which device connects different networks?",
            options: ["Switch", "Router", "Keyboard", "Monitor"],
            answer: 1,
            topic: "Networking Devices"
        },
        {
            question: "Which protocol is commonly used for web pages?",
            options: ["HTTP", "FTP", "SMTP", "TCP"],
            answer: 0,
            topic: "Protocols"
        },
        {
            question: "Which OSI layer is responsible for routing?",
            options: ["Physical", "Data Link", "Network", "Application"],
            answer: 2,
            topic: "OSI Model"
        },
        {
            question: "Which protocol is connection-oriented?",
            options: ["UDP", "TCP", "IP", "ARP"],
            answer: 1,
            topic: "Protocols"
        },
        {
            question: "Which device connects devices within a LAN?",
            options: ["Router", "Switch", "Modem", "Repeater"],
            answer: 1,
            topic: "Networking Devices"
        },
        {
            question: "Which layer is responsible for end-to-end communication?",
            options: ["Transport", "Physical", "Session", "Presentation"],
            answer: 0,
            topic: "OSI Model"
        },
        {
            question: "Which protocol automatically assigns IP addresses?",
            options: ["DHCP", "HTTP", "FTP", "SMTP"],
            answer: 0,
            topic: "Protocols"
        }
    ]
};


/* =========================
   VARIABLES
   ========================= */

let selectedSubject = "";
let currentQuiz = [];
let selectedAnswers = {};
let currentResult = null;


/* =========================
   START QUIZ
   ========================= */

function startQuiz() {

    const select = document.getElementById("subjectSelect");

    if (!select) {
        alert("subjectSelect not found in HTML.");
        return;
    }

    selectedSubject = select.value;

    if (selectedSubject === "") {
        alert("Please select a subject first.");
        return;
    }

    currentQuiz = quizData[selectedSubject];

    if (!currentQuiz) {
        alert("Quiz not found for this subject.");
        return;
    }

    selectedAnswers = {};

    const quizSubject = document.getElementById("quizSubject");
    const quizContainer = document.getElementById("quizContainer");

    if (!quizSubject || !quizContainer) {
        alert("quizSubject or quizContainer not found.");
        return;
    }

    quizSubject.textContent = selectedSubject;

    quizContainer.innerHTML = "";


    /* Create questions */

    currentQuiz.forEach(function (question, qIndex) {

        const questionDiv = document.createElement("div");

        questionDiv.className = "question";

        let options = "";

        question.options.forEach(function (option, oIndex) {

            options += `
                <button
                    type="button"
                    class="quiz-option"
                    id="option-${qIndex}-${oIndex}"
                    onclick="selectAnswer(${qIndex}, ${oIndex})"
                >
                    ${option}
                </button>
            `;

        });


        questionDiv.innerHTML = `
            <h3>
                ${qIndex + 1}. ${question.question}
            </h3>

            <div class="options-container">
                ${options}
            </div>
        `;


        quizContainer.appendChild(questionDiv);

    });


    /* Sections */

    const quizSection =
        document.getElementById("quizSection");

    const resultSection =
        document.getElementById("resultSection");

    const studySection =
        document.getElementById("studySection");

    const progressSection =
        document.getElementById("progressSection");

    const actionSection =
        document.getElementById("actionSection");


    if (quizSection) {
        quizSection.classList.remove("hidden");
    }

    if (resultSection) {
        resultSection.classList.add("hidden");
    }

    if (studySection) {
        studySection.classList.add("hidden");
    }

    if (progressSection) {
        progressSection.classList.add("hidden");
    }

    if (actionSection) {
        actionSection.classList.add("hidden");
    }


    if (quizSection) {
        quizSection.scrollIntoView({
            behavior: "smooth"
        });
    }

}


/* =========================
   SELECT ANSWER
   ========================= */

function selectAnswer(questionIndex, optionIndex) {

    selectedAnswers[questionIndex] = optionIndex;


    /* Remove previous selection */

    currentQuiz[questionIndex].options.forEach(
        function (option, index) {

            const button =
                document.getElementById(
                   ' option-${questionIndex}-${index}'
                );

            if (button) {
                button.classList.remove("selected");
            }

        }
    );


    /* Highlight selected answer */

    const selectedButton =
        document.getElementById(
           ' option-${questionIndex}-${optionIndex}'
        );


    if (selectedButton) {
        selectedButton.classList.add("selected");
    }


    console.log(
        "Question",
        questionIndex + 1,
        "Selected:",
        currentQuiz[questionIndex].options[optionIndex]
    );

}


/* =========================
   SUBMIT QUIZ
   ========================= */

async function submitQuiz() {

    if (currentQuiz.length === 0) {
        alert("Please start the quiz first.");
        return;
    }


    let score = 0;

    let topicData = {};


    currentQuiz.forEach(function (question, qIndex) {

        const topic = question.topic;


        if (!topicData[topic]) {

            topicData[topic] = {
                total: 0,
                correct: 0
            };

        }


        topicData[topic].total++;


        const selectedIndex =
            selectedAnswers[qIndex];


        /* Check answer */

        if (selectedIndex === question.answer) {

            score++;

            topicData[topic].correct++;

        }

    });


    const total = currentQuiz.length;


    const percentage =
        Math.round((score / total) * 100);


    currentResult = {

        subject: selectedSubject,

        score: score,

        total: total,

        percentage: percentage,

        topicData: topicData,

        date: new Date().toLocaleString()

    };


    console.log("========== QUIZ RESULT ==========");
    console.log("Subject:", selectedSubject);
    console.log("Score:", score + "/" + total);
    console.log("Percentage:", percentage + "%");
    console.log("Selected Answers:", selectedAnswers);
    console.log("=================================");


    /* Display result FIRST */

    displayResult(currentResult);


    /* Save to database */

    saveProgress(currentResult);

}


/* =========================
   DISPLAY RESULT
   ========================= */

function displayResult(result) {

    const resultContainer =
        document.getElementById("resultContainer");


    if (!resultContainer) {
        alert("resultContainer not found.");
        return;
    }


    let message;


    if (result.percentage < 40) {

        message =
            "⚠️ You need significant improvement.";

    } else if (result.percentage < 60) {

        message =
            "📖 You need more practice.";

    } else if (result.percentage < 80) {

        message =
            "👍 Good performance, but there is room for improvement.";

    } else {

        message =
            "🎉 Excellent performance!";

    }


    let html = `

        <div class="score-box">

            <div class="score-number">
                ${result.percentage}%
            </div>

            <p>
                Score:
                <strong>
                    ${result.score}/${result.total}
                </strong>
            </p>

            <p class="performance-message">
                ${message}
            </p>

        </div>

        <h3>📚 Topic-wise Performance</h3>

    `;


    const weakTopics = [];


    for (const topic in result.topicData) {

        const data =
            result.topicData[topic];


        const topicPercentage =
            (data.correct / data.total) * 100;


        let statusText;
        let statusClass;


        if (topicPercentage < 50) {

            statusText = "Weak";
            statusClass = "status-weak";

        } else if (topicPercentage < 70) {

            statusText = "Needs Improvement";
            statusClass = "status-improve";

        } else if (topicPercentage < 80) {

            statusText = "Good";
            statusClass = "status-good";

        } else {

            statusText = "Excellent";
            statusClass = "status-excellent";

        }


        const improvement =
            Math.max(0, 80 - topicPercentage);


        if (topicPercentage < 70) {

            weakTopics.push({
                topic: topic,
                score: topicPercentage,
                improvement: improvement
            });

        }


        html += `

            <div class="topic-card">

                <div class="topic-header">

                    <span class="topic-name">
                        ${topic}
                    </span>

                    <span class="topic-score">
                        ${topicPercentage.toFixed(0)}%
                    </span>

                </div>

                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${topicPercentage}%"
                    ></div>

                </div>

                <span class="status ${statusClass}">
                    ${statusText}
                </span>

                <p>
                    <strong>
                        Improvement needed:
                    </strong>

                    ${improvement.toFixed(0)}
                    percentage points
                </p>

            </div>

        `;

    }


    /* Focus areas */

    if (weakTopics.length > 0) {

        html += `

            <div class="topic-card">

                <h3>⚠️ Focus Areas</h3>

                <p>
                    These topics need more attention:
                </p>

                <ul>
        `;


        weakTopics.forEach(function (item) {

            html += `

                <li>
                    <strong>${item.topic}</strong>
                    -
                    ${item.improvement.toFixed(0)}
                    percentage points improvement needed
                </li>

            `;

        });


        html += `
                </ul>
            </div>
        `;

    } else {

        html += `

            <div class="topic-card">

                🎉 Great! You are performing well
                across all tested topics.

            </div>

        `;

    }


    resultContainer.innerHTML = html;


    const resultSection =
        document.getElementById("resultSection");


    if (resultSection) {
        resultSection.classList.remove("hidden");

        resultSection.scrollIntoView({
            behavior: "smooth"
        });
    }


    generateStudyPlan(weakTopics);

}


/* =========================
   STUDY PLAN
   ========================= */

function generateStudyPlan(weakTopics) {

    const container =
        document.getElementById("studyPlanContainer");


    if (!container) {
        return;
    }


    if (weakTopics.length === 0) {

        container.innerHTML = `

            <div class="plan-card">

                <h3>
                    🎉 No Major Weak Topic
                </h3>

                <p>
                    Continue regular practice and revision.
                </p>

            </div>

        `;

    } else {

        let html = "";


        weakTopics.forEach(function (item, index) {

            html += `

                <div class="plan-card">

                    <h3>
                        Day ${index + 1}: ${item.topic}
                    </h3>

                    <p>
                        📖 Study the basic concepts of
                        ${item.topic}.
                    </p>

                    <p>
                        📝 Practice questions related to
                        ${item.topic}.
                    </p>

                    <p>
                        🔄 Review the mistakes made in the quiz.
                    </p>

                    <p>
                        🎯 Target: Improve by at least
                        ${item.improvement.toFixed(0)}
                        percentage points.
                    </p>

                </div>

            `;

        });


        html += `

            <div class="plan-card">

                <h3>
                    Final Day: 🔄 Revision Quiz
                </h3>

                <p>
                    Take the quiz again to measure your improvement.
                </p>

            </div>

        `;


        container.innerHTML = html;

    }


    const studySection =
        document.getElementById("studySection");


    if (studySection) {
        studySection.classList.remove("hidden");
    }

}


/* =========================
   SAVE RESULT
   ========================= */

async function saveProgress(result) {

    try {

        const response =
            await fetch("/save-result", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    subject: result.subject,

                    score: result.score,

                    total: result.total,

                    percentage: result.percentage,

                    topicData: result.topicData

                })

            });


        if (!response.ok) {
            throw new Error("Server error");
        }


        const data =
            await response.json();


        console.log(
            "Database response:",
            data
        );


    } catch (error) {

        console.warn(
            "Database save failed:",
            error
        );

    }

}


/* =========================
   TAKE QUIZ AGAIN
   ========================= */

function takeQuizAgain() {

    startQuiz();

}


/* =========================
   GO TO SUBJECTS
   ========================= */

function goToSubjects() {

    [
        "quizSection",
        "resultSection",
        "studySection",
        "progressSection",
        "actionSection"
    ].forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.classList.add("hidden");
        }

    });


    const subjectSection =
        document.getElementById("subjectSection");


    if (subjectSection) {

        subjectSection.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================
   PAGE LOADED
   ========================= */

console.log(
    "EduNova Quiz JavaScript loaded successfully.");
window.openArena = openArena;
window.startStudent = startStudent;
