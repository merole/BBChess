from flask import Flask, url_for, request
from markupsafe import escape

app = Flask(__name__)


def login_user(form):
    name = form.get("name")
    password = form.get("pass")
    cont = open(name + ".txt", "r")
    cont = cont.read()
    if not password == cont.split("\n")[0]:
        return "login failed"
    acc_cont = cont.split("\n")[1:]
    return f"<h1> {name} </h1>" + \
           f"{acc_cont}"


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        return login_user(request.form)
    else:
        return "<form action=\"/login\" method=\"post\">" + \
               "<label for=\"name\">User name:</label><br>" + \
                "<input type=\"text\" name=\"name\"><br>" + \
                "<label for=\"name\">Password:</label><br>" + \
                "<input type=\"text\" name=\"pass\"><br>" + \
                "<input type=\"submit\" value=\"Submit\">" + \
                "</form>"


@app.route("/hello/<thing>")
def hello_thing(thing):
    return f"<h1 style=\"font-size=500\"> ehlo {escape(thing)} </h1>"
