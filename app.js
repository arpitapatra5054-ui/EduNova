let currentSubject = "Python";

let quiz = [];

let questionIndex = 0;

let score = 0;

let answered = false;



// =====================================================
// API
// =====================================================

async function api(url, options = {}) {

    const response =
        await fetch(url, options);

    return await response.json();
}


async function post(url, data) {

    return api(
        url,
        {
            method: "POST",

            headers:{
                "Content-Type":
                "application/json"
            },

            body:
            JSON.stringify(data)
        }
    );

}



// =====================================================
// INITIAL LOAD
// =====================================================

async function init(){

    const subjects =
        await api(
            "/api/subjects"
        );


    const select =
        document.getElementById(
            "subjectSelect"
        );


    select.innerHTML =
        subjects.subjects
        .map(
            s =>
            `<option>${s}</option>`
        )
        .join("");


    currentSubject =
        select.value;


    await refreshDashboard();

    await loadDaily();

    await loadLeaderboard();

    await loadActivity();

}



init();



// =====================================================
// START STUDENT
// =====================================================

async function startStudent(){

    const name =
        document
        .getElementById(
            "nameInput"
        )
        .value
        .trim();


    if(!name){

        showToast(
            "Please enter your name"
        );

        return;
    }


    const result =
        await post(
            "/api/start",
            {
                name:name
            }
        );


    if(result.success){

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
            "Welcome to EduNova 🚀"
        );


        await refreshDashboard();

        await loadDaily();

        await loadLeaderboard();

        await loadActivity();

    }

}



// =====================================================
// DASHBOARD
// =====================================================

async function refreshDashboard(){

    const data =
        await api(
            "/api/state"
        );


    document
    .getElementById(
        "profileName"
    )
    .textContent =
    data.name;


    document
    .getElementById(
        "level"
    )
    .textContent =
    data.level;


    document
    .getElementById(
        "totalXP"
    )
    .textContent =
    data.xp;


    document
    .getElementById(
        "xpNow"
    )
    .textContent =
    data.xp + " XP";


    document
    .getElementById(
        "xpNext"
    )
    .textContent =
    data.next_xp + " XP";


    let previous =
        (data.level - 1)
        * 250;


    let percent =
        (
            (data.xp - previous)
            / 250
        ) * 100;


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
        data.next_xp - data.xp
    } XP to unlock Level ${
        data.level + 1
    }.`;


    document
    .getElementById(
        "streakText"
    )
    .textContent =
    `You're on a ${
        data.streak
    } day streak!`;


    updateStreak(
        data.streak
    );

}



// =====================================================
// STREAK
// =====================================================

function updateStreak(streak){

    const days =
        document.querySelectorAll(
            ".week i"
        );


    days.forEach(
        (day,index)=>{

            if(
                index >=
                7 - streak
            ){

                day.classList
                .add("active");

            }

            else{

                day.classList
                .remove("active");

            }

        }
    );

}



// =====================================================
// SUBJECT
// =====================================================

document
.getElementById(
    "subjectSelect"
)
.addEventListener(
    "change",
    function(){

        currentSubject =
        this.value;

    }
);



// =====================================================
// DAILY CHALLENGE
// =====================================================

async function loadDaily(){

    const data =
        await api(
            "/api/daily"
        );


    document
    .getElementById(
        "dailyTitle"
    )
    .textContent =
    data.title;


    document
    .getElementById(
        "dailyDesc"
    )
    .textContent =
    `Complete ${
        data.subject
    } challenge and earn ${
        data.xp
    } XP.`;


    document
    .getElementById(
        "dailyStatus"
    )
    .textContent =
    data.completed
    ? "1/1"
    : "0/1";


    const button =
        document
        .getElementById(
            "dailyButton"
        );


    if(data.completed){

        button.disabled =
        true;

        button.textContent =
        "Completed ✓";

    }

    else{

        button.disabled =
        false;

        button.textContent =
        "Complete Challenge";

    }

}



// =====================================================
// START DAILY
// =====================================================

async function startDaily(){

    const data =
        await api(
            "/api/daily"
        );


    currentSubject =
        data.subject;


    document
    .getElementById(
        "subjectSelect"
    )
    .value =
    data.subject;


    openArena(
        "quiz"
    );

}



// =====================================================
// LEADERBOARD
// =====================================================

async function loadLeaderboard(){

    const data =
        await api(
            "/api/leaderboard"
        );


    const box =
        document
        .getElementById(
            "leaderboard"
        );


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

                ${student.name}

                </span>


                <strong>

                ${student.xp}
                XP

                </strong>

            </div>

            `
        )
        .join("");

}



