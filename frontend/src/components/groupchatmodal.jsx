import { useDisclosure } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    // FormControl,
    Input,
    useToast,
    Box,
  } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../context/chatProvider";
import UserListItem from "./userlistitem";
import UserBadgeItem from "./userbadgeitem";
function GroupChatModal({children}){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { user, chats, setChats } = ChatState();
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
    function handleGroup(userToAdd){

        if (selectedUsers.includes(userToAdd)) {
            toast({
              title: "User already added",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            return;
        }
          setSelectedUsers([...selectedUsers, userToAdd]);
    };
    async function handleSubmit(){
        if(!groupChatName || !selectedUsers){
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              return;
        }else{
            try{
                const config = {
                    headers: {
                      Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.post(
                    "http://localhost:8001/api/chat/group",
                    {
                      name: groupChatName,
                      users: JSON.stringify(selectedUsers.map((u) => u._id)),
                    },
                    config
                );
                setChats([data, ...chats]);
                onClose();
                toast({
                    title: "New Group Chat Created!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }catch(err){
                toast({
                    title: "Failed to Create the Chat!",
                    description: "error",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                })
            }
        }
    }

    function handleDelete(delUser){
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    }

    return(
            <> 
              <span onClick={onOpen}>{children}</span>
        
              <Modal onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader
                    fontSize="35px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                  >
                    Create Group Chat
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody display="flex" flexDir="column" alignItems="center">
                    <FormControl>
                      <Input
                        placeholder="Chat Name"
                        mb={3}
                        onChange={(e) => setGroupChatName(e.target.value)}
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        placeholder="Add Users eg: John, Piyush, Jane"
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                    </FormControl>
                    <Box w="100%" display="flex" flexWrap="wrap">
                      {selectedUsers.map((u) => (
                        <UserBadgeItem
                          key={u._id}
                          user={u}
                          handleFunction={() => handleDelete(u)}
                        />
                      ))}
                    </Box>
                    {loading ? (
                      <div>Loading...</div>
                    ) : (
                      searchResult
                        ?.slice(0, 4)
                        .map((user) => (
                          <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => handleGroup(user)}
                          />
                        ))
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                      Create Chat
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
    )
}
export default GroupChatModal