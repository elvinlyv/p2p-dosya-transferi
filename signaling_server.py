from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app)

# Kullanıcı bazlı offer/answer saklama yapısı
peers = {}
lock = threading.Lock()

@app.route('/')
def index():
    return "Signaling Server Running"

@app.route('/offer', methods=['POST'])
def offer():
    data = request.json
    username = data.get("to")
    with lock:
        peers[username] = {"offer": data.get("offer"), "answer": None}
    return jsonify({"status": "Offer received"})

@app.route('/answer', methods=['POST'])
def answer():
    data = request.json
    username = data.get("to")
    with lock:
        if username in peers:
            peers[username]["answer"] = data.get("answer")
            return jsonify({"status": "Answer saved"})
        else:
            return jsonify({"error": "No offer found for user"}), 404

@app.route('/get-offer/<username>', methods=['GET'])
def get_offer(username):
    with lock:
        user = peers.get(username)
        if user and user.get("offer"):
            return jsonify({"offer": user["offer"]})
        else:
            return jsonify({"offer": None})

@app.route('/get-answer/<username>', methods=['GET'])
def get_answer(username):
    with lock:
        user = peers.get(username)
        if user and user.get("answer"):
            return jsonify({"answer": user["answer"]})
        else:
            return jsonify({"answer": None})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