// =====================================================
// ACTIVITY
// =====================================================

async function loadActivity(){

    const data =
        await api(
            "/api/activity"
        );


    const box =
        document
        .getElementById(
            "activity"
        );


    if(data.length === 0){

        box.innerHTML =
        "No activity yet.";

        return;

    }


    box.innerHTML =
        data
        .map(
            item => `

            <div
            class="activity-row"
            >

                <div>

                    <b>
                    ${
                        item.subject
                    }
                    Quiz
                    </b>

                    <small>

                    ${
                        item.score
                    } /
                    ${
                        item.total
                    }
                    correct

                    •
                    ${
                        item.percentage
                    }%

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



// =====================================================
// ARENA
// =====================================================

function openArena(mode){

    const arena =
        document
        .getElementById(
            "arena"
        );


    arena.classList
    .remove("hidden");


    arena.scrollIntoView({
        behavior:"smooth"
    });


    if(mode === "quiz"){

        startQuiz();

    }

    else if(mode === "visual"){

        startVisual();

    }

    else if(mode === "debug"){

        startDebug();

    }

    else if(mode === "bomb"){

        startBomb();

    }

}



// =====================================================
// QUIZ
// =====================================================

async function startQuiz(){

    document
    .getElementById(
        "arenaTitle"
    )
    .textContent =
    "🧠 Quiz Arena";


    const level =
        Number(
            document
            .getElementById(
                "level"
            )
            .textContent
        );


    const data =
        await api(
            `/api/questions?subject=${
                encodeURIComponent(
                    currentSubject
                )
            }&level=${level}`
        );


    quiz =
        data.questions;


    questionIndex = 0;

    score = 0;

    drawQuestion();

}



function drawQuestion(){

    if(
        questionIndex >=
        quiz.length
    ){

        finishQuiz();

        return;

    }


    answered = false;


    const q =
        quiz[
            questionIndex
        ];


    document
    .getElementById(
        "arenaContent"
    )
    .innerHTML = `

    <div class="question">

        Question ${
            questionIndex + 1
        }
        /
        ${quiz.length}

        <br><br>

        ${q.question}

    </div>


    <div class="options">

        ${

            q.options
            .map(
                (option,index)=>

                `

                <button
                class="option"
                onclick="
                answerQuestion(
                    ${index}
                )
                "
                >

                ${option}

                </button>

                `
            )
            .join("")

        }

    </div>


    <div id="reaction">

    </div>

    `;

}



function answerQuestion(index){

    if(answered)
        return;


    answered = true;


    const q =
        quiz[
            questionIndex
        ];


    const options =
        document
        .querySelectorAll(
            ".option"
        );


    options.forEach(
        (button,i)=>{

            button.disabled =
            true;


            if(
                i === q.answer
            ){

                button.classList
                .add(
                    "correct"
                );

            }


            if(
                i === index &&
                i !== q.answer
            ){

                button.classList
                .add(
                    "wrong"
                );

            }

        }
    );


    if(
        index ===
        q.answer
    ){

        score++;


        successSound();


        showMeme(
            true
        );

    }

    else{

        wrongSound();


        showMeme(
            false
        );

    }


    setTimeout(
        ()=>{

            questionIndex++;

            drawQuestion();

        },
        1200
    );

}



// =====================================================
// QUIZ FINISH
// =====================================================

async function finishQuiz(){

    const result =
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


    // Daily Challenge

    const daily =
        await api(
            "/api/daily"
        );


    if(
        !daily.completed &&
        daily.subject ===
        currentSubject &&
        score >=
        Math.ceil(
            quiz.length * .6
        )
    ){

        await post(
            "/api/daily/complete",
            {
                challenge_id:
                daily.id
            }
        );

    }


    document
    .getElementById(
        "arenaContent"
    )
    .innerHTML = `

    <div class="meme">

        <div class="emoji">
        🏆🎉
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

        ${result.percentage}%

        </p>

        <br>

        <button
        onclick="
        startQuiz()
        "
        >

        Play Again

        </button>

    </div>

    `;


    await refreshDashboard();

    await loadDaily();

    await loadLeaderboard();

    await loadActivity();


    confetti();

}



// =====================================================
// FUNNY MEMES
// =====================================================

function showMeme(correct){

    const box =
        document
        .getElementById(
            "reaction"
        );


    if(correct){

        box.innerHTML = `

        <div class="meme">

            <div class="emoji">
            😎🧠✨
            </div>

            <b>
            PERFECT! Brain.exe is working! 🔥
            </b>

        </div>

        `;

        confetti();

    }

    else{

        box.innerHTML = `

        <div class="meme">

            <div class="emoji">
            🤦‍♀️💻😂
            </div>

            <b>
            FAHHHH! Bug found in your brain 😂
            </b>

        </div>

        `;

    }

}



// =====================================================
// SOUND
// =====================================================

function sound(
    frequency,
    duration,
    type
){

    try{

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

    catch(error){

        console.log(error);

    }

}



function successSound(){

    sound(
        880,
        .12,
        "sine"
    );


    setTimeout(
        ()=>{
            sound(
                1200,
                .15,
                "sine"
            );
        },
        100
    );

}



function wrongSound(){

    sound(
        150,
        .25,
        "sawtooth"
    );

}



// =====================================================
// VISUAL SIMULATOR
// =====================================================

function startVisual(){

    document
    .getElementById(
        "arenaTitle"
    )
    .textContent =
    "🎨 Visual Simulator";


    document
    .getElementById(
        "arenaContent"
    )
    .innerHTML = `

    <div class="meme">

        <div class="emoji">
        📦 🔗 🔁 🌳
        </div>

        <h3>
        ${currentSubject}
        Visual Playground
        </h3>

        <p>
        Array → Linked List →
        Stack → Queue →
        Loop → Tree
        </p>

        <br>

        <button
        onclick="runVisual()"
        >

        ▶ Start Simulation

        </button>

    </div>

    `;

}



function runVisual(){

    const box =
        document
        .getElementById(
            "arenaContent"
        );


    let items = [
        "10",
        "20",
        "30",
        "40",
        "50"
    ];


    box.innerHTML = `

    <h3>
    Array Storage
    </h3>

    <div
    id="visualBlocks"
    class="tool-grid"
    >

    </div>

    <br>

    <button
    onclick="addVisualBlock()"
    >

    Add Element

    </button>

    `;


    window.visualItems =
    items;


    drawVisual();

}



function drawVisual(){

    document
    .getElementById(
        "visualBlocks"
    )
    .innerHTML =

    window.visualItems
    .map(
        (item,index)=>

        `

        <div class="card">

        Index ${index}

        <br>

        <b>
        ${item}
        </b>

        </div>

        `
    )
    .join("");

}



function addVisualBlock(){

    window.visualItems.push(
        Math.floor(
            Math.random()*100
        )
    );


    drawVisual();

}



// =====================================================
// DEBUG
// =====================================================

function startDebug(){

    document
    .getElementById(
        "arenaTitle"
    )
    .textContent =
    "🛠 Debug Arena";


    document
    .getElementById(
        "arenaContent"
    )
    .innerHTML = `

    <div class="question">

    Find the mistake:

    <pre>

int a = 10;

if(a = 10){

    printf("Equal");

}

    </pre>

    </div>


    <br>

    <button
    onclick="debugAnswer(false)"
    >
    a = 10
    </button>


    <button
    onclick="debugAnswer(true)"
    >
    printf
    </button>


    <div
    id="debugResult"
    >
    </div>

    `;

}



function debugAnswer(correct){

    if(correct){

        successSound();

        confetti();

        document
        .getElementById(
            "debugResult"
        )
        .innerHTML = `

        <div class="meme">

        😎🔥

        <br>

        Correct!

        <br>

        Use

        <b>
        a == 10
        </b>

        for comparison.

        </div>

        `;

    }

    else{

        wrongSound();

        document
        .getElementById(
            "debugResult"
        )
        .innerHTML = `

        <div class="meme">

        🤦‍♀️

        <br>

        Nope!

        </div>

        `;

    }

}



// =====================================================
// BOMB MODE
// =====================================================

let bombTimer;

let bombSeconds;


function startBomb(){

    document
    .getElementById(
        "arenaTitle"
    )
    .textContent =
    "💣 Bomb Defusal Mode";


    const level =
        Number(
            document
            .getElementById(
                "level"
            )
            .textContent
        );


    bombSeconds =
        Math.max(
            15,
            35 - level * 2
        );


    document
    .getElementById(
        "arenaContent"
    )
    .innerHTML = `

    <div
    class="meme"
    >

        <div
        class="emoji"
        >
        💣
        </div>


        <h1
        id="bombTimer"
        >

        ${bombSeconds}

        </h1>


        <h3>
        DEFUSE THE QUESTION
        </h3>


        <p>

        What does FIFO mean?

        </p>


        <br>


        <input
        id="bombAnswer"
        placeholder="Type answer"
        >


        <button
        onclick="checkBomb()"
        >

        DEFUSE

        </button>

    </div>

    `;


    clearInterval(
        bombTimer
    );


    bombTimer =
        setInterval(
            ()=>{

                bombSeconds--;


                const timer =
                    document
                    .getElementById(
                        "bombTimer"
                    );


                if(timer)
                    timer.textContent =
                    bombSeconds;


                if(
                    bombSeconds <= 0
                ){

                    clearInterval(
                        bombTimer
                    );


                    explodeBomb();

                }

            },
            1000
        );

}



function checkBomb(){

    clearInterval(
        bombTimer
    );


    const answer =
        document
        .getElementById(
            "bombAnswer"
        )
        .value
        .trim()
        .toLowerCase();


    if(
        answer ===
        "first in first out"
        ||
        answer ===
        "fifo"
    ){

        successSound();

        confetti();


        document
        .getElementById(
            "arenaContent"
        )
        .innerHTML = `

        <div class="meme">

        🎉💣

        <h2>
        BOMB DEFUSED!
        </h2>

        <div class="emoji">
        😎🏆
        </div>

        </div>

        `;

    }

    else{

        wrongSound();

        explodeBomb();

    }

}



function explodeBomb(){

    document
    .getElementById(
        "arenaContent"
    )
    .innerHTML = `

    <div class="meme">

        <div class="emoji">
        💥💣🤯
        </div>

        <h2>
        FAHHHH!
        </h2>

        <p>
        Virtual Bomb Exploded 😂
        </p>

        <br>

        <button
        onclick="startBomb()"
        >

        Try Again

        </button>

    </div>

    `;

}



// =====================================================
// CLOSE
// =====================================================

function closeArena(){

    clearInterval(
        bombTimer
    );


    document
    .getElementById(
        "arena"
    )
    .classList
    .add(
        "hidden"
    );

}



// =====================================================
// CONFETTI
// =====================================================

function confetti(){

    for(
        let i=0;
        i<30;
        i++
    ){

        const piece =
            document.createElement(
                "div"
            );


        piece.style.position =
        "fixed";


        piece.style.left =
        Math.random()*100
        + "%";


        piece.style.top =
        "-10px";


        piece.style.width =
        "8px";


        piece.style.height =
        "12px";


        piece.style.background =
        "#"+Math.floor(
            Math.random()*16777215
        ).toString(16);


        piece.style.zIndex =
        "9999";


        document
        .body
        .appendChild(
            piece
        );


        let top = 0;


        const timer =
            setInterval(
                ()=>{

                    top += 5;

                    piece.style.top =
                    top+"px";


                    if(top > window.innerHeight){

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



// =====================================================
// TOAST
// =====================================================

function showToast(message){

    const toast =
        document
        .getElementById(
            "toast"
        );


    toast.textContent =
    message;


    toast.style.display =
    "block";


    setTimeout(
        ()=>{
            toast.style.display =
            "none";
        },
        2500
    );

}