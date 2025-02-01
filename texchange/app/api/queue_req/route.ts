import { getRoom, swapUsers } from "@/app/services/queue";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the request body to get the roomId
    const { roomId } = await request.json();

    if (!roomId) {
      return NextResponse.json(
        { error: 'roomId is required' },
        { status: 400 }
      );
    }

    // Get the room object
    const room = getRoom(roomId);

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Swap users in the room
    swapUsers(room);

    return NextResponse.json({ success: true, roomId });
  } catch (error) {
    console.error('Error in POST /api/queue_req:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}