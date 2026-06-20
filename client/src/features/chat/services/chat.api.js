import API from "../../../services/api";


export const sendMessage = async ({ message, chatId }) => {
    const response = await API.post("/chats/message", {
        message: message,
        chat: chatId
    });
    return response.data;
}

export const getChat = async () => {
    const response = await API.get("/chats");
    return response.data;
}

export const getMessage = async (chatId) => {
    const response = await API.get(`/chats/${chatId}/messages`);
    return response.data;
}

export const deleteChat = async (chatId) => {
    const response = await API.delete(`/chats/delete/${chatId}`);
}
