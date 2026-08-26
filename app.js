/* =========================================================
   EDUNOVA - COMPLETE APP.JS
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentSubject = "Python";

let quiz = [];

let questionIndex = 0;

let score = 0;

let answered = false;

let bombTimer = null;

let bombSeconds = 0;

let debugQuestions = [];

let debugIndex = 0;

let debugScore = 0;

let visualItems = [];

let visualTimer = null;



/* =========================================================
   API
========================================================= */

async function api(url, options = {}) {

    try {

        const response =
            await fetch(url, options);


        if (!response.ok) {

            console.log(
                "API Error:",
                response.status,
                url
            );

            return {};

        }


        return await response.json();

    }

    catch (error) {

        console.error(
            "Fetch error:",
            error
        );

        return {};

    }

}



async function post(url, data) {

    return api(

        url,

        {

            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body:
                JSON.stringify(data)

        }

    );

}



/* =========================================================
   INITIAL LOAD
========================================================= */

async function init() {

    console.log(
        "EduNova initializing..."
    );


    loadDefaultSubjects();


    const subjectSelect =
        document.getElementById(
            "subjectSelect"
        );


    if (!subjectSelect) {

        console.error(
            "subjectSelect not found"
        );

        return;

    }


    try {

        const data =
            await api(
                "/api/subjects"
            );


        if (
            data &&
            Array.isArray(data.subjects) &&
            data.subjects.length > 0
        ) {

            subjectSelect.innerHTML =
                data.subjects
                .map(
                    subject => `

                        <option value="${escapeHTML(
                            subject
                        )}">

                            ${escapeHTML(
                                subject
                            )}

                        </option>

                    `
                )
                .join("");

        }

    }

    catch (error) {

        console.log(
            "Using default subjects."
        );

    }


    currentSubject =
        subjectSelect.value ||
        "Python";


    await refreshDashboard();

    await loadDaily();

    await loadLeaderboard();

    await loadActivity();


    console.log(
        "EduNova ready!"
    );

}



/* =========================================================
   DEFAULT SUBJECTS
========================================================= */

function loadDefaultSubjects() {

    const select =
        document.getElementById(
            "subjectSelect"
        );


    if (!select) return;


    select.innerHTML = `

        <option value="Python">
            Python
        </option>

        <option value="Data Structure">
            Data Structure
        </option>

        <option value="Java">
            Java
        </option>

        <option value="C">
            C Programming
        </option>

        <option value="DBMS">
            DBMS
        </option>

        <option value="HTML">
            HTML
        </option>

        <option value="CSS">
            CSS
        </option>

        <option value="JavaScript">
            JavaScript
        </option>

    `;

}



/* =========================================================
   START STUDENT
========================================================= */

async function startStudent() {

    const input =
        document.getElementById(
            "nameInput"
        );


    if (!input) return;


    const name =
        input.value.trim();


    if (!name) {

        showToast(
            "Please enter your name 🚀"
        );

        return;

    }


    const result =
        await post(
            "/api/start",
            {
                name: name
            }
        );


    if (
        result &&
        result.success
    ) {

        document
            .getElementById(
                "profileName"
            )
            .textContent =
            result.name;


        document
            .getElementById(
                "welcomeCard"
            )
            .style.display =
            "none";


        showToast(
            "Welcome to EduNova! 🎮"
        );


        await refreshDashboard();

        await loadDaily();

        await loadLeaderboard();

        await loadActivity();

    }

    else {

        /*
           Even if backend /api/start
           is not available, we still
           allow the student to use
           the frontend.
        */

        document
            .getElementById(
                "profileName"
            )
            .textContent =
            name;


        document
            .getElementById(
                "welcomeCard"
            )
            .style.display =
            "none";


        showToast(
            `Welcome ${name}! 🚀`
        );

    }

}



/* =========================================================
   DASHBOARD
========================================================= */

async function refreshDashboard() {

    const data =
        await api(
            "/api/state"
        );


    if (!data || Object.keys(data).length === 0) {

        return;

    }


    document
        .getElementById(
            "profileName"
        )
        .textContent =
        data.name ||
        "Student";


    document
        .getElementById(
            "level"
        )
        .textContent =
        data.level ||
        1;


    document
        .getElementById(
            "totalXP"
        )
        .textContent =
        data.xp ||
        0;


    document
        .getElementById(
            "xpNow"
        )
        .textContent =
        `${data.xp || 0} XP`;


    document
        .getElementById(
            "xpNext"
        )
        .textContent =
        `${data.next_xp || 250} XP`;


    const level =
        Number(
            data.level || 1
        );


    const previous =
        (level - 1) * 250;


    let percent =
        (
            (
                (data.xp || 0)
                -
                previous
            )
            /
            250
        )
        *
        100;


    percent =
        Math.max(
            0,
            Math.min(
                100,
                percent
            )
        );


    document
        .getElementById(
            "xpFill"
        )
        .style.width =
        percent + "%";


    document
        .getElementById(
            "levelText"
        )
        .textContent =
        `Earn ${
            Math.max(
                0,
                (data.next_xp || 250)
                -
                (data.xp || 0)
            )
        } XP to unlock Level ${
            level + 1
        }.`;


    document
        .getElementById(
            "streakText"
        )
        .textContent =
        `You're on a ${
            data.streak || 0
        } day streak! 🔥`;


    updateStreak(
        data.streak || 0
    );

}



/* =========================================================
   STREAK
========================================================= */

function updateStreak(streak) {

    const days =
        document.querySelectorAll(
            ".week i"
        );


    days.forEach(
        (day, index) => {

            if (
                index >=
                7 - streak
            ) {

                day.classList.add(
                    "active"
                );

            }

            else {

                day.classList.remove(
                    "active"
                );

            }

        }
    );

}



