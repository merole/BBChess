from flask import Flask, render_template, url_for, send_file
import os


def create_app(test_config=None):
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

    return app

