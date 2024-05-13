import { ChatState } from "../context/chatProvider";
import SideDrawer from "../components/sidedrawer";
import MyChats from "../components/mychats";
import { Box } from "@chakra-ui/react";
import Chatbox from "../components/chatbox";

const Chat = () => {
    const { user } = ChatState();
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
                {user && (
                    <Box flex="0 0 auto"> {/* Set flex to auto to ensure MyChats stays on extreme left */}
                        <MyChats />
                    </Box>
                )}
                {user && (
                    <Box flex="0 0 auto"> {/* Set flex to auto to ensure Chatbox stays on extreme right */}
                        <Chatbox />
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default Chat;
