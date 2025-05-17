from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

offers = {}   # username: offer
answers = {}  # username: answer

@app.route('/offer/<username>', methods=['POST', 'GET'])
def offer(username):
    if request.method == 'POST':
        offers[username] = request.json
        return '', 200
    elif request.method == 'GET':
        return jsonify(offers.get(username, {}))

@app.route('/answer/<username>', methods=['POST', 'GET'])
def answer(username):
    if request.method == 'POST':
        answers[username] = request.json
        return '', 200
    elif request.method == 'GET':
        return jsonify(answers.get(username, {}))

@app.route('/')
def index():
    return '✅ WebRTC signaling server çalışıyor'
