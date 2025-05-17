from flask import Flask, render_template, request, redirect, session, url_for
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'gizli-anahtar'

users = {}  # Gerçek sistemde veritabanı gerekir

@app.route('/')
def home():
    if 'username' in session:
        return redirect(url_for('webrtc'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and check_password_hash(users[username], password):
            session['username'] = username
            return redirect(url_for('webrtc'))
        return 'Hatalı giriş!'
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = generate_password_hash(request.form['password'])
        users[username] = password
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/webrtc')
def webrtc():
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')

# 🔽 Burası önemli: Render için port tanımı yapılır
if __name__ == '__main__':
    import os

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))  # Render PORT tanımlıysa onu kullan
    app.run(host='0.0.0.0', port=port)

