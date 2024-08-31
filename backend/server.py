from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
#app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, logger=True)  


@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('message')
def handle_message(data):  

    emit('message', data, broadcast=False)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=4000, host='192.168.2.11')