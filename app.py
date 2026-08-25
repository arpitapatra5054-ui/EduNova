from flask import Flask, render_template, request, jsonify, session
import mysql.connector
from datetime import date, timedelta
import random


app = Flask(__name__)

app.secret_key = "edunova-sih-secret-key"


# =====================================================
# MYSQL CONNECTION
# =====================================================

DB_CONFIG = {

    "host": "localhost",

    "user": "root",

    "password": "arpita2006",

    "database": "edunova"
}


def get_db():

    return mysql.connector.connect(
        **DB_CONFIG
    )


# =====================================================
# QUESTION DATABASE
# =====================================================

QUESTIONS = {

    "Python": [

        {
            "question":
            "Which keyword is used to define a function in Python?",

            "options":
            [
                "func",
                "define",
                "def",
                "function"
            ],

            "answer": 2
        },

        {
            "question":
            "What is the output type of [1,2,3]?",

            "options":
            [
                "Tuple",
                "List",
                "Set",
                "Dictionary"
            ],

            "answer": 1
        },

        {
            "question":
            "Which operator is used for exponentiation?",

            "options":
            [
                "^",
                "**",
                "//",
                "%"
            ],

            "answer": 1
        },

        {
            "question":
            "Which keyword is used to handle exceptions?",

            "options":
            [
                "catch",
                "except",
                "error",
                "handle"
            ],

            "answer": 1
        }

    ],


    "Data Structures": [

        {
            "question":
            "Which data structure follows FIFO?",

            "options":
            [
                "Stack",
                "Queue",
                "Tree",
                "Graph"
            ],

            "answer": 1
        },

        {
            "question":
            "Which data structure follows LIFO?",

            "options":
            [
                "Queue",
                "Stack",
                "Graph",
                "Array"
            ],

            "answer": 1
        },

        {
            "question":
            "Binary search requires data to be:",

            "options":
            [
                "Random",
                "Sorted",
                "Encrypted",
                "Duplicated"
            ],

            "answer": 1
        },

        {
            "question":
            "A linked list node normally contains data and:",

            "options":
            [
                "Loop",
                "Pointer",
                "Compiler",
                "File"
            ],

            "answer": 1
        }

    ],


    "DBMS": [

        {
            "question":
            "What does DBMS stand for?",

            "options":
            [
                "Database Management System",
                "Data Backup Management System",
                "Digital Base Management System",
                "Database Memory System"
            ],

            "answer": 0
        },

        {
            "question":
            "Which key uniquely identifies a record?",

            "options":
            [
                "Foreign Key",
                "Primary Key",
                "Candidate File",
                "Normal Key"
            ],

            "answer": 1
        },

        {
            "question":
            "Which SQL command retrieves data?",

            "options":
            [
                "GET",
                "SELECT",
                "OPEN",
                "FETCH"
            ],

            "answer": 1
        },

        {
            "question":
            "Normalization mainly reduces:",

            "options":
            [
                "Security",
                "Redundancy",
                "Tables",
                "Queries"
            ],

            "answer": 1
        }

    ],


    "C Programming": [

        {
            "question":
            "Which operator gives the address of a variable?",

            "options":
            [
                "*",
                "&",
                "%",
                "#"
            ],

            "answer": 1
        },

        {
            "question":
            "Which loop executes at least once?",

            "options":
            [
                "for",
                "while",
                "do-while",
                "nested"
            ],

            "answer": 2
        },

        {
            "question":
            "What is the first index of a C array?",

            "options":
            [
                "0",
                "1",
                "-1",
                "Depends"
            ],

            "answer": 0
        }

    ],


    "Java": [

        {
            "question":
            "Which keyword creates an object?",

            "options":
            [
                "create",
                "object",
                "new",
                "make"
            ],

            "answer": 2
        },

        {
            "question":
            "Which concept allows one class to acquire another class properties?",

            "options":
            [
                "Inheritance",
                "Encapsulation",
                "Casting",
                "Compilation"
            ],

            "answer": 0
        }

    ]

}


# =====================================================
# HOME
# =====================================================

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


# =====================================================
# START STUDENT
# =====================================================

