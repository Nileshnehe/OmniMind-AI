import { io } from "socket.io-client"


let socket = null;

export const initializeSocketConnection = () => {


    if (!socket) {
        socket = io("http://localhost:3000", {
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.log("Connected to Socket.IO Server with ID:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from Socket.IO Server");
        });
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};