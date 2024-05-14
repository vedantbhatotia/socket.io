import { ChatState } from "../context/chatProvider";
import SideDrawer from "../components/sidedrawer";
import MyChats from "../components/mychats";
import { Box } from "@chakra-ui/react";
import Chatbox from "../components/chatbox";
import { useState } from "react";

const Chat = () => {
    const { user } = ChatState();
    const [fetchAgain,setFetchAgain] = useState(false);
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box 
                display="flex" 
                justifyContent="space-between" // Adjusted justifyContent
                width="100%" 
                height="91.5vh" 
                padding="10px"
            >
                {user && <MyChats fetchAgain={fetchAgain}/>}
                {user && (
                <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
                )}
            </Box>
        </div>
    );
};

export default Chat;
