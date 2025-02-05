import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { home } from "./home";
import { chat, Chatroom } from "./chat";

export default function starting() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" Component={home} />
        <Route path="/chat" Component={Chatroom} />
      </Routes>
    </HashRouter>
  );

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
}
