from flask import Flask, render_template, url_for, session

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/game')
def game():
    return render_template('game.html')


def main():
    app.run(debug=False)


if __name__ == '__main__':
    main()
