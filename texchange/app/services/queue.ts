import { v4 as uuidv4 } from 'uuid';
import { ChatRoom, Message} from '../types';

// room controllers might be redundant to queue item, deepseek just added this
// ReadableStreamDefaultController is a built-in interface in TypeScript
type RoomController = {
  roomId: string;
  controller: ReadableStreamDefaultController;
};

let roomControllers: RoomController[] = [];

export const addRoomController = (roomId: string, controller: ReadableStreamDefaultController) => {
  roomControllers.push({ roomId, controller });
};

export const removeRoomController = (controller: ReadableStreamDefaultController) => {
  roomControllers = roomControllers.filter(rc => rc.controller !== controller);
};

export const broadcastToRoom = (roomId: string, data: any) => {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  roomControllers
    .filter(rc => rc.roomId === roomId)
    .forEach(rc => {
      try {
        rc.controller.enqueue(new TextEncoder().encode(message));
      } catch (error) {
        console.error('Error broadcasting message:', error);
      }
    });
};

type QueueItem = {
  userId: string;
  controller: ReadableStreamDefaultController;
};

let queue: QueueItem[] = [];
let rooms: ChatRoom[] = [];

// called when new user joins queue, whether that be upon opening website or swapping
export const addToQueue = (userId: string, controller: ReadableStreamDefaultController) => {
  queue.push({ userId, controller });
  tryMatchUsers();
};


// checks to see if there are at least two users in the queue, if so, creates a room for them
const tryMatchUsers = () => {
  while (queue.length >= 2) {
    const [user1, user2] = queue.splice(0, 2);
    const newRoom = createRoom(user1.userId, user2.userId);
    
    const data = JSON.stringify({ roomId: newRoom.id });
    user1.controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
    user2.controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
  }
};

// creates websocket room for two users to chat in
const createRoom = (userId1: string, userId2: string): ChatRoom => {
  const newRoom: ChatRoom = {
    id: uuidv4(),
    users: [
      { id: userId1 },
      { id: userId2 }
    ],
    messages: []
  };
  rooms.push(newRoom);
  return newRoom;
};

// get function to return room based on room id
export const getRoom = (roomId: string) => {
  return rooms.find(room => room.id === roomId);
};

// add message to room
export const addMessageToRoom = (roomId: string, message: Message) => {
  const room = rooms.find(r => r.id === roomId);
  if (room) {
    room.messages = [...room.messages, message];
  }
};