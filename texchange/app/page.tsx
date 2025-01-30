'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  // state hook, allows the component to "remember" information like user input, in this case status
  const [status, setStatus] = useState('Join the queue to start chatting');
  // hook to access the router object, allows redirection of pages
  const router = useRouter();

  // useEffect hook, lets component interact with external systems (network, widgets, etc)
  // in this case it listens for roomid from the server (/api/queue) once available, then redirects to the room
  useEffect(() => {
    const eventSource = new EventSource('/api/queue');
    
    eventSource.onmessage = (event) => {
      setStatus('Found a chat partner!');
      const data = JSON.parse(event.data);
      router.push(`/room/${data.roomId}`);
    };

    setStatus('Looking for a chat partner...');

    return () => {
      eventSource.close();
    };
  }, [router]);


  // JSX code, the HTML-like syntax that allows embedding of JS expressions
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Chat Queue</h1>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}