import "./App.js";
import React from "react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import styles from "./styles.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import { home } from "./home";
import { Link } from "react-router-dom";

const socket = io("http://localhost:5000");

export function Chatroom() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("match_room", (matchedRoom) => {
      setRoom(matchedRoom);
    });

    return () => {
      socket.off("receive_message");
      socket.off("match_room");
    };
  }, []);

  const swap = () => {
    socket.emit("swap");
  };
  const sendMessage = () => {
    if (message.trim() && room) {
      socket.emit("send_message", { room, message });
      setMessage("");
    }
  };

  return (
    <div className="background">
      <header>
        <div className="leftbar">
          <h1 className="navbarText">TexChange</h1>
        </div>
        <div className="rightbar"></div>
      </header>
      <div className="intro">
        <p className="introText">Welcome to TexChange!</p>
        <Link to="/chat">
          <button className="start">START CHATTING</button>
        </Link>
      </div>
      <footer>
        <p className="footerText">Created By: Haashir K, Moses L, Avi G</p>
      </footer>
    </div>
  );
}

/* return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Chatroom</h1>
      <div className="border p-4 h-64 overflow-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 border-b">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="bg-blue-500 text-white p-2" onClick={sendMessage}>
          Send
        </button>
        <button className="bg-blue-500 text-white p-2" onClick={swap}>
          Swap
        </button>
      </div>
    </div>
  ); */
