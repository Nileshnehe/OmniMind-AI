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
            const { chatId, title, isGeneratingTitle } = action.payload;
            state.chats[chatId] = { id: chatId, title, messages: [], lastUpdated: new Date().toISOString(), isGeneratingTitle: isGeneratingTitle || false };
        },
        updateChatTitle: (state, action) => {
            const { chatId, title } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].title = title;
                state.chats[chatId].isGeneratingTitle = false;
            }
        },
        setGeneratingTitle: (state, action) => {
            const { chatId, isGenerating } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].isGeneratingTitle = isGenerating;
            }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role } = action.payload;
            if (state.chats[chatId]) {
                // isNew: true → typewriter animation will play for this message
                state.chats[chatId].messages.push({ content, role, isNew: true });
            }
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                // isNew: false → history messages skip animation, show instantly
                state.chats[chatId].messages = messages.map(msg => ({ ...msg, isNew: false }));
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

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, updateChatTitle, setGeneratingTitle, addNewMessage, addMessages, removeChat, setTypingStatus } = chatSlice.actions;
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