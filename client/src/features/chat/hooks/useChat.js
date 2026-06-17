import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocketConnection, disconnectSocket, getSocket } from "../services/chat.socket";
import { addMessage, setTypingStatus } from "../../../store/slices/chat.slice";

export const useChat = () => {
    const dispatch = useDispatch();
    const { messages, isAgentTyping } = useSelector((state) => state.chat);

    useEffect(() => {

        const socket = initializeSocketConnection();


        socket.on("receiveMessage", (newMessage) => {
            dispatch(addMessage(newMessage));
        });

        socket.on("agentTyping", (status) => {
            dispatch(setTypingStatus(status));
        });


        return () => {
            socket.off("receiveMessage");
            socket.off("agentTyping");

        };
    }, [dispatch]);

    
    const sendMessage = useCallback((text) => {
        const socket = getSocket();
        if (socket && text.trim() !== "") {
            
            dispatch(addMessage({ sender: "user", text, timestamp: new Date().toISOString() }));

            
            socket.emit("sendMessage", { text });
        }
    }, [dispatch]);

    return {
        messages,
        isAgentTyping,
        sendMessage
    };
};