@app.route(
    "/api/start",
    methods=["POST"]
)
def start_student():

    data = request.get_json()

    name = data.get(
        "name",
        "Guest Student"
    ).strip()

    if not name:

        name = "Guest Student"


    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )


    cursor.execute(
        """
        SELECT *
        FROM students
        WHERE name=%s
        """,

        (name,)
    )


    student = cursor.fetchone()


    if student is None:

        cursor.execute(
            """
            INSERT INTO students(name)
            VALUES(%s)
            """,

            (name,)
        )

        db.commit()

        student_id = cursor.lastrowid

    else:

        student_id = student["id"]


    session["student_id"] = student_id

    session["student_name"] = name


    cursor.close()

    db.close()


    return jsonify({

        "success": True,

        "name": name,

        "student_id": student_id

    })


# =====================================================
# DASHBOARD STATE
# =====================================================

@app.route("/api/state")
def dashboard_state():

    student_id = session.get(
        "student_id"
    )


    if not student_id:

        return jsonify({
            "error":
            "Student not logged in"
        }), 401


    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )


    cursor.execute(
        """
        SELECT
        name,
        xp,
        streak,
        last_active
        FROM students
        WHERE id=%s
        """,

        (student_id,)
    )


    student = cursor.fetchone()


    cursor.close()

    db.close()


    xp = student["xp"]

    level = (
        xp // 250
    ) + 1


    next_xp = level * 250


    return jsonify({

        "name":
        student["name"],

        "xp":
        xp,

        "level":
        level,

        "next_xp":
        next_xp,

        "streak":
        student["streak"]

    })


# =====================================================
# SUBJECT LIST
# =====================================================

@app.route("/api/subjects")
def subjects():

    return jsonify({

        "subjects":
        list(QUESTIONS.keys())

    })


# =====================================================
# GET QUESTIONS
# =====================================================

@app.route("/api/questions")
def get_questions():

    subject = request.args.get(
        "subject"
    )

    level = int(
        request.args.get(
            "level",
            1
        )
    )


    question_list = QUESTIONS.get(
        subject,
        []
    )


    questions = question_list.copy()

    random.shuffle(
        questions
    )


    # Higher level = more questions
    count = min(
        len(questions),
        3 + min(level, 5)
    )


    return jsonify({

        "questions":
        questions[:count],

        "level":
        level

    })


# =====================================================
# SAVE RESULT
# =====================================================

@app.route(
    "/api/save-result",
    methods=["POST"]
)
def save_result():

    student_id = session.get(
        "student_id"
    )


    data = request.get_json()


    subject = data.get(
        "subject"
    )

    score = int(
        data.get(
            "score",
            0
        )
    )

    total = int(
        data.get(
            "total",
            1
        )
    )

    mode = data.get(
        "mode",
        "quiz"
    )


    percentage = (
        score * 100
    ) / total


    # XP calculation

    xp = score * 20


    if percentage >= 80:

        xp += 30


    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )


    # Save result

    cursor.execute(
        """
        INSERT INTO results
        (
            student_id,
            subject,
            score,
            total,
            percentage,
            mode
        )

        VALUES
        (
            %s,%s,%s,%s,%s,%s
        )
        """,

        (
            student_id,
            subject,
            score,
            total,
            percentage,
            mode
        )
    )


    # Add XP

    cursor.execute(
        """
        UPDATE students

        SET xp = xp + %s

        WHERE id=%s
        """,

        (
            xp,
            student_id
        )
    )


    # =================================================
    # STREAK SYSTEM
    # =================================================

    cursor.execute(
        """
        SELECT
        streak,
        last_active

        FROM students

        WHERE id=%s
        """,

        (student_id,)
    )


    student = cursor.fetchone()


    today = date.today()


    if student["last_active"] is None:

        new_streak = 1


    elif student["last_active"] == today:

        new_streak = student[
            "streak"
        ]


    elif student["last_active"] == (
        today -
        timedelta(days=1)
    ):

        new_streak = (
            student["streak"] + 1
        )


    else:

        new_streak = 1


    cursor.execute(
        """
        UPDATE students

        SET
        streak=%s,
        last_active=%s

        WHERE id=%s
        """,

        (
            new_streak,
            today,
            student_id
        )
    )


    db.commit()


    cursor.close()

    db.close()


    return jsonify({

        "success": True,

        "xp":
        xp,

        "percentage":
        round(
            percentage,
            2
        ),

        "streak":
        new_streak

    })


