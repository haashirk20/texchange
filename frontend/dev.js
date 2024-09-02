//import "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.min.js";

let userName = sessionStorage.getItem("nick");

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

function fadeIntoQueue() {
  const overlay = document.getElementById("connectOverlay");

  overlay.addEventListener("transitionend", function switchToChat() {
    location.assign("chatroom.html");
    //overlay.removeEventListener('transitionend', switchToChat()); //removeeventlistener causes freezing
  });

  overlay.classList.toggle("show");
}

function returnHome() {
  location.assign("index.html");
}

//This will be for send message
function sendMessage() {
  let messageBox = document.getElementById("sendBox");
  let curMessage = messageBox.value;

  messageBox.value = "";

  let chatroom = document.getElementById("chatroom");
  let chatInst = document.createElement("p");
  chatInst.className = "sentChat";
  chatInst.textContent = userName + ": " + curMessage;
  chatroom.appendChild(chatInst);
  chatroom.scrollTop = chatroom.scrollHeight;
}

//This will be for receive message. Maybe have a parameter for the other user's username?
function receiveMessage() {}

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
