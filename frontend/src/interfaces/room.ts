import {Card, Task, Vote} from "@/interfaces/room-component.ts";

export interface CreateRoomRequest {
    roomName: string;
    roomRule: string;
    task: string;
    incAmount: string;
}

export interface CreateRoomResponse {
    sessionId: string;
    key: string;
}

export interface RoomResponse {
    roomRule: string;
    roomName: string;
    completedTask: Task[];
    task: Task[];
    cards: Card[];
    users: string[];
    quitedUsers: string[];
    voteStatus: string;
}

export interface RoomData {
    votes: Vote[]
    message: number
    room: RoomResponse;
    userType: string;
}