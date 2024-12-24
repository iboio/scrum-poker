import { useNavigate, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useEffect, useState } from "react";
import socket from "@/service/socket.ts";
import { SocketEvent } from "@/interfaces/event.ts";

export default function Username() {
    const navigate = useNavigate();
    const { sessionId } = useParams();
    const [usernameCheck, setUsernameCheck] = useState(true);
    const [username, setUsername] = useState("");
    useEffect(() => {
        socket.connect()
        socket.emit('isRoomExist', {sessionId: sessionId})
        const handleIsExist = (data: SocketEvent) => {
            console.log(data);
            if (data.eventType === 'isExist') {
                if (data.message === 1) {
                    navigate('/error');
                }
                if (data.message === 2) {
                    setUsernameCheck(false);
                }
                if (data.message === 200) {
                    navigate(`/${sessionId}/${username}`);
                }
            }
        };
        socket.on('isExist', handleIsExist);
    }, [navigate, sessionId, username]);

    const handleUsernameSubmit = () => {
        socket.emit('isUserExist', {
            username: username,
            sessionId: sessionId,
            connectionId: sessionStorage.getItem('connectionId'),
        });
    };

    return (
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
    );
}
