import { ChatState } from "../context/chatProvider";
import { Box, Text, IconButton, Spinner } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {getSenderFull} from "../chatlogics";
import { getSender } from "../chatlogics";
import ProfileModal from "./profilemodal";
import { useEffect, useState } from "react";
import axios from "axios";
import { FormControl } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import ScrollableChat from "./scrollable";
import UpdateGroupChatModal from "./updateGroupChatModal";
function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages,setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  console.log(selectedChat);
  async function fetchMessages(){
    if(!selectedChat){
      return
    }
    try{
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
    }catch(err){
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
  async function sendMessage(event){
    if(event.key === "Enter" && newMessage){
      try{
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data} = await axios.post("http://localhost:8001/api/message",{
          content:newMessage,
          chatId:selectedChat._id
        },
          config
        )
        setNewMessage("");
        setMessages([...messages,data])
      }catch(err){
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
  }
  function typingHandler(e){
    setNewMessage(e.target.value)
  }
  useEffect(()=>{
    fetchMessages();
  },[selectedChat])
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
            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
          </div>
        ) : (
          <>
            {getSender(user, selectedChat.users)}
            <ProfileModal user={getSenderFull(user, selectedChat.users)}></ProfileModal>
          </>
        )}
      </Text>
      <Box display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">
        {loading?(
          <Spinner
          size="xl"
          w={20}
          h={20}
          alignSelf="center"
          margin="auto"
        />
        ):(
                    <div 
            className="messages" 
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'scroll',
              scrollbarWidth: 'none'
            }}
          >
            <ScrollableChat messages={messages} />
          </div>
        )}
        <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              <Input variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}></Input>
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
