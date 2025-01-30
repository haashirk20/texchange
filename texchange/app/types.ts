/*
    This file contains the types that are used in the application.
    The types are used to define the structure of the data that is used in the application.
    The types are used in the components, services, and other files to ensure that the data is used correctly.
*/

export interface User {
    id: string;
    // question mark after property means name is optional
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