import { createSlice } from "@reduxjs/toolkit";


const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        isAgentTyping: false,
        error: null,
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;
            state.chats[chatId] = { id: chatId, title, messages: [], lastUpdated: new Date().toISOString() };
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages.push({ content, role });
            }
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages;
            }
        },
        removeChat: (state, action) => {
            const chatId = action.payload;
            delete state.chats[chatId];
            if (state.currentChatId === chatId) {
                state.currentChatId = null;
            }
        },
        setTypingStatus: (state, action) => {
            state.isAgentTyping = action.payload;
        }
    }
});

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, removeChat, setTypingStatus } = chatSlice.actions;
export default chatSlice.reducer;













// import { createSlice } from '@reduxjs/toolkit';

// const chatSlice = createSlice({
//     name: 'chat',
//     initialState: {
//         messages: [],
//         isAgentTyping: false,
//     },
//     reducers: {
//         addMessage: (state, action) => {
//             state.messages.push(action.payload);
//         },
//         setTypingStatus: (state, action) => {
//             state.isAgentTyping = action.payload; 
//         },
//         clearChat: (state) => {
//             state.messages = [];
//         }
//     }
// });

// export const { addMessage, setTypingStatus, clearChat } = chatSlice.actions;
// export default chatSlice.reducer;