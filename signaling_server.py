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

@app.route('/answer/<username>', methods=['POST', 'GET'])
def answer(username):
    if request.method == 'POST':
        answers[username] = request.json
        return '', 200
    elif request.method == 'GET':
        return jsonify(answers.get(username, {}))

@app.route('/')
def index():
    return '✅ Çok kullanıcılı WebRTC Signaling Server aktif!'

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
