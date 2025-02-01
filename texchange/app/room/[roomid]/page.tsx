'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Message } from '@/app/types';

export default function ChatRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomid as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [userId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chatUserId') || Date.now().toString();
    }
    return Date.now().toString();
  });

  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [newRoomId, setNewRoomId] = useState('');
  const [newRoomName, setNewRoomName] = useState('');

  // Fetch available rooms
  useEffect(() => {
    fetch('/api/rooms')
      .then((response) => response.json())
      .then((data) => {
        console.log('Available rooms:', data.rooms); // Debugging
        setAvailableRooms(data.rooms);
      })
      .catch((error) => console.error('Failed to fetch rooms:', error));
  }, []);

  // Handle room creation
  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: newRoomName }),
      });
      const data = await response.json();
      setAvailableRooms(data.rooms); // Update the list of rooms
      setNewRoomName(''); // Clear the input
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleSWAP = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    console.log("yo we swappin rooms rn"); // Debugging
    try {
      console.log("Sending POST request to /api/queue_req"); // Debugging
      const response = await fetch('/api/queue_req', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomId: roomId, //fetches roomID
        }),
      });
      console.log("Response received:", response); // Debugging

      // Navigate to the home page after swapping
      router.push('/');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // EventSource for real-time messages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatUserId', userId);
    }

    const eventSource = new EventSource(`/api/chat?roomId=${roomId}`);
    
    eventSource.onmessage = (event) => {
      const newMessages = JSON.parse(event.data);
      setMessages((prev) => [...prev, ...newMessages]);
    };
  
    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      eventSource.close();
    };
  
    return () => {
      eventSource.close();
    };
  }, [roomId, userId]);

  // Handle message submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: inputText, 
          senderId: userId,
          roomId: roomId,
        }),
      });
      setInputText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Room</h1>

      {/* Room Selection Dropdown */}
      <div className="mb-4">
        <label htmlFor="room-select" className="block text-sm font-medium text-gray-700">
          Swap Room
        </label>
        <select
          id="room-select"
          value={newRoomId}
          onChange={(e) => setNewRoomId(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select a room</option>
          {availableRooms.map((room) => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>
        <button
          onClick={handleSWAP}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Swap Room
        </button>
      </div>

      {/* Create New Room */}
      <div className="mb-4">
        <label htmlFor="new-room" className="block text-sm font-medium text-gray-700">
          Create New Room
        </label>
        <input
          type="text"
          id="new-room"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Enter a room name"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        />
        <button
          onClick={handleCreateRoom}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Room
        </button>
      </div>

      {/* Chat Messages */}
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

      {/* Message Input Form */}
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