/* =========================================================
   SUBJECT CHANGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const select =
            document.getElementById(
                "subjectSelect"
            );


        if (!select) return;


        select.addEventListener(
            "change",
            function () {

                currentSubject =
                    this.value;


                showToast(
                    `${currentSubject} selected 📚`
                );

            }
        );

    }
);



/* =========================================================
   DAILY
========================================================= */

async function loadDaily() {

    const data =
        await api(
            "/api/daily"
        );


    if (!data) return;


    const title =
        document.getElementById(
            "dailyTitle"
        );


    const desc =
        document.getElementById(
            "dailyDesc"
        );


    const status =
        document.getElementById(
            "dailyStatus"
        );


    const button =
        document.getElementById(
            "dailyButton"
        );


    if (!title) return;


    title.textContent =
        data.title ||
        "Daily Challenge";


    desc.textContent =
        `Complete ${
            data.subject ||
            currentSubject
        } challenge and earn ${
            data.xp ||
            100
        } XP.`;


    status.textContent =
        data.completed
        ? "1/1"
        : "0/1";


    if (data.completed) {

        button.disabled =
            true;

        button.textContent =
            "Completed ✓";

    }

    else {

        button.disabled =
            false;

        button.textContent =
            "Complete Challenge";

    }

}



/* =========================================================
   START DAILY
========================================================= */

async function startDaily() {

    const data =
        await api(
            "/api/daily"
        );


    if (
        data &&
        data.subject
    ) {

        currentSubject =
            data.subject;


        const select =
            document.getElementById(
                "subjectSelect"
            );


        if (select) {

            select.value =
                data.subject;

        }

    }


    openArena("quiz");

}



/* =========================================================
   LEADERBOARD
========================================================= */

async function loadLeaderboard() {

    const data =
        await api(
            "/api/leaderboard"
        );


    const box =
        document.getElementById(
            "leaderboard"
        );


    if (!box) return;


    if (!Array.isArray(data)) {

        box.innerHTML =
            "No leaderboard data.";

        return;

    }


    if (data.length === 0) {

        box.innerHTML =
            "No leaderboard data.";

        return;

    }


    box.innerHTML =
        data
        .map(
            student => `

                <div class="
                    rank
                    ${
                        student.you
                        ? "you"
                        : ""
                    }
                ">

                    <b>

                        ${
                            student.rank === 1
                            ? "🥇"
                            : student.rank === 2
                            ? "🥈"
                            : student.rank === 3
                            ? "🥉"
                            : "#" +
                              student.rank
                        }

                    </b>

                    <span>
                        👤
                        ${escapeHTML(
                            student.name
                        )}
                    </span>

                    <strong>
                        ${student.xp || 0}
                        XP
                    </strong>

                </div>

            `
        )
        .join("");

}



/* =========================================================
   ACTIVITY
========================================================= */

async function loadActivity() {

    const data =
        await api(
            "/api/activity"
        );


    const box =
        document.getElementById(
            "activity"
        );


    if (!box) return;


    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        box.innerHTML =
            "No activity yet.";

        return;

    }


    box.innerHTML =
        data
        .map(
            item => `

                <div class="activity-row">

                    <div>

                        <b>
                            ${escapeHTML(
                                item.subject
                            )}
                            Quiz
                        </b>

                        <small>

                            ${item.score}
                            /
                            ${item.total}
                            correct

                            •
                            ${item.percentage}%

                        </small>

                    </div>

                    <strong>
                        +XP
                    </strong>

                </div>

            `
        )
        .join("");

}



/* =========================================================
   OPEN ARENA
========================================================= */

function openArena(mode) {

    console.log(
        "Opening arena:",
        mode
    );


    const arena =
        document.getElementById(
            "arena"
        );


    if (!arena) {

        console.error(
            "Arena not found!"
        );

        return;

    }


    arena.classList.remove(
        "hidden"
    );


    arena.scrollIntoView({
        behavior: "smooth"
    });


    clearInterval(
        bombTimer
    );


    clearInterval(
        visualTimer
    );


    if (mode === "quiz") {

        startQuiz();

    }

    else if (mode === "visual") {

        startVisual();

    }

    else if (mode === "debug") {

        startDebug();

    }

    else if (mode === "bomb") {

        startBomb();

    }

}



/* =========================================================
   QUIZ
========================================================= */

async function startQuiz() {

    document
        .getElementById(
            "arenaTitle"
        )
        .textContent =
        "🧠 Quiz Arena";


    document
        .getElementById(
            "arenaSubtitle"
        )
        .textContent =
        `${currentSubject} • Test your knowledge`;


    const level =
        Number(
            document
                .getElementById(
                    "level"
                )
                .textContent
        ) || 1;


    const data =
        await api(
            `/api/questions?subject=${
                encodeURIComponent(
                    currentSubject
                )
            }&level=${level}`
        );


    if (
        data &&
        Array.isArray(data.questions) &&
        data.questions.length > 0
    ) {

        quiz =
            data.questions;

    }

    else {

        quiz =
            getFallbackQuizQuestions(
                currentSubject
            );

    }


    questionIndex = 0;

    score = 0;

    drawQuestion();

}



/* =========================================================
   FALLBACK QUIZ
========================================================= */

