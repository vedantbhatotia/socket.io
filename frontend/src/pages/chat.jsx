import { useState, useEffect } from "react";
import axios from "axios";

const Chat = () => {
    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        try {
            const response = await axios.get("/api/chat");
            setChats(response.data);
        } catch (error) {
            console.error("Error fetching chats:", error);
        }
    };

    useEffect(() => {
        fetchChats();
    }, []);

    return (
        <>
            <div>
                {chats.map(chat => (
                    <div key={chat._id}>{chat.chatName}</div>
                ))}
            </div>
        </>
    );
};

export default Chat;
