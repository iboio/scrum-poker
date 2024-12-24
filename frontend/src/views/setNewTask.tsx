import {Input} from "@/components/ui/input.tsx";
import * as React from "react";
import {Button} from "@/components/ui/button.tsx";
import socket from "@/service/socket.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {SocketEvent} from "@/interfaces/event.ts";

export default function SetNewTask() {
    const navigate = useNavigate();
    const {sessionId, username} = useParams();
    const [addTask, setAddTask] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState(true);
    const task = () => {
        if (addTask.trim() !== "") {
            socket.emit('addNewTask', {sessionId: sessionId, task: addTask})
        } else {
            setErrorMessage(false);
        }
    }
    useEffect(() => {
        socket.connect();
        socket.on(sessionId as string, (data: SocketEvent) => {
            if (data.eventType === 'taskAdded') {
                sessionStorage.removeItem('cardKey');
                navigate(`/${sessionId}`);
            }
        });
    }, [navigate, sessionId, username]);

    return (
        <div className="flex min-h-screen items-center justify-center flex-col gap-4">
            <div className="flex flex-row">
                <Input
                    id="addtask"
                    value={addTask}
                    onChange={(e) => setAddTask(e.target.value)}
                    placeholder="Enter task"
                />
            </div>
            {!errorMessage && (
                <p className="text-red-500 text-sm">{"You should add task."}</p>
            )}
            <Button onClick={task}>Create New Task</Button>
        </div>);
}