function getFallbackQuizQuestions(subject) {

    const commonQuestions = [

        {

            question:
                "Which data structure follows FIFO?",

            options: [
                "Stack",
                "Queue",
                "Tree",
                "Graph"
            ],

            answer: 1

        },


        {

            question:
                "Which data structure follows LIFO?",

            options: [
                "Queue",
                "Stack",
                "Array",
                "Graph"
            ],

            answer: 1

        },


        {

            question:
                "Which keyword is used to define a function in Python?",

            options: [
                "function",
                "def",
                "func",
                "define"
            ],

            answer: 1

        },


        {

            question:
                "Which symbol is used for equality comparison in programming?",

            options: [
                "=",
                "==",
                "!=",
                "<="
            ],

            answer: 1

        },


        {

            question:
                "Which data structure stores elements using indexes?",

            options: [
                "Array",
                "Queue",
                "Tree",
                "Graph"
            ],

            answer: 0

        }

    ];


    return commonQuestions;

}



/* =========================================================
   DRAW QUESTION
========================================================= */

function drawQuestion() {

    if (
        questionIndex >=
        quiz.length
    ) {

        finishQuiz();

        return;

    }


    answered = false;


    const q =
        quiz[
            questionIndex
        ];


    const box =
        document.getElementById(
            "arenaContent"
        );


    box.innerHTML = `

        <div
            id="reaction"
            class="reaction-top"
        ></div>


        <div class="question">

            <div class="question-number">

                QUESTION
                ${questionIndex + 1}
                /
                ${quiz.length}

            </div>


            <div class="question-text">

                ${escapeHTML(
                    q.question
                )}

            </div>

        </div>


        <div class="options">

            ${
                q.options
                .map(
                    (option, index) => `

                        <button
                            class="option"
                            onclick="
                                answerQuestion(
                                    ${index}
                                )
                            "
                        >

                            <span
                                class="option-letter"
                            >
                                ${
                                    String.fromCharCode(
                                        65 + index
                                    )
                                }
                            </span>

                            ${escapeHTML(
                                option
                            )}

                        </button>

                    `
                )
                .join("")
            }

        </div>

    `;

}



/* =========================================================
   ANSWER QUESTION
========================================================= */

function answerQuestion(index) {

    if (answered)
        return;


    answered = true;


    const q =
        quiz[
            questionIndex
        ];


    const options =
        document.querySelectorAll(
            ".option"
        );


    options.forEach(
        (button, i) => {

            button.disabled =
                true;


            if (
                i === q.answer
            ) {

                button.classList.add(
                    "correct"
                );

            }


            if (
                i === index &&
                i !== q.answer
            ) {

                button.classList.add(
                    "wrong"
                );

            }

        }
    );


    if (
        index ===
        q.answer
    ) {

        score++;

        successSound();

        showMeme(true);

    }

    else {

        wrongSound();

        showMeme(false);

    }


    setTimeout(
        () => {

            questionIndex++;

            drawQuestion();

        },
        1800
    );

}



/* =========================================================
   FINISH QUIZ
========================================================= */

async function finishQuiz() {

    let result =
        await post(
            "/api/save-result",
            {

                subject:
                    currentSubject,

                score:
                    score,

                total:
                    quiz.length,

                mode:
                    "quiz"

            }
        );


    if (!result) {

        result = {};

    }


    const percentage =
        result.percentage !== undefined
        ? result.percentage
        : Math.round(
            (
                score /
                quiz.length
            ) *
            100
        );


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML = `

            <div class="meme">

                <div class="emoji">
                    🏆🎉🚀
                </div>

                <h2>
                    Quiz Complete!
                </h2>

                <p>
                    ${score}
                    /
                    ${quiz.length}
                    correct
                </p>

                <p>
                    Score:
                    ${percentage}%
                </p>

                <br>

                <button
                    onclick="startQuiz()"
                >
                    🔄 Play Again
                </button>

            </div>

        `;


    await refreshDashboard();

    await loadDaily();

    await loadLeaderboard();

    await loadActivity();


    confetti();

}



/* =========================================================
   MEME SYSTEM
========================================================= */

function showMeme(correct) {

    const box =
        document.getElementById(
            "reaction"
        );


    if (!box) return;


    /*
       IMPORTANT:
       Your JPG files remain here.
    */

    const correctMemes = [

        "/static/memes/correct1.jpg",

        "/static/memes/correct2.jpg",

        "/static/memes/correct3.jpg"

    ];


    const wrongMemes = [

        "/static/memes/wrong1.jpg",

        "/static/memes/wrong2.jpg",

        "/static/memes/wrong3.jpg"

    ];


    const memes =
        correct
        ? correctMemes
        : wrongMemes;


    const randomMeme =
        memes[
            Math.floor(
                Math.random()
                *
                memes.length
            )
        ];


    if (correct) {

        box.innerHTML = `

            <div class="
                meme
                reaction-meme-box
                correct-meme
            ">

                <img
                    src="${randomMeme}"
                    alt="Correct Answer Meme"
                    class="reaction-meme"
                >

                <b>
                    🎉 PERFECT!
                    Brain.exe is working! 🔥
                </b>

                <p>
                    Correct answer!
                    Keep going! 🚀
                </p>

            </div>

        `;


        confetti();

    }

    else {

        box.innerHTML = `

            <div class="
                meme
                reaction-meme-box
                wrong-meme
            ">

                <img
                    src="${randomMeme}"
                    alt="Wrong Answer Meme"
                    class="reaction-meme"
                >

                <b>
                    😂 FAHHHH!
                    Not quite!
                </b>

                <p>
                    Don't worry —
                    you'll get the next one! 💪
                </p>

            </div>

        `;

    }

}



/* =========================================================
   SOUND
========================================================= */

