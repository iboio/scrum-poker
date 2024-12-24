// src/socket.js
import {io} from "socket.io-client";
const SOCKET_URL = `/`;
const connectionId = localStorage.getItem('connectionId');
if (!connectionId) {
    localStorage.setItem('connectionId', crypto.randomUUID());
}
const socket = io(SOCKET_URL, {
    autoConnect: false,
});

socket.on("connect", () => {
    console.log("connected");
});

socket.on("disconnect", () => {
    console.log("disconnected");
});

socket.on("connect_error", (error) => {
    console.error("connect_error", error);
});
window.addEventListener("beforeunload", () => {
    console.log('beforeunload');
    if (localStorage.getItem('username') && sessionStorage.getItem('sessionId')) {
        socket.emit('manuelDisconnect', {
            sessionId: sessionStorage.getItem('sessionId'),
            username: localStorage.getItem('username'),
            connectionId: localStorage.getItem('connectionId'),
        });
    }
});
export default socket;
