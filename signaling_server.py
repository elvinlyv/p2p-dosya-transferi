from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Tüm istemcilere izin verir

offer_data = None
answer_data = None

@app.route('/offer', methods=['POST', 'GET'])
def offer():
    global offer_data
    if request.method == 'POST':
        offer_data = request.json
        return '', 200
    elif request.method == 'GET':
        return jsonify(offer_data)

@app.route('/answer', methods=['POST', 'GET'])
def answer():
    global answer_data
    if request.method == 'POST':
        answer_data = request.json
        return '', 200
    elif request.method == 'GET':
        return jsonify(answer_data)

@app.route('/')
def index():
    return '✅ WebRTC Signaling Server Çalışıyor'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
