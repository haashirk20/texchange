import { NextResponse } from 'next/server';

// In-memory storage for rooms (replace with a database in production)
let rooms: string[] = ['room1', 'room2', 'room3'];

// GET: Fetch all rooms
export async function GET() {
  return NextResponse.json({ rooms });
}

// POST: Create a new room
export async function POST(request: Request) {
  const { roomId } = await request.json();

  if (!roomId) {
    return NextResponse.json(
      { error: 'Room ID is required' },
      { status: 400 }
    );
  }

  if (rooms.includes(roomId)) {
    return NextResponse.json(
      { error: 'Room already exists' },
      { status: 400 }
    );
  }

  rooms.push(roomId);
  return NextResponse.json({ rooms }, { status: 201 });
}