export interface User {
    id: string;
    name?: string;
}
  
export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
    roomId: string;
}

export interface ChatRoom {
    id: string;
    users: User[];
    messages: Message[];
}