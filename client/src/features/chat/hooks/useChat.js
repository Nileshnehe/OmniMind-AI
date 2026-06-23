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
        if (!chatId) return;
        try {
            dispatch(setCurrentChatId(chatId));

            // Always fetch messages — URL-based hydration needs fresh data on reload
            dispatch(setLoading(true));
            const data = await getMessage(chatId);

            const formattedMessages = data.messages.map(msg => ({
                content: msg.content,
                role: msg.role,
            }));

            dispatch(addMessages({ chatId, messages: formattedMessages }));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }, [dispatch]); // ✅ Stable — no chats dependency

    // 4. Send Message (Hybrid: API for DB, Socket for UI)
    const handleSendMessage = useCallback(async (messageText) => {
        try {
            const socket = getSocket();
            // Start UI loading / typing indicator
            dispatch(setLoading(true));
            if (socket) socket.emit("agentTyping", true);

            let optimisticChatId = currentChatId;

            // Optimistic UI Update: Turant user ka message screen par dikhao
            if (!currentChatId) {
                // It's a new chat, so create an optimistic placeholder to show the skeleton loader
                optimisticChatId = `temp-${Date.now()}`;
                dispatch(createNewChat({
                    chatId: optimisticChatId,
                    title: "New Chat",
                    isGeneratingTitle: true
                }));
                dispatch(setCurrentChatId(optimisticChatId));
            }

            if (optimisticChatId) {
                dispatch(addNewMessage({
                    chatId: optimisticChatId,
                    content: messageText,
                    role: "user",
                }));
            }

            // Backend Call
            const startTime = Date.now();
            const data = await sendMessage({ message: messageText, chatId: currentChatId });
            
            // Add artificial delay so bouncing dots run for a few seconds first
            const elapsedTime = Date.now() - startTime;
            const minDelay = 1500; // 1.5 seconds
            if (elapsedTime < minDelay) {
                await new Promise(resolve => setTimeout(resolve, minDelay - elapsedTime));
            }

            const { chat, aiResponse, title } = data; // backend response match kiya hai

            const finalChatId = chat ? chat._id : currentChatId;

            // Agar naya chat tha (chatId null tha), toh usko pehle Redux me create karo
            if (!currentChatId && chat) {
                // Remove the optimistic temporary chat
                dispatch(removeChat(optimisticChatId));

                // Create the real chat in Redux
                dispatch(createNewChat({
                    chatId: finalChatId,
                    title: title || chat.title,
                    isGeneratingTitle: false // We already have the title
                }));

                // User message retrospective add karo
                dispatch(addNewMessage({
                    chatId: finalChatId,
                    content: messageText,
                    role: "user",
                }));
                dispatch(setCurrentChatId(finalChatId));
            } else if (title) {
                // If the chat already existed but a new title was generated
                dispatch(updateChatTitle({ chatId: finalChatId, title }));
            }

            // AI ka reply screen par add karo
            dispatch(addNewMessage({
                chatId: finalChatId,
                content: aiResponse.content,
                role: aiResponse.role || "ai",
            }));

            // Return finalChatId so Dashboard can sync the URL
            return finalChatId;

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