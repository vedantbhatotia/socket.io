import { ChatState } from "../context/chatProvider";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState, useEffect } from "react";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./chatloading";
import { getSender } from "../chatlogics";
import "../Mychats.css"; // Import the CSS file

function MyChats() {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:8001/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error("Failed to load the chats", error);
    }
  };
  useEffect(() => {
    // Re-fetch chats or update UI whenever the chats array changes
    if (chats) {
      // Custom logic or simply re-render by setting state
      setChats([...chats]);
    }
  }, [chats]);
  
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  return (
    <div className="myChatsContainer">
      <div className="myChatsHeader">
        <h2>My Chats</h2>
        <button className="newGroupChatButton">New Group Chat</button>
      </div>
      <div className="chatsListContainer">
        {chats ? (
          <div className="chatsList">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className={`chatItem ${
                  selectedChat === chat ? "selectedChat" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="chatName">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </div>
                {/* {chat.latestMessage && (
                  <div className="chatLatestMessage">
                    <strong>{chat.latestMessage.sender.name}: </strong>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </div>
                )} */}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
}

export default MyChats;