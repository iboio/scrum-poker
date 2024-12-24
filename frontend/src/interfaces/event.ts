import {Vote} from "@/interfaces/room-component.ts";

interface UserStatusChange {
    eventType: "userStatusChange";
    users: string[];
    quitedUsers: string[];
}

interface VoteStatusChange {
    eventType: "voteEnd";
    votes: Vote[];
}

interface VotedUsers {
    eventType: "newVote";
    votes: Vote[];
}
interface NavigateUser {
    eventType: "navigate";
}
interface IsUserExist {
    eventType: "isExist";
    message: number;
}
interface Unauthorized {
    eventType: "unauthorized";
    message: number;
}
interface TaskAdded {
    eventType: "taskAdded";
}
interface SessionEnd {
    eventType: "endSession";
}
export type SocketEvent = UserStatusChange | VoteStatusChange | VotedUsers | NavigateUser | IsUserExist | Unauthorized | TaskAdded | SessionEnd;