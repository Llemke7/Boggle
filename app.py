from boggle import Boggle
from flask import Flask, render_template, session, request, jsonify

app = Flask(__name__)
app.secret_key = "secret_key"

boggle_game = Boggle()

games_played = 0
highest_score = 0


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/play')
def play():
    board = boggle_game.make_board()
    session['board'] = board

    return render_template('play.html', board=board)

@app.route('/check_guess', methods=['POST'])
def check_guess():
    guess = request.json.get('guess')

    board = session.get('board')
    totalScore = session.get('total_score', 0)
    result = boggle_game.check_valid_word(board, guess)

    return jsonify({'result': result, 'score': totalScore})

@app.route('/game_end', methods=['POST'])
def game_end():
    global games_played, highest_score

    score = request.json.get('score')
    games_played += 1

    if score > highest_score:
        highest_score = score

    return jsonify({'games_played': games_played, 'highest_score': highest_score})


if __name__ == '__main__':
    app.run(debug=True)
