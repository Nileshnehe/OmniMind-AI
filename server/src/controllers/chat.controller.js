import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {

    try {
        const { message, chat: chatId } = req.body;
        console.log(req.body);

        let title = null;
        let chat = null;
        let activeChatId = chatId;

        if (!chatId) {
            title = await generateChatTitle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title
            });
            activeChatId = chat._id;
        }

        const userMessage = await messageModel.create({
            chat: activeChatId,
            content: message,
            role: "user"
        });


        const messages = await messageModel.find({
            chat: activeChatId
        }).sort({ createdAt: 1 });


        const result = await generateResponse(messages);
        console.log("result: ", result)
        const aiResponse = await messageModel.create({
            chat: activeChatId,
            content: result,
            role: "ai"
        });

        res.status(201).json({
            title,
            chat,
            aiResponse,
        });
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ message: "Internal Server Error while sending message" });
    }
}

export async function getChats(req, res) {
    console.log("getChat")
    try {
        const user = req.user;

        const chats = await chatModel.find({
            user: user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Chats retrieved successfully",
            chats
        });
    } catch (error) {
        console.error("Error in getChat:", error);
        res.status(500).json({ message: "Internal Server Error while retrieving chats" });
    }
}

export async function getMessage(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id
        });

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found or unauthorized"
            });
        }


        const messages = await messageModel.find({
            chat: chatId
        }).sort({ createdAt: 1 });

        res.status(200).json({
            message: "Messages retrieved successfully",
            messages
        });
    } catch (error) {
        console.error("Error in getMessage:", error);
        res.status(500).json({ message: "Internal Server Error while retrieving messages" });
    }
}

export async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: req.user.id
        });

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found or unauthorized"
            });
        }

        await messageModel.deleteMany({
            chat: chatId
        });

        res.status(200).json({
            message: "Chat and associated messages deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteChat:", error);
        res.status(500).json({
            message: "Internal Server Error while deleting chat"
        });
    }
}