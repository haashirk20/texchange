/*
  Custom room page, uses roomid as slug.
  precondition that there are at most two users in room
*/
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Message } from '@/app/types';

export default function ChatRoomPage() {
  // get roomid from URL
  const params = useParams();
  const roomId = params.roomid as string;

  // state hooks, allows the component (ChatRoomPage) to remember information
  // in this case: messages, user input and the users id
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [userId] = useState(() => {
    // Generate a persistent user ID for the session
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chatUserId') || Date.now().toString();
    }
    return Date.now().toString();
  });

  // useEffect hook, communicates with server backend to send and fetch messages to and from user2
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatUserId', userId);
    }
  
    // creates eventsource to server, with roomid as param
    const eventSource = new EventSource(`/api/chat?roomId=${roomId}`);
    
    // onmessage event, listens for new messages and updates the state
    eventSource.onmessage = (event) => {
      const newMessages = JSON.parse(event.data);
      setMessages(prev => [...prev, ...newMessages]);
    };
  
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
    };
  
    return () => {
      eventSource.close();
    };
  }, [roomId, userId]);

  // function to handle message submission, sends message to server api
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if no input, then return
    if (!inputText.trim()) return;

    // send post request to server api
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: inputText, 
          senderId: userId,
          roomId: roomId
        }),
      });
      setInputText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // frontend jsx code
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Room</h1>
      
      <div className="h-96 overflow-y-auto border rounded p-4 mb-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`mb-2 p-2 rounded ${message.senderId === userId ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}
          >
            <div className="text-gray-800">{message.text}</div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}