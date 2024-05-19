import { ChatState } from "../context/chatProvider";
import { Box, Text, IconButton, Spinner, FormControl, Input, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSenderFull, getSender } from "../chatlogics";
import ProfileModal from "./profilemodal";
import { useEffect, useState } from "react";
import axios from "axios";
import ScrollableChat from "./scrollable";
import UpdateGroupChatModal from "./updateGroupChatModal";
import io from "socket.io-client";

const ENDPOINT = 'http://localhost:8001';
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toast = useToast();

  async function fetchMessages() {
    if (!selectedChat) {
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8001/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on('connected', () => {
      setSocketConnected(true);
    });
    socket.on('typing', () => {
      setIsTyping(true);
    });
    socket.on('stop typing', () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // notify
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        updateChats(newMessageReceived);
      }
    });
  }, [messages]);

  const updateChats = (newMessageReceived) => {
    const updatedChats = chats.map(chat => {
      if (chat._id === newMessageReceived.chat._id) {
        chat.latestMessage = newMessageReceived;
      }
      return chat;
    });
    setChats(updatedChats);
  };

  async function sendMessage(event) {
    if (event.key === "Enter" && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post("http://localhost:8001/api/message", {
          content: newMessage,
          chatId: selectedChat._id
        }, config);
        setNewMessage("");
        socket.emit('new message', data);
        setMessages((prevMessages) => [...prevMessages, data]);
        updateChats(data);
      } catch (err) {
        toast({
          title: "Error Occured!",
          description: "Failed to Send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }

  function typingHandler(e) {
    setNewMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 2000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  }

  return (
    selectedChat ? (
      <>
        <Text
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          display="flex"
          justifyContent={{ base: "space-between" }}
          alignItems="center"
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat("")}
          />
          {selectedChat.isGroupChat ? (
            <div display="flex">
              {selectedChat.chatName}
              <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
            </div>
          ) : (
            <>
              {getSender(user, selectedChat.users)}
              <ProfileModal user={getSenderFull(user, selectedChat.users)} />
            </>
          )}
        </Text>
        <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
          {loading ? (
            <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
          ) : (
            <div className="messages" style={{ display: 'flex', flexDirection: 'column', overflowY: 'scroll', scrollbarWidth: 'none' }}>
              <ScrollableChat messages={messages} />
            </div>
          )}
          <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            {isTyping ? <div>Loading...</div> : null}
            <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message..." value={newMessage} onChange={typingHandler} />
          </FormControl>
        </Box>
      </>
    ) : (
      <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          Click on a user to start chatting
        </Text>
      </Box>
    )
  );
}

export default SingleChat;
