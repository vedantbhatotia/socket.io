import { ChatState } from "../context/chatProvider";
import { Box, Text, IconButton } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {getSenderFull} from "../chatlogics";
import { getSender } from "../chatlogics";
import ProfileModal from "./profilemodal";
import UpdateGroupChatModal from "./updateGroupChatModal";
function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  console.log(selectedChat);

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
            <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
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
