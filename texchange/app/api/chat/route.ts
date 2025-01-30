import { NextResponse } from 'next/server';
import { getRoom, addMessageToRoom, broadcastToRoom, addRoomController, removeRoomController } from '../../services/queue';
import type { Message } from '../../types';

export async function POST(request: Request) {
  const { text, senderId, roomId }: Partial<Message> = await request.json();
  
  if (!text || !senderId || !roomId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const newMessage: Message = {
    id: Date.now().toString(),
    text,
    senderId,
    timestamp: new Date().toISOString(),
    roomId
  };

  addMessageToRoom(roomId, newMessage);
  broadcastToRoom(roomId, [newMessage]); // Broadcast the new message to all room participants
  
  return NextResponse.json(newMessage, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');
  
  if (!roomId) {
    return NextResponse.json(
      { error: 'Missing roomId' },
      { status: 400 }
    );
  }

  const stream = new ReadableStream({
    start(controller) {
      addRoomController(roomId, controller);
      
      // Send initial messages
      const room = getRoom(roomId);
      if (room) {
        controller.enqueue(
          new TextEncoder().encode(`data: ${JSON.stringify(room.messages)}\n\n`)
        );
      }
    },
    cancel(controller) {
      removeRoomController(controller);
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}