from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, emit
import random

app = Flask(__name__)
socketio = SocketIO(app)
hostip = "192.168.2.11"
port = 4000

# Store active rooms
active_rooms = {}
emptyroomkeys = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/home')
def home():
    return render_template('home.html')


@socketio.on('join')
def on_join(data):
    username = data['username']

    if find_room_from_user(username) != -1:
        emit('status', {'msg': 'You are already in a room.'})
    else:
        if len(emptyroomkeys) == 0:
            while True:
                room = random.randint(1000, 9999)
                if room not in active_rooms:
                    active_rooms[room] = []
                    break
        else:
            room = random.choice(emptyroomkeys)

        print(active_rooms)
        if len(active_rooms[room]) < 2:
            join_room(room)
            active_rooms[room].append(username)
            emit('status', {'msg': f'{username} has entered room {room}.'}, room=room)
        else:
            emit('status', {'msg': 'Room is full.'})

@socketio.on('message')
def on_message(data):
    username = data['name']
    room = find_room_from_user(username)
    message = username + ': ' + data['msg']
    print(message + " at " + str(room))
    emit('message', {'msg': message}, room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = find_room_from_user(username)
    
    if room == -1:
        emit('status', {'msg': 'You are not in a room.'})
    else:
        leave_room(room)
        if room in active_rooms:
            emit('status', {'msg': f'{username} has left the room.'}, room=room)
            active_rooms[room].remove(username)
            emptyroomkeys.append(room)
            
        if len(active_rooms[room]) == 0:
            emptyroomkeys.remove(room)
            del active_rooms[room]

@socketio.on('disconnect')
def on_disconnect(data):
    on_leave(data)

@socketio.on('switch')
def on_switch(data):
    if find_room_from_user(data['username']) != -1:
        on_leave(data)
        on_join(data)
    else:
        emit('status', {'msg': 'You are not in a room.'})

def find_room_from_user(username):
    for room in active_rooms:
        if username in active_rooms[room]:
            return room
    return -1


if __name__ == '__main__':
    socketio.run(app, host= hostip, port=port, debug=True)