from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)


# ==========================================
# MYSQL DATABASE CONNECTION
# ==========================================

def get_db_connection():

    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="YOUR_MYSQL_PASSWORD",
        database="edunova"
    )

    return connection


# ==========================================
# HOME PAGE
# ==========================================

@app.route('/')
def home():

    return render_template('index.html')

# ==========================================
# SAVE QUIZ RESULT
# ==========================================

@app.route("/save-result", methods=["POST"])
def save_result():

    try:

        data = request.get_json()

        subject = data["subject"]
        score = data["score"]
        total = data["total"]
        percentage = data["percentage"]

        topic_data = data["topicData"]


        connection = get_db_connection()

        cursor = connection.cursor()


        # --------------------------------------
        # SAVE MAIN QUIZ RESULT
        # --------------------------------------

        query = """
        INSERT INTO quiz_results
        (subject, score, total, percentage)
        VALUES (%s, %s, %s, %s)
        """

        cursor.execute(
            query,
            (
                subject,
                score,
                total,
                percentage
            )
        )


        # Get newly created result ID

        result_id = cursor.lastrowid


        # --------------------------------------
        # SAVE TOPIC RESULTS
        # --------------------------------------

        topic_query = """
        INSERT INTO topic_results
        (result_id, topic, correct, total, percentage)
        VALUES (%s, %s, %s, %s, %s)
        """


        for topic, topic_info in topic_data.items():

            correct = topic_info["correct"]
            topic_total = topic_info["total"]

            topic_percentage = (
                correct / topic_total
            ) * 100


            cursor.execute(
                topic_query,
                (
                    result_id,
                    topic,
                    correct,
                    topic_total,
                    topic_percentage
                )
            )


        connection.commit()

        cursor.close()
        connection.close()


        return jsonify({
            "success": True,
            "message": "Quiz result saved successfully."
        })


    except Exception as error:

        print("Database Error:", error)

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# ==========================================
# GET STUDENT PROGRESS
# ==========================================

@app.route("/progress/<subject>")
def get_progress(subject):

    try:

        connection = get_db_connection()

        cursor = connection.cursor(
            dictionary=True
        )


        query = """
        SELECT
            id,
            subject,
            score,
            total,
            percentage,
            attempt_date
        FROM quiz_results
        WHERE subject = %s
        ORDER BY attempt_date ASC
        """


        cursor.execute(
            query,
            (subject,)
        )


        results = cursor.fetchall()


        cursor.close()
        connection.close()


        return jsonify(results)


    except Exception as error:

        print("Database Error:", error)

        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# ==========================================
# RUN FLASK
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True
    )