let userName = sessionStorage.getItem("nick");
const socket = io();

window.addEventListener('unload', function (e) {
  socket.emit('leave', { username: userName });
});

//After clicking connect button after entering username
function storeNick() {
  if (document.getElementById("enterNick").value.trim() == "") {
    sessionStorage.setItem(
      "nick",
      "Anonymous" + Math.floor(Math.random() * 9999 + 1)
    );
  } else {
    sessionStorage.setItem("nick", document.getElementById("enterNick").value);
  }
  fadeIntoQueue();
}

//Switches pages
function fadeIntoQueue() {
  const overlay = document.getElementById("connectOverlay");
  //"window.location.href='/chat'"
  overlay.addEventListener("transitionend", function switchToChat() {
    location.assign("/chat");
  });
  overlay.classList.toggle("show");
  //socket.emit('join', { username: userName });
}

function skipRoom() {
  const overlay = document.getElementById("connectOverlay");
  //"window.location.href='/chat'"
  overlay.addEventListener("transitionend", function switchToChat() {
    socket.emit('switch', { username: userName });
    location.assign("/chat");
  });
  overlay.classList.toggle("show");
}

function returnHome() {
  socket.emit('leave', { username: userName });
  location.assign("/");
}

//This will be for send message
function sendMessage() {
  let messageBox = document.getElementById("sendBox");
  let curMessage = messageBox.value;

  messageBox.value = "";
  
  socket.emit('message', { msg: curMessage, name: userName });
}

socket.on('message', function(data) {
  let chatroom = document.getElementById("chatroom");
  let chatInst = document.createElement("p");
  chatInst.className = "sentChat";

  chatInst.textContent = data.msg;

  chatroom.appendChild(chatInst);
  chatroom.scrollTop = chatroom.scrollHeight;
});

function sendMessageWithEnter(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
}

function storeNickWithEnter(e) {
  if (e.key === "Enter") {
    storeNick();
  }
}

function joinRoom() {
  socket.emit('join', { username: userName });
}
