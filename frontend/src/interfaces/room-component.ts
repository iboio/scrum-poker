export interface Card {
    key: string;
    value: string;
}
export interface Vote {
    username: string;
    card: Card;
}

export interface Task {
    task: string;
    taskStatus: string;
}
