//import "./App.js";
import "./home.js";
import React from "react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import "./App.css";

const socket = io("http://localhost:5001");
export function Chatroom() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Track first-time loading

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("match_room", (matchedRoom) => {
      setMessages([]);
      setRoom(matchedRoom);
      setLoading(false);
      setInitialLoading(false); // Stop first-time loading when room is assigned
    });

    return () => {
      socket.off("receive_message");
      socket.off("match_room");
    };
  }, []);

  const swap = () => {
    setLoading(true);
    socket.emit("swap");
  };

  const sendMessage = () => {
    if (message.trim() && room) {
      socket.emit("send_message", { room, message });
      setMessages((prev) => [...prev, "You: " + message]);
      setMessage("");
    }
  };

  const disconnectUser = () => {
    socket.emit("disconnectUser");
  };

  return (
    <div className="background">
      <header>
      <title>TexChange</title>
        <div className="leftbar">
          <Link to="/" className="link" onClick={disconnectUser}>
            <div>
              <h1 className="navbarText">TexChange</h1>
            </div>
          </Link>
        </div>
        <div className="rightbar"></div>
      </header>
      <div className="intro">
        {/* Show loading animation when chatroom is first opened */}
        {initialLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loadingmsg">Looking for people to chat with! ...</p>
          </div>
        ) : (
          <>
            {!loading && <h1 className="navbarText">Welcome to the chatroom!</h1>}

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loadingmsg">Looking for people to chat with! ...</p>
              </div>
            ) : (
              <>
                <div id="chatbox">
                  {messages.map((msg, index) => (
                    <div key={index} className="sentChat">
                      {msg}
                    </div>
                  ))}
                </div>
                <div className="messages">
                  <input
                    type="text"
                    id="sendbox"
                    placeholder="Send Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={loading}
                  />
                  <button type="button" className="send" onClick={sendMessage} disabled={loading}>
                    SEND
                  </button>
                  <button type="button" className="send" onClick={swap} disabled={loading}>
                    SKIP
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <footer>
        <p className="footerText">Created By: Haashir K, Moses L, Aviraj G</p>
      </footer>

      {/* CSS for Loading Spinner */}
      <style>
        {`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 20px;
          }

          .loading-spinner {
            width: 80px;
            height: 80px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