function sound(
    frequency,
    duration,
    type
) {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        const context =
            new AudioContext();


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        oscillator.type =
            type;


        oscillator.frequency.value =
            frequency;


        gain.gain.value =
            0.08;


        oscillator.connect(
            gain
        );


        gain.connect(
            context.destination
        );


        oscillator.start();


        oscillator.stop(
            context.currentTime +
            duration
        );

    }

    catch (error) {

        console.log(error);

    }

}



function successSound() {

    sound(
        880,
        0.12,
        "sine"
    );


    setTimeout(
        () => {

            sound(
                1200,
                0.15,
                "sine"
            );

        },
        100
    );

}



function wrongSound() {

    sound(
        150,
        0.25,
        "sawtooth"
    );

}



/* =========================================================
   VISUAL SIMULATOR
========================================================= */

function startVisual() {

    document
        .getElementById(
            "arenaTitle"
        )
        .textContent =
        "🎨 Visual Simulator";


    document
        .getElementById(
            "arenaSubtitle"
        )
        .textContent =
        `${currentSubject} • Choose what you want to visualize`;


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML = `

            <div class="visual-menu">

                <h3>
                    Choose a Visual Simulation
                </h3>

                <p>
                    Pick a concept and watch
                    how it works step-by-step.
                </p>


                <div class="visual-choice-grid">

                    <button onclick="visualArray()">
                        📦
                        <span>Array</span>
                        <small>Index & Storage</small>
                    </button>


                    <button onclick="visualLinkedList()">
                        🔗
                        <span>Linked List</span>
                        <small>Nodes & Links</small>
                    </button>


                    <button onclick="visualStack()">
                        📚
                        <span>Stack</span>
                        <small>LIFO</small>
                    </button>


                    <button onclick="visualQueue()">
                        🚶
                        <span>Queue</span>
                        <small>FIFO</small>
                    </button>


                    <button onclick="visualLoop()">
                        🔁
                        <span>Loop</span>
                        <small>Iteration</small>
                    </button>


                    <button onclick="visualTree()">
                        🌳
                        <span>Binary Tree</span>
                        <small>Nodes</small>
                    </button>


                    <button onclick="visualSearch()">
                        🔍
                        <span>Searching</span>
                        <small>Linear Search</small>
                    </button>


                    <button onclick="visualSort()">
                        📊
                        <span>Sorting</span>
                        <small>Bubble Sort</small>
                    </button>

                </div>

            </div>

        `;

}



/* =========================================================
   VISUAL HEADER
========================================================= */

function visualHeader(
    title,
    description
) {

    return `

        <button onclick="startVisual()">
            ← Back to Visuals
        </button>

        <br><br>

        <div class="question">

            <h3>
                ${title}
            </h3>

            <p>
                ${description}
            </p>

        </div>

        <br>

    `;

}



/* =========================================================
   ARRAY
========================================================= */

function visualArray() {

    visualItems = [
        10,
        20,
        30,
        40,
        50
    ];


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML =

        visualHeader(
            "📦 Array Visualizer",
            "Elements are stored using indexes."
        )

        +

        `

            <div
                id="visualBlocks"
                class="visual-array"
            ></div>

            <br>

            <button onclick="addArrayElement()">
                ➕ Add Element
            </button>

            <button onclick="removeArrayElement()">
                ➖ Remove Last
            </button>

        `;


    drawArray();

}



function drawArray() {

    const box =
        document.getElementById(
            "visualBlocks"
        );


    if (!box) return;


    box.innerHTML =
        visualItems
        .map(
            (item, index) => `

                <div class="visual-node">

                    <small>
                        Index ${index}
                    </small>

                    <strong>
                        ${item}
                    </strong>

                </div>

            `
        )
        .join("");

}



function addArrayElement() {

    visualItems.push(
        Math.floor(
            Math.random() * 100
        )
    );


    drawArray();

}



function removeArrayElement() {

    if (
        visualItems.length
    ) {

        visualItems.pop();

        drawArray();

    }

}



/* =========================================================
   LINKED LIST
========================================================= */

function visualLinkedList() {

    window.linkedNodes = [
        10,
        20,
        30,
        40
    ];


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML =

        visualHeader(
            "🔗 Linked List Visualizer",
            "Each node stores data and a link to the next node."
        )

        +

        `

            <div
                id="linkedNodes"
                class="linked-list"
            ></div>

            <br>

            <button onclick="addLinkedNode()">
                ➕ Add Node
            </button>

        `;


    drawLinkedList();

}



function drawLinkedList() {

    const box =
        document.getElementById(
            "linkedNodes"
        );


    if (!box) return;


    box.innerHTML =
        window.linkedNodes
        .map(
            (item, index) => `

                <div class="linked-node">

                    <div>

                        <small>
                            DATA
                        </small>

                        <strong>
                            ${item}
                        </strong>

                    </div>

                    <span>

                        ${
                            index <
                            window.linkedNodes.length - 1
                            ? "→"
                            : "→ NULL"
                        }

                    </span>

                </div>

            `
        )
        .join("");

}



function addLinkedNode() {

    window.linkedNodes.push(
        Math.floor(
            Math.random() * 100
        )
    );


    drawLinkedList();

}



/* =========================================================
   STACK
========================================================= */

function visualStack() {

    window.stackData = [
        "A",
        "B",
        "C"
    ];


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML =

        visualHeader(
            "📚 Stack Visualizer",
            "Stack follows LIFO — Last In, First Out."
        )

        +

        `

            <div
                id="stackContainer"
                class="stack-container"
            ></div>

            <br>

            <button onclick="pushStack()">
                ➕ PUSH
            </button>

            <button onclick="popStack()">
                ➖ POP
            </button>

        `;


    drawStack();

}



