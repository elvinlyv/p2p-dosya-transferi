from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

offers = {}
answers = {}

@app.route('/offer/<target>', methods=['POST', 'GET'])
def offer(target):
    if request.method == 'POST':
        offers[target] = request.json
        return '', 200
    else:
        return jsonify(offers.get(target, {}))

@app.route('/answer/<target>', methods=['POST', 'GET'])
def answer(target):
    if request.method == 'POST':
        answers[target] = request.json
        return '', 200
    else:
        return jsonify(answers.get(target, {}))

@app.route('/')
def index():
    return '✅ Signaling server çalışıyor'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