# =====================================================
# DAILY CHALLENGE
# =====================================================

@app.route("/api/daily")
def daily_challenge():

    student_id = session.get(
        "student_id"
    )


    today = date.today()


    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )


    # Check today's challenge

    cursor.execute(
        """
        SELECT *

        FROM daily_challenges

        WHERE challenge_date=%s
        """,

        (today,)
    )


    challenge = cursor.fetchone()


    # If not available create one

    if challenge is None:

        subject = random.choice(
            list(
                QUESTIONS.keys()
            )
        )


        cursor.execute(
            """
            INSERT INTO
            daily_challenges
            (
                challenge_date,
                subject,
                title,
                xp
            )

            VALUES
            (
                %s,%s,%s,%s
            )
            """,

            (
                today,
                subject,
                f"Daily {subject} Challenge",
                100
            )
        )


        db.commit()


        cursor.execute(
            """
            SELECT *

            FROM daily_challenges

            WHERE challenge_date=%s
            """,

            (today,)
        )


        challenge = cursor.fetchone()


    # Check completion

    cursor.execute(
        """
        SELECT *

        FROM daily_completions

        WHERE student_id=%s
        AND challenge_id=%s
        """,

        (
            student_id,
            challenge["id"]
        )
    )


    completed = (
        cursor.fetchone()
        is not None
    )


    cursor.close()

    db.close()


    return jsonify({

        "id":
        challenge["id"],

        "subject":
        challenge["subject"],

        "title":
        challenge["title"],

        "xp":
        challenge["xp"],

        "completed":
        completed

    })


# =====================================================
# COMPLETE DAILY CHALLENGE
# =====================================================

@app.route(
    "/api/daily/complete",
    methods=["POST"]
)
def complete_daily():

    student_id = session.get(
        "student_id"
    )


    data = request.get_json()


    challenge_id = data.get(
        "challenge_id"
    )


    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )


    cursor.execute(
        """
        SELECT *

        FROM daily_challenges

        WHERE id=%s
        """,

        (challenge_id,)
    )


    challenge = cursor.fetchone()


    if challenge is None:

        return jsonify({
            "error":
            "Challenge not found"
        }), 404


    # Avoid double XP

    cursor.execute(
        """
        SELECT *

        FROM daily_completions

        WHERE student_id=%s
        AND challenge_id=%s
        """,

        (
            student_id,
            challenge_id
        )
    )


    exists = cursor.fetchone()


    if exists is None:

        cursor.execute(
            """
            INSERT INTO
            daily_completions
            (
                student_id,
                challenge_id
            )

            VALUES
            (
                %s,%s
            )
            """,

            (
                student_id,
                challenge_id
            )
        )


        cursor.execute(
            """
            UPDATE students

            SET xp = xp + %s

            WHERE id=%s
            """,

            (
                challenge["xp"],
                student_id
            )
        )


        db.commit()


    cursor.close()

    db.close()


    return jsonify({

        "success":
        True

    })


# =====================================================
# WEEKLY LEADERBOARD
# =====================================================

@app.route("/api/leaderboard")
def leaderboard():

    student_id = session.get(
        "student_id"
    )


    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )


    cursor.execute(
        """
        SELECT
        id,
        name,
        xp

        FROM students

        ORDER BY xp DESC

        LIMIT 10
        """
    )


    students = cursor.fetchall()


    cursor.close()

    db.close()


    for index, student in enumerate(
        students,
        start=1
    ):

        student["rank"] = index

        student["you"] = (
            student["id"]
            == student_id
        )


    return jsonify(
        students
    )


# =====================================================
# RECENT ACTIVITY
# =====================================================

@app.route("/api/activity")
def activity():

    student_id = session.get(
        "student_id"
    )


    db = get_db()

    cursor = db.cursor(
        dictionary=True
    )


    cursor.execute(
        """
        SELECT
        subject,
        score,
        total,
        percentage,
        mode,
        created_at

        FROM results

        WHERE student_id=%s

        ORDER BY created_at DESC

        LIMIT 8
        """,

        (student_id,)
    )


    results = cursor.fetchall()


    cursor.close()

    db.close()


    return jsonify(
        results
    )


# =====================================================
# RUN SERVER
# =====================================================

if __name__ == "__main__":

    app.run(
        debug=True
    )