function drawStack() {

    const box =
        document.getElementById(
            "stackContainer"
        );


    if (!box) return;


    box.innerHTML =
        window.stackData
        .slice()
        .reverse()
        .map(
            item => `

                <div class="stack-item">
                    ${escapeHTML(item)}
                </div>

            `
        )
        .join("");

}



function pushStack() {

    window.stackData.push(
        "X" +
        Math.floor(
            Math.random() * 100
        )
    );


    drawStack();

}



function popStack() {

    if (
        window.stackData.length
    ) {

        window.stackData.pop();

        drawStack();

    }

}



/* =========================================================
   QUEUE
========================================================= */

function visualQueue() {

    window.queueData = [
        "A",
        "B",
        "C"
    ];


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML =

        visualHeader(
            "🚶 Queue Visualizer",
            "Queue follows FIFO — First In, First Out."
        )

        +

        `

            <div
                id="queueContainer"
                class="queue-container"
            ></div>

            <br>

            <button onclick="enqueue()">
                ➕ ENQUEUE
            </button>

            <button onclick="dequeue()">
                ➖ DEQUEUE
            </button>

        `;


    drawQueue();

}



function drawQueue() {

    const box =
        document.getElementById(
            "queueContainer"
        );


    if (!box) return;


    box.innerHTML =
        window.queueData
        .map(
            item => `

                <div class="queue-item">
                    ${escapeHTML(item)}
                </div>

            `
        )
        .join("");

}



function enqueue() {

    window.queueData.push(
        "X" +
        Math.floor(
            Math.random() * 100
        )
    );


    drawQueue();

}



function dequeue() {

    if (
        window.queueData.length
    ) {

        window.queueData.shift();

        drawQueue();

    }

}



/* =========================================================
   LOOP
========================================================= */

function visualLoop() {

    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML =

        visualHeader(
            "🔁 Loop Visualizer",
            "Watch a loop execute one iteration at a time."
        )

        +

        `

            <div class="loop-box">

                <div
                    id="loopCounter"
                    class="loop-counter"
                >
                    0
                </div>

                <p>
                    for (i = 0; i < 10; i++)
                </p>

                <button onclick="runLoopStep()">
                    ▶ Next Iteration
                </button>

            </div>

        `;


    window.loopValue = 0;

}



function runLoopStep() {

    const counter =
        document.getElementById(
            "loopCounter"
        );


    if (
        window.loopValue >= 10
    ) {

        counter.textContent =
            "DONE ✓";

        successSound();

        return;

    }


    counter.textContent =
        window.loopValue;


    window.loopValue++;

}



/* =========================================================
   BINARY TREE
========================================================= */

function visualTree() {

    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML =

        visualHeader(
            "🌳 Binary Tree",
            "A node can have left and right children."
        )

        +

        `

            <div class="tree">

                <div class="tree-node root">
                    50
                </div>

                <div class="tree-line">
                    ↙
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    ↘
                </div>

                <div class="tree-children">

                    <div class="tree-node">
                        30
                    </div>

                    <div class="tree-node">
                        70
                    </div>

                </div>

                <br>

                <div class="tree-children">

                    <div class="tree-node">
                        20
                    </div>

                    <div class="tree-node">
                        40
                    </div>

                    <div class="tree-node">
                        60
                    </div>

                    <div class="tree-node">
                        80
                    </div>

                </div>

            </div>

        `;

}



/* =========================================================
   SEARCH
========================================================= */

function visualSearch() {

    window.searchArray = [
        10,
        25,
        40,
        55,
        70
    ];


    window.searchIndex = 0;


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML =

        visualHeader(
            "🔍 Linear Search",
            "The algorithm checks elements one by one."
        )

        +

        `

            <div
                id="searchBlocks"
                class="visual-array"
            ></div>

            <br>

            <button onclick="searchStep()">
                🔎 Check Next
            </button>

            <p id="searchMessage">
                Search for 55
            </p>

        `;


    drawSearch();

}



function drawSearch() {

    const box =
        document.getElementById(
            "searchBlocks"
        );


    if (!box) return;


    box.innerHTML =
        window.searchArray
        .map(
            (item, index) => `

                <div
                    class="
                        visual-node
                        ${
                            index ===
                            window.searchIndex
                            ? "highlight"
                            : ""
                        }
                    "
                >

                    ${item}

                </div>

            `
        )
        .join("");

}



function searchStep() {

    const target = 55;


    if (
        window.searchIndex >=
        window.searchArray.length
    ) {

        return;

    }


    const current =
        window.searchArray[
            window.searchIndex
        ];


    const message =
        document.getElementById(
            "searchMessage"
        );


    if (
        current === target
    ) {

        message.textContent =
            `🎯 Found ${target}!`;

        successSound();

        confetti();

        return;

    }


    message.textContent =
        `Checking ${current}...`;


    window.searchIndex++;

    drawSearch();

}



/* =========================================================
   BUBBLE SORT
========================================================= */

function visualSort() {

    window.sortArray = [
        50,
        20,
        40,
        10,
        30
    ];


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML =

        visualHeader(
            "📊 Bubble Sort",
            "Compare neighbouring elements and swap them when needed."
        )

        +

        `

            <div
                id="sortBlocks"
                class="visual-array"
            ></div>

            <br>

            <button onclick="sortStep()">
                ▶ Next Sort Step
            </button>

        `;


    drawSort();

}



function drawSort() {

    const box =
        document.getElementById(
            "sortBlocks"
        );


    if (!box) return;


    box.innerHTML =
        window.sortArray
        .map(
            item => `

                <div class="visual-node">
                    ${item}
                </div>

            `
        )
        .join("");

}



