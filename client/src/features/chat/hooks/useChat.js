// src/features/chat/hooks/useChat.js
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocketConnection, getSocket } from "../services/chat.socket";
import {
    setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, removeChat, setTypingStatus
}
    from "../../../store/slices/chat.slice";
import { sendMessage, getChat, getMessage, deleteChat } from "../services/chat.api";

export const useChat = () => {
    const dispatch = useDispatch();
    const { chats, currentChatId, isLoading, isAgentTyping, error } = useSelector((state) => state.chat);

    // 1. Socket Setup (For real-time typing indicators)
    useEffect(() => {
        const socket = initializeSocketConnection();

        socket.on("agentTyping", (status) => {
            dispatch(setTypingStatus(status));
        });

        return () => {
            socket.off("agentTyping");
        };
    }, [dispatch]);

    // 2. Fetch All Sidebar Chats
    const handleGetChats = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const data = await getChat();

            const formattedChats = data.chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                };
                return acc;
            }, {});

            dispatch(setChats(formattedChats));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]);

    // 3. Open Specific Chat (Hydrate Messages)
    const handleOpenChat = useCallback(async (chatId) => {
        try {
            dispatch(setCurrentChatId(chatId));

            // API sirf tabhi hit karo jab messages pehle se load na ho (Optimization)
            if (!chats[chatId] || chats[chatId].messages.length === 0) {
                dispatch(setLoading(true));
                const data = await getMessage(chatId);

                const formattedMessages = data.messages.map(msg => ({
                    content: msg.content,
                    role: msg.role,
                }));

                dispatch(addMessages({ chatId, messages: formattedMessages }));
            }
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [chats, dispatch]);

    // 4. Send Message (Hybrid: API for DB, Socket for UI)
    const handleSendMessage = useCallback(async (messageText) => {
        try {
            const socket = getSocket();
            // Start UI loading / typing indicator
            dispatch(setLoading(true));
            if (socket) socket.emit("agentTyping", true);

            // Optimistic UI Update: Turant user ka message screen par dikhao
            if (currentChatId) {
                dispatch(addNewMessage({
                    chatId: currentChatId,
                    content: messageText,
                    role: "user",
                }));
            }

            // Backend Call
            const data = await sendMessage({ message: messageText, chatId: currentChatId });
            const { chat, aiResponse, title } = data; // backend response match kiya hai

            const finalChatId = chat ? chat._id : currentChatId;

            // Agar naya chat tha (chatId null tha), toh usko pehle Redux me create karo
            if (!currentChatId && chat) {
                dispatch(createNewChat({
                    chatId: finalChatId,
                    title: title || chat.title,
                }));
                // User message retrospective add karo
                dispatch(addNewMessage({
                    chatId: finalChatId,
                    content: messageText,
                    role: "user",
                }));
                dispatch(setCurrentChatId(finalChatId));
            }

            // AI ka reply screen par add karo
            dispatch(addNewMessage({
                chatId: finalChatId,
                content: aiResponse.content,
                role: aiResponse.role || "ai",
            }));

        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            // Stop UI loading / typing indicator
            dispatch(setLoading(false));
            const socket = getSocket();
            if (socket) socket.emit("agentTyping", false);
        }
    }, [currentChatId, dispatch]);

    // 5. Delete Chat
    const handleDeleteChat = useCallback(async (chatId) => {
        try {
            await deleteChat(chatId);
            dispatch(removeChat(chatId)); // Local Redux update
        } catch (error) {
            dispatch(setError(error.message));
        }
    }, [dispatch]);

    return {
        chats,
        currentChatId,
        messages: currentChatId && chats[currentChatId] ? chats[currentChatId].messages : [],
        isLoading,
        isAgentTyping,
        error,
        handleGetChats,
        handleOpenChat,
        handleSendMessage,
        handleDeleteChat
    };
};