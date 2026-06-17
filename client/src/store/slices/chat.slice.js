import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: [],
        isAgentTyping: false,
    },
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setTypingStatus: (state, action) => {
            state.isAgentTyping = action.payload; 
        },
        clearChat: (state) => {
            state.messages = [];
        }
    }
});

export const { addMessage, setTypingStatus, clearChat } = chatSlice.actions;
export default chatSlice.reducer;