function sortStep() {

    let swapped = false;


    for (
        let i = 0;
        i <
        window.sortArray.length - 1;
        i++
    ) {

        if (
            window.sortArray[i]
            >
            window.sortArray[i + 1]
        ) {

            const temp =
                window.sortArray[i];


            window.sortArray[i] =
                window.sortArray[i + 1];


            window.sortArray[i + 1] =
                temp;


            swapped = true;

            break;

        }

    }


    drawSort();


    if (!swapped) {

        showToast(
            "Array sorted! 🎉"
        );

        successSound();

    }

}



/* =========================================================
   DEBUG ARENA
========================================================= */

async function startDebug() {

    clearInterval(
        bombTimer
    );


    document
        .getElementById(
            "arenaTitle"
        )
        .textContent =
        "🛠 Debugging Arena";


    document
        .getElementById(
            "arenaSubtitle"
        )
        .textContent =
        `${currentSubject} • Find the bug`;


    const level =
        Number(
            document
                .getElementById(
                    "level"
                )
                .textContent
        ) || 1;


    const data =
        await api(
            `/api/debug?subject=${
                encodeURIComponent(
                    currentSubject
                )
            }&level=${level}`
        );


    if (
        data &&
        Array.isArray(data.questions) &&
        data.questions.length
    ) {

        debugQuestions =
            data.questions;

    }

    else {

        debugQuestions =
            getFallbackDebugQuestions(
                currentSubject
            );

    }


    debugIndex = 0;

    debugScore = 0;

    drawDebugQuestion();

}



/* =========================================================
   FALLBACK DEBUG
========================================================= */

function getFallbackDebugQuestions(subject) {

    return [

        {

            question:
                "Find the mistake in this code.",

            code:
`int a = 10;

if(a = 10){

    printf("Equal");

}`,

            options: [
                "a = 10",
                "printf",
                "int a"
            ],

            answer: 0,

            explanation:
                "Use == for comparison: if(a == 10)"

        },


        {

            question:
                "Find the mistake in this loop.",

            code:
`for(int i = 0; i < 10; i--){

    printf("%d", i);

}`,

            options: [
                "i--",
                "printf",
                "int i"
            ],

            answer: 0,

            explanation:
                "i-- moves away from 10. Use i++."

        },


        {

            question:
                "Find the mistake.",

            code:
`int arr[3];

arr[3] = 50;`,

            options: [
                "arr[3]",
                "int arr[3]",
                "50"
            ],

            answer: 0,

            explanation:
                "Valid indexes are 0, 1 and 2."

        }

    ];

}



/* =========================================================
   DRAW DEBUG
========================================================= */

function drawDebugQuestion() {

    if (
        debugIndex >=
        debugQuestions.length
    ) {

        finishDebug();

        return;

    }


    const q =
        debugQuestions[
            debugIndex
        ];


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML = `

            <div class="question">

                <div class="question-number">

                    DEBUG
                    ${debugIndex + 1}
                    /
                    ${debugQuestions.length}

                </div>

                <div class="question-text">

                    ${escapeHTML(
                        q.question
                    )}

                </div>

            </div>


            <div class="debug-code">

                <pre>${escapeHTML(
                    q.code
                )}</pre>

            </div>


            <p class="debug-hint">

                🕵️ Click the part
                you think is wrong:

            </p>


            <div class="debug-options">

                ${
                    q.options
                    .map(
                        (option, index) => `

                            <button
                                class="debug-option"
                                onclick="
                                    debugAnswer(
                                        ${index}
                                    )
                                "
                            >

                                ❌
                                ${escapeHTML(
                                    option
                                )}

                            </button>

                        `
                    )
                    .join("")
                }

            </div>


            <div id="debugResult"></div>

        `;

}



/* =========================================================
   DEBUG ANSWER
========================================================= */

function debugAnswer(index) {

    const q =
        debugQuestions[
            debugIndex
        ];


    const buttons =
        document.querySelectorAll(
            ".debug-option"
        );


    buttons.forEach(
        button => {

            button.disabled =
                true;

        }
    );


    if (
        index === q.answer
    ) {

        debugScore++;


        buttons[index]
            .classList.add(
                "correct"
            );


        successSound();

        confetti();


        document
            .getElementById(
                "debugResult"
            )
            .innerHTML = `

                <div class="meme">

                    <div class="emoji">
                        🐛🔨😎
                    </div>

                    <b>
                        BUG DESTROYED! 🔥
                    </b>

                    <p>
                        ${escapeHTML(
                            q.explanation ||
                            "Correct!"
                        )}
                    </p>

                </div>

            `;

    }

    else {

        buttons[index]
            .classList.add(
                "wrong"
            );


        buttons[q.answer]
            .classList.add(
                "correct"
            );


        wrongSound();


        document
            .getElementById(
                "debugResult"
            )
            .innerHTML = `

                <div class="meme">

                    <div class="emoji">
                        🤦‍♀️💻
                    </div>

                    <b>
                        FAHHHH!
                        Wrong bug! 😂
                    </b>

                    <p>
                        Correct answer:
                        ${escapeHTML(
                            q.options[
                                q.answer
                            ]
                        )}
                    </p>

                </div>

            `;

    }


    setTimeout(
        () => {

            debugIndex++;

            drawDebugQuestion();

        },
        1800
    );

}



/* =========================================================
   DEBUG FINISH
========================================================= */

