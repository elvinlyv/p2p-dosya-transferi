from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

offers = {}
answers = {}

@app.route('/offer/<username>', methods=['POST', 'GET'])
def offer(username):
    if request.method == 'POST':
        offers[username] = request.json
        return '', 200
    elif request.method == 'GET':
        return jsonify(offers.get(username, {}))

@app.route('/answer/<username>', methods=['POST'])
def answer(username):
    answers[username] = request.json
    return '', 200

@app.route('/')
def index():
    return '✅ WebRTC Signaling Server Çalışıyor'
