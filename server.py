import os

from flask import Flask, render_template, send_file
from flask_socketio import SocketIO

test_config = None
app = Flask(__name__, instance_relative_config=True)
app.config.from_mapping(
    SECRET_KEY="dev"
)

if test_config is None:
    app.config.from_pyfile("config.py", silent=True)
else:
    app.config.from_mapping(test_config)

try:
    os.makedirs(app.instance_path)
except OSError:
    pass


@app.route('/')
def hello_handler():
    return render_template("base.html")


@app.route('/images/<filename>')
def images(filename):
    return send_file(f'static/images/{filename}')


socketio = SocketIO(app)


@socketio.on('message')
def message_handler(msg):
    print(msg)


if __name__ == "__main__":
    socketio.run(app)