function finishDebug() {

    successSound();


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML = `

            <div class="meme">

                <div class="emoji">
                    🛠️🏆🎉
                </div>

                <h2>
                    Debugging Complete!
                </h2>

                <p>
                    You destroyed
                    ${debugScore}
                    /
                    ${debugQuestions.length}
                    bugs.
                </p>

                <br>

                <button onclick="startDebug()">
                    🔄 Debug Again
                </button>

            </div>

        `;

}



/* =========================================================
   BOMB MODE
========================================================= */

async function startBomb() {

    clearInterval(
        bombTimer
    );


    document
        .getElementById(
            "arenaTitle"
        )
        .textContent =
        "💣 Bomb Defusal Mode";


    document
        .getElementById(
            "arenaSubtitle"
        )
        .textContent =
        `${currentSubject} • Defuse before time runs out`;


    const level =
        Number(
            document
                .getElementById(
                    "level"
                )
                .textContent
        ) || 1;


    const data =
        await api(
            `/api/questions?subject=${
                encodeURIComponent(
                    currentSubject
                )
            }&level=${level}`
        );


    let questions =
        data &&
        Array.isArray(data.questions)
        ? data.questions
        : [];


    if (
        questions.length === 0
    ) {

        questions =
            getFallbackBombQuestions();

    }


    const randomQuestion =
        questions[
            Math.floor(
                Math.random()
                *
                questions.length
            )
        ];


    window.currentBombQuestion =
        randomQuestion;


    bombSeconds =
        Math.max(
            10,
            35 - level * 2
        );


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML = `

            <div class="bomb-wrapper">

                <div class="bomb-header">

                    <span>
                        💣 BOMB MODE
                    </span>

                    <strong
                        id="bombTimer"
                    >
                        ${bombSeconds}
                    </strong>

                </div>


                <div class="bomb-body">

                    <div class="bomb-icon">
                        💣
                    </div>


                    <div class="question">

                        <div class="question-number">
                            DEFUSE QUESTION
                        </div>

                        <div class="question-text">

                            ${escapeHTML(
                                randomQuestion.question
                            )}

                        </div>

                    </div>


                    <div class="bomb-options">

                        ${
                            randomQuestion.options
                            .map(
                                (option, index) => `

                                    <button
                                        onclick="
                                            checkBomb(
                                                ${index}
                                            )
                                        "
                                    >

                                        ${escapeHTML(
                                            option
                                        )}

                                    </button>

                                `
                            )
                            .join("")
                        }

                    </div>


                    <div id="bombResult"></div>

                </div>

            </div>

        `;


    bombTimer =
        setInterval(
            updateBombTimer,
            1000
        );

}



/* =========================================================
   BOMB QUESTIONS
========================================================= */

function getFallbackBombQuestions() {

    return [

        {

            question:
                "Which data structure follows FIFO?",

            options: [
                "Stack",
                "Queue",
                "Tree",
                "Graph"
            ],

            answer: 1

        },


        {

            question:
                "Which data structure follows LIFO?",

            options: [
                "Queue",
                "Stack",
                "Array",
                "Graph"
            ],

            answer: 1

        },


        {

            question:
                "Which keyword defines a function in Python?",

            options: [
                "function",
                "def",
                "func",
                "define"
            ],

            answer: 1

        },


        {

            question:
                "Which symbol checks equality?",

            options: [
                "=",
                "==",
                "!=",
                "<="
            ],

            answer: 1

        }

    ];

}



/* =========================================================
   BOMB TIMER
========================================================= */

function updateBombTimer() {

    bombSeconds--;


    const timer =
        document.getElementById(
            "bombTimer"
        );


    if (!timer) {

        clearInterval(
            bombTimer
        );

        return;

    }


    timer.textContent =
        bombSeconds;


    if (
        bombSeconds <= 5
    ) {

        timer.classList.add(
            "timer-danger"
        );

    }


    if (
        bombSeconds <= 0
    ) {

        clearInterval(
            bombTimer
        );

        explodeBomb();

    }

}



/* =========================================================
   CHECK BOMB
========================================================= */

function checkBomb(index) {

    if (
        !window.currentBombQuestion
    ) {

        return;

    }


    clearInterval(
        bombTimer
    );


    const q =
        window.currentBombQuestion;


    const buttons =
        document.querySelectorAll(
            ".bomb-options button"
        );


    buttons.forEach(
        button => {

            button.disabled =
                true;

        }
    );


    if (
        index === q.answer
    ) {

        buttons[index]
            .classList.add(
                "correct"
            );


        successSound();

        confetti();


        document
            .getElementById(
                "bombResult"
            )
            .innerHTML = `

                <div class="meme">

                    <div class="emoji">
                        💣😎🎉
                    </div>

                    <h2>
                        BOMB DEFUSED!
                    </h2>

                    <p>
                        Great job!
                        You saved the mission! 🚀
                    </p>

                    <br>

                    <button
                        onclick="startBomb()"
                    >
                        🔄 Next Bomb
                    </button>

                </div>

            `;

    }

    else {

        buttons[index]
            .classList.add(
                "wrong"
            );


        buttons[q.answer]
            .classList.add(
                "correct"
            );


        wrongSound();


        setTimeout(
            explodeBomb,
            500
        );

    }

}



/* =========================================================
   EXPLODE
========================================================= */

function explodeBomb() {

    clearInterval(
        bombTimer
    );


    wrongSound();


    document
        .getElementById(
            "arenaContent"
        )
        .innerHTML = `

            <div class="bomb-explosion">

                <div class="explosion">
                    💥
                </div>

                <h1>
                    BOOOOOOM! 💣
                </h1>

                <p>
                    Time's up! Try again. 😂
                </p>

                <br>

                <button onclick="startBomb()">
                    🔄 Try Again
                </button>

            </div>

        `;

}



