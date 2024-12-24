import {useNavigate, useParams} from "react-router-dom";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useEffect, useState} from "react";
import socket from "@/service/socket.ts";
import {SocketEvent} from "@/interfaces/event.ts";
import {RoomData} from "@/interfaces/room.ts";
import {Card, Task, Vote} from "@/interfaces/room-component.ts";
import CardList from "@/components/room/cards/card-list.tsx";
import TaskTable from "@/components/room/tables/task-table.tsx";
import UserTable from "@/components/room/tables/user-table.tsx";
import VoteTable from "@/components/room/tables/vote-table.tsx";

export default function PokerRoom() {
    const navigate = useNavigate();
    const {sessionId} = useParams();
    const [usernameCheck, setUsernameCheck] = useState(true);
    const [usernameIsOkay, setUsernameIsOkay] = useState(true);
    const [username, setUsername] = useState("");
    const [roomData, setRoomData] = useState<RoomData>()
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [votedUsers, setVotedUsers] = useState<string[]>([]);
    const [endVote, setEndVote] = useState<string[]>([]);
    const [votes, setVotes] = useState<Vote[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    const [userType, setUserType] = useState("");
    useEffect(() => {
        if (!socket.connected) socket.connect();
        socket.emit('isRoomExist', {sessionId: sessionId})
        console.log("isRoomExist")
    }, []);
    const handleUsernameSubmit = () => {
        socket.emit('isUsernameExist', {
            username: username,
            sessionId: sessionId,
            connectionId: localStorage.getItem('connectionId'),
        });
    }
    const handleCardClick = (key: string, value: string) => {
        sessionStorage.setItem('cardKey', key);
        sessionStorage.setItem('cardValue', value);
        socket.emit('vote', {
            sessionId: sessionId,
            username: localStorage.getItem('username'),
            card: {key: key, value: value} as Card
        })
    };
    const EndVoteHandler = () => {
        socket.emit('voteEnd', { sessionId: sessionId })
    }
    const nextTask = () => {
        if (roomData?.room.task) {
            const getTask = roomData.room.task[0].task
            socket.emit('taskEnd', {sessionId: sessionId, task: getTask})
        }
    }
    const endSession = () => {
        socket.emit('endSession', {sessionId: sessionId})
    }
    useEffect(() => {
        const handleEvent = (data: SocketEvent) => {
            // message = 1 => room not exist, navigate to error page
            // message = 2 => room exist but user don't know, user going to check user
            // message = 3 => room exist and user exist, go to room
            // message = 4 => username exist but user don't exist, give a username
            // message = 5 => username is already exist in room
            // message = 200 => username is okay, go to room
            if (data.eventType === 'isExist') {
                if (data.message === 1) {
                    console.log(data.message)
                    console.log("room not exist")
                    navigate('/error');
                }
                if (data.message === 2) {
                    console.log(data.message)
                    console.log("room exist but user don't know")
                    sessionStorage.setItem('sessionId', sessionId as string);
                    socket.emit('amIExist', {
                        sessionId: sessionId,
                        username: localStorage.getItem('username'),
                        connectionId: localStorage.getItem('connectionId'),
                        key: sessionStorage.getItem('key'),
                    })
                }
                if (data.message === 3) {
                    console.log("room exist and user exist")
                    if (
                        sessionStorage.getItem('cardKey') &&
                        sessionStorage.getItem('cardKey') !== "" &&
                        sessionStorage.getItem('cardValue') &&
                        sessionStorage.getItem('cardValue') !== ""
                    ) {
                        console.log("vote")
                        socket.emit('vote', {
                            sessionId: sessionId,
                            username: localStorage.getItem('username'),
                            card: {
                                key: sessionStorage.getItem('cardKey'),
                                value: sessionStorage.getItem('cardValue')
                            } as Card
                        });
                    }
                    setUsernameIsOkay(false);
                    setLoading(false);
                }
                if (data.message === 4) {
                    setLoading(false);
                }
                if (data.message === 5) {
                    setUsernameCheck(false);
                }
                if (data.message === 200) {
                    setLoading(false);
                    setUsernameIsOkay(false);
                    localStorage.setItem('username', username);
                    socket.emit('joinRoom', {
                        sessionId: sessionId,
                        username: username,
                        key: sessionStorage.getItem('key'),
                        connectionId: localStorage.getItem('connectionId'),
                    })
                }
            }
            if (data.eventType === "endSession") {
                sessionStorage.removeItem('sessionId');
                localStorage.removeItem('username');
                navigate(`/`)
            }
            if (data.eventType === "userStatusChange") {
                setUsers(data.users)
            }
            if (data.eventType === "newVote") {
                const users = data.votes.map((vote) => vote.username)
                setVotedUsers(users)
                setVotes(data.votes)
            }
            if (data.eventType === 'navigate') {
                if (userType === "admin") {
                    navigate(`/${sessionId}/task`)
                } else {
                    navigate(`/${sessionId}/wait`)
                }
                setShow(false);
                setEndVote([]);
            }
            if (data.eventType === "voteEnd") {
                setShow(true);
                const values = data.votes.map(cardValues => cardValues.card.value)
                setEndVote(values)
            }
        };
        const handleRoomData = (data: RoomData) => {
            if (data.room.voteStatus === "task adding") {
                navigate(`${sessionId}/wait`)
            }
            if (data.room.voteStatus === "ended") {
                setShow(true);
                const values = data.votes.map(value => value.card.value)
                setEndVote(values)
            }
            if (data.votes !== undefined) {
                const users = data.votes.map((vote) => vote.username)
                setVotedUsers(users)
                setVotes(data.votes)
            }
            setUsername(localStorage.getItem('username') as string)
            setUsers(data.room.users)
            setRoomData(data)
            setUserType(data.userType)
            setTimeout(() => setLoading(false), 1500)
        };
        if (!socket.connected) socket.connect();
        socket.on('joinRoom', (data: RoomData) => {
            handleRoomData(data)
        });
        socket.on(sessionId as string, (data: SocketEvent) => {
            handleEvent(data)
        });
    }, []);
    return (
        loading ? (
            <p>Loading...</p>
        ) : (
            usernameIsOkay ? (
                <div className="flex min-h-screen items-center justify-center flex-col gap-4">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        value={username}
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)} // Kullanıcı adı input
                    />
                    {!usernameCheck && (
                        <p className="text-red-500 text-sm">
                            {"This Username already exist, please try another"}
                        </p>
                    )}
                    <button
                        onClick={handleUsernameSubmit}
                        className="mt-4 p-2 bg-blue-500 text-white rounded"
                    >
                        Join Room
                    </button>
                </div>
            ) : (
                loading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        {roomData && (roomData.room.cards as Card[]).length > 0 ? (
                            <>
                                <div className="flex flex-col p-1">
                                    <div className="w-full flex flex-row justify-between flex-wrap p-4">
                                        <h2 className="text-5xl font-bold">{roomData.room.roomName}</h2>
                                        <h2 className="text-5xl font-bold">{username}</h2>
                                    </div>
                                    <div className="flex flex-row h-full">
                                        <div className="w-8/12">
                                            <CardList onCardClick={handleCardClick}
                                                      cards={roomData.room.cards as Card[]}></CardList>
                                        </div>
                                        <div className="flex flex-col w-4/12 h-full space-y-4 p-1">
                                            <div>
                                                <TaskTable competedTasks={roomData.room.completedTask}
                                                           task={roomData.room.task as Task[]}></TaskTable>
                                            </div>
                                            <div className="flex-1 flex items-center justify-center p-1">
                                                <UserTable users={users} show={show} votes={votes}
                                                           votedUsers={votedUsers}></UserTable>
                                            </div>
                                            <div className="flex-1 flex items-center justify-center p-1">
                                                <VoteTable votes={endVote}></VoteTable>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        {roomData.userType === "admin" && (
                                            <>
                                                <button
                                                    onClick={EndVoteHandler}
                                                    className="p-2 bg-blue-500 text-white rounded"
                                                >
                                                    Finish
                                                </button>
                                                {show && (
                                                    <button
                                                        onClick={nextTask}
                                                        className="p-2 bg-blue-500 text-white rounded"
                                                    >
                                                        Next
                                                    </button>
                                                )}
                                                <button
                                                    onClick={endSession}
                                                    className="p-2 bg-blue-500 text-white rounded"
                                                >
                                                    End Session
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : <p>no card bro</p>
                        }
                    </div>
                )
            )
        )

    )
}