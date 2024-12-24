import {useEffect} from "react";
import socket from "@/service/socket.ts";
import {useNavigate, useParams} from "react-router-dom";
import {SocketEvent} from "@/interfaces/event.ts";

export default function Wait(){
    const navigate = useNavigate();
    const {sessionId, username} = useParams();
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
        <div>
            <h1>Wait</h1>
        </div>
    )
}