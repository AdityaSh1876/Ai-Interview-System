import os

from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)

app.secret_key = os.environ.get("SESSION_SECRET", "dev-only-interview-secret")

questions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "What is your biggest weakness?",
    "Why should we hire you?",
    "Where do you see yourself in 5 years?",
]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/start", methods=["POST"])
def start():
    name = request.form["name"]

    session["name"] = name
    session["answers"] = []

    return redirect(url_for("interview", q=0))


@app.route("/interview")
def interview():
    q = int(request.args.get("q", 0))

    if q >= len(questions):
        return redirect(url_for("result"))

    return render_template(
        "interview.html",
        name=session.get("name"),
        question=questions[q],
        q=q,
        total=len(questions),
    )


@app.route("/submit", methods=["POST"])
def submit():
    answer = request.form["answer"]
    q = int(request.form["q"])

    answers = session.get("answers", [])

    answers.append(answer)

    session["answers"] = answers

    next_q = q + 1

    if next_q >= len(questions):
        return redirect(url_for("result"))

    return redirect(url_for("interview", q=next_q))


@app.route("/result")
def result():
    name = session.get("name", "Candidate")
    answers = session.get("answers", [])

    total_length = sum(len(answer) for answer in answers)

    score = min(100, total_length // 5)

    return render_template("result.html", name=name, answers=answers, score=score)


@app.route("/healthz")
def healthz():
    return {"status": "ok"}


@app.route("/favicon.ico")
def favicon():
    return "", 204


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=False)
