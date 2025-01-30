import { NextResponse } from 'next/server';
import { addToQueue } from '../../services/queue';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const userId = uuidv4();
      addToQueue(userId, controller);
    },
    cancel() {
      // Clean up queue on client disconnect
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