/* =========================================================
   CLOSE ARENA
========================================================= */

function closeArena() {

    clearInterval(
        bombTimer
    );


    clearInterval(
        visualTimer
    );


    const arena =
        document.getElementById(
            "arena"
        );


    if (arena) {

        arena.classList.add(
            "hidden"
        );

    }

}



/* =========================================================
   CONFETTI
========================================================= */

function confetti() {

    for (
        let i = 0;
        i < 35;
        i++
    ) {

        const piece =
            document.createElement(
                "div"
            );


        piece.style.position =
            "fixed";


        piece.style.left =
            Math.random() * 100 + "%";


        piece.style.top =
            "-10px";


        piece.style.width =
            "8px";


        piece.style.height =
            "12px";


        piece.style.background =
            "#" +
            Math.floor(
                Math.random() *
                16777215
            )
            .toString(16);


        piece.style.zIndex =
            "9999";


        piece.style.borderRadius =
            "3px";


        document.body.appendChild(
            piece
        );


        let top = 0;


        const timer =
            setInterval(
                () => {

                    top += 5;


                    piece.style.top =
                        top + "px";


                    piece.style.transform =
                        `rotate(${top * 4}deg)`;


                    if (
                        top >
                        window.innerHeight
                    ) {

                        clearInterval(
                            timer
                        );

                        piece.remove();

                    }

                },
                20
            );

    }

}



/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) return;


    toast.textContent =
        message;


    toast.style.display =
        "block";


    setTimeout(
        () => {

            toast.style.display =
                "none";

        },
        2500
    );

}



/* =========================================================
   EARN VISUAL XP
========================================================= */

function earnVisualXP() {

    showToast(
        "🧪 Visual Experiment opened!"
    );


    openArena(
        "visual"
    );

}




/* =========================================================
   SUBMIT STUDENT HELP
========================================================= */

function submitStudentHelp() {

    const input =
        document.getElementById(
            "studentTip"
        );


    if (!input) return;


    const tip =
        input.value.trim();


    if (!tip) {

        showToast(
            "⚠️ Please write a programming tip first!"
        );

        return;

    }


    const overlay =
        document.querySelector(
            ".share-modal-overlay"
        );


    if (!overlay) return;


    overlay.innerHTML = `

        <div class="share-modal">

            <div class="modal-success">

                <div class="success-icon">
                    💬🎉
                </div>

                <h2>
                    Knowledge Shared!
                </h2>

                <p>
                    Your programming tip has been
                    shared successfully.
                </p>

                <div class="community-note">
                    ${escapeHTML(tip)}
                </div>

                <br>

                <button
                    class="modal-submit"
                    onclick="closeCommunityModal()"
                >
                    Done ✓
                </button>

            </div>

        </div>

    `;


    confetti();


    showToast(
        "💬 You helped a student! +30 XP"
    );

}



/* =========================================================
   SHARE NOTES
========================================================= */

function shareNotes() {

    closeCommunityModal();


    const overlay =
        document.createElement(
            "div"
        );


    overlay.className =
        "share-modal-overlay";


    overlay.innerHTML = `

        <div class="share-modal">

            <h2>
                📚 Share Useful Notes
            </h2>


            <p class="modal-subtitle">
                Share your study notes with
                the EduNova community.
            </p>


            <label>
                Note Title
            </label>


            <input
                type="text"
                id="noteTitle"
                placeholder="Example: Python If-Else Notes"
            >


            <label>
                Your Notes
            </label>


            <textarea
                id="noteContent"
                placeholder="Write your useful study notes here..."
            ></textarea>


            <div class="modal-buttons">

                <button
                    class="modal-cancel"
                    onclick="closeCommunityModal()"
                >
                    Cancel
                </button>


                <button
                    class="modal-submit"
                    onclick="submitNotes()"
                >
                    📚 Share Notes
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        overlay
    );

}



/* =========================================================
   SUBMIT NOTES
========================================================= */

function submitNotes() {

    const titleInput =
        document.getElementById(
            "noteTitle"
        );


    const contentInput =
        document.getElementById(
            "noteContent"
        );


    if (
        !titleInput ||
        !contentInput
    ) {

        return;

    }


    const title =
        titleInput.value.trim();


    const content =
        contentInput.value.trim();


    if (!title) {

        showToast(
            "⚠️ Please enter a note title!"
        );

        return;

    }


    if (!content) {

        showToast(
            "⚠️ Please write your notes!"
        );

        return;

    }


    const overlay =
        document.querySelector(
            ".share-modal-overlay"
        );


    if (!overlay) return;


    overlay.innerHTML = `

        <div class="share-modal">

            <div class="modal-success">

                <div class="success-icon">
                    📚🎉
                </div>


                <h2>
                    Notes Shared!
                </h2>


                <p>
                    Your notes have been shared
                    successfully.
                </p>


                <div class="community-note">

                    <strong>
                        ${escapeHTML(title)}
                    </strong>

                    <br><br>

                    ${escapeHTML(content)}

                </div>


                <br>


                <button
                    class="modal-submit"
                    onclick="closeCommunityModal()"
                >
                    Done ✓
                </button>

            </div>

        </div>

    `;


    confetti();


    showToast(
        "📚 Notes shared! +25 XP"
    );

}



/* =========================================================
   CLOSE MODAL
========================================================= */

function closeCommunityModal() {

    const modal =
        document.querySelector(
            ".share-modal-overlay"
        );


    if (modal) {

        modal.remove();

    }

}



/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === undefined ||
        value === null
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}



/* =========================================================
   START APP
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        init();

    }
);