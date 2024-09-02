const socket = io();

function onswitch() {
  const username = document.getElementById('username').value;
  socket.emit('switch', { username: username });
}

function joinRoom() {
  const username = document.getElementById('username').value;
  socket.emit('join', { username: username });
}

function leaveRoom() {
  const username = document.getElementById('username').value;
  socket.emit('leave', { username: username });
}

function sendMessage() {
  const msg = document.getElementById('message_input').value;
  const name = document.getElementById('username').value;
  socket.emit('message', { msg: msg, name: name });
  document.getElementById('message_input').value = '';
}

socket.on('status', function(data) {
  const li = document.createElement('li');
  li.textContent = data.msg;
  document.getElementById('messages').appendChild(li);
});

socket.on('message', function(data) {
  const li = document.createElement('li');
  li.textContent = data.msg;
  document.getElementById('messages').appendChild(li);
});