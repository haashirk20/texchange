from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, emit

app = Flask(__name__)
socketio = SocketIO(app)

# Store active rooms
active_rooms = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('home.html')


@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']

    # If the room doesn't exist or has less than 2 users, join it
    if room not in active_rooms:
        active_rooms[room] = []
    
    if len(active_rooms[room]) < 2:
        join_room(room)
        active_rooms[room].append(username)
        emit('status', {'msg': f'{username} has entered the room.'}, room=room)
    else:
        emit('status', {'msg': 'Room is full.'})

@socketio.on('message')
def on_message(data):
    room = data['room']
    message = data['name'] + ': ' + data['msg']
    emit('message', {'msg': message}, room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    
    leave_room(room)
    if room in active_rooms:
        active_rooms[room].remove(username)
        emit('status', {'msg': f'{username} has left the room.'}, room=room)
        
    if len(active_rooms[room]) == 0:
        del active_rooms[room]

if __name__ == '__main__':
    socketio.run(app, host= "127.0.0.1", port=4000, debug=True)