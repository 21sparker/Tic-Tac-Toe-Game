from flask import Flask, render_template, url_for, request, jsonify
from hard_opponent import minimax_ttt

app = Flask(__name__)

@app.route('/')
def start_game():
    return render_template("index.html")

@app.route('/hardmove', methods=['GET','POST'])
def hard_move():
    board_matrix = request.get_json()['boardMatrix']
    _, best_move = minimax_ttt(board_matrix, False)
    return jsonify(best_move=best_move)
    



