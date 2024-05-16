import { IconButton, useDisclosure } from "@chakra-ui/react"
import { Modal,ModalBody,ModalCloseButton,ModalHeader,ModalOverlay,ModalFooter,ModalContent} from "@chakra-ui/react";
import UserBadgeItem from "./userbadgeitem";
import { Button } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/chatProvider";
import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import UserListItem from "./userlistitem";
// import "axios" from axios
// import { Toast,useToas} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { Input,FormControl } from "@chakra-ui/react";
import axios from "axios";
function UpdateGroupChatModal({fetchAgain,setFetchAgain,fetchMessages}){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, setSelectedChat, user,} =ChatState();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    function handleRemove(){

    }
    async function handleSearch(query){
        setSearch(query);
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.get(`http://localhost:8001/api/user?search=${search}`, config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: "Failed to Load the Search Results",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
          }

        }
    async function handleAddUser(user1){
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast({
              title: "User Already in group!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
          if (selectedChat.groupAdmin._id !== user._id) {
            toast({
              title: "Only admins can add someone!",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            return;
          }
          try {
            setLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.put("http://localhost:8001/api/chat/groupadd",
              {
                chatId: selectedChat._id,
                userId: user1._id,
              },
              config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: error.response.data.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            setLoading(false);
          }
          setGroupChatName("");
        };
    // }
    const toast = useToast();
    return(
        <>
        <IconButton display={{ base:"flex" }} icon={<ViewIcon />} onClick={onOpen} />
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display ="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
          <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter >
            {/* <Button colorScheme="red">
              Leave Group
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}
export default UpdateGroupChatModal