import { useState } from "react";
import { Box,Tooltip,Button,Text,Menu,MenuButton, useDisclosure, useToast} from "@chakra-ui/react";
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons"
import { Avatar } from "@chakra-ui/react";
import { ChatState } from "../context/chatProvider";
import { MenuItem,MenuList } from "@chakra-ui/react";
import { Drawer,DrawerBody,DrawerFooter,DrawerHeader,DrawerOverlay,Input,DrawerContent} from "@chakra-ui/react";
import ProfileModal from "./profilemodal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./chatloading";
import UserListItem from "./userlistitem";
import { Spinner } from "@chakra-ui/react";
function SideDrawer(){
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const {user,setSelectedChat,chats,setChats} = ChatState();
    const history = useNavigate();
    const toast = useToast();
    const {isOpen,onOpen,onClose} = useDisclosure()
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history("/");
      };
    const handleSearch = async()=>{
        if(!search){
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
              });
              return;
        }
        try{
            setLoading(true);
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`http://localhost:8001/api/user?search=${search}`,config);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setLoading(false);
            setSearchResult(data);
        }catch(err){
            toast({
                title: err,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
              });
              return;
        }
    }
    const accessChat = async(userId)=>{
        try{
            setLoadingChat(true)
            const config = {
                headers:{
                    "Content-type":"application/json",
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data} = await axios.post("http://localhost:8001/api/chat",{userId},config);

            setSelectedChat(data);
            setLoadingChat(false);
            onClose()
        }catch(err){
            toast({
                title: err,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
              });
              return;
        }
    }
    return(
        <>
        <Box  display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              /> */}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src = {user.pic}
              />
            </MenuButton>
            <MenuList>
                <ProfileModal user = {user}>
                    {/* <MenuItem>My Profile</MenuItem> */}
                </ProfileModal>
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
            </Menu>
          </Menu>
        </div>
        </Box>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
                searchResult?.map(user=>(
                    <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)}></UserListItem>
                ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
        </>
    )
}
export default SideDrawer