'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [status, setStatus] = useState('Join the queue to start chatting');
  const router = useRouter();

  useEffect(() => {
    const eventSource = new EventSource('/api/queue');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      router.push(`/room/${data.roomId}`);
    };

    setStatus('Looking for a chat partner...');

    return () => {
      eventSource.close();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Chat Queue</h1>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}