import { ChatState } from "../context/chatProvider"
import { useToast } from "@chakra-ui/toast";
import axios from "axios"
import { useState,useEffect } from "react";
function MyChats(){
    const {user,setUser,selectedChat,setSelectedChat,chats,setChats} = ChatState();
    const [loggedUser, setLoggedUser] = useState();
    const toast = useToast();
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
          toast({
            title: "Error Occured!",
            description: "Failed to Load the chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };
      useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
      }, []);
    return(
        <>
        MYCHATS
        </>
    )
}
export default MyChats