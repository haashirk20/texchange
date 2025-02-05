import React from "react";
import "./App.js";
import { Link } from "react-router-dom";
import "./chat.js";

export function home() {
  return (
    <div className="background">
      <title>TexChange</title>
      <header>
        <div className="leftbar">
          <Link to="/" className="link">
            <div>
              <h1 className="navbarText">TexChange</h1>
            </div>
          </Link>
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
