import { User } from "@prisma/client";

export interface UserAccount {
    username:  string,
    id:     string 
    email:      string,
    name:      string, 
    password:    String,
    picture: string,
    bio: string
}

export interface Messageobj {
    user: String | undefined;
    message: string,
    socketId: string,
    recipient: string
}


export type prevMessObj = {
    content: string
    createdAt: string
    id: string
    recipient: string
    roomId: string | null
    sender: UserAccount
    senderId: string
}

  
export type prevGroupMessObj = {
    messages: prevMessObj[],
    users: User[]
}

export type ConversationMessages = {
    id: string;
    content: string;
    senderId: string;
    recipient: string;
    roomId: string | null;
    createdAt: Date;
}
  