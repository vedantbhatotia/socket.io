import { Container, Box, Text, TabList, Tab, Tabs, TabPanel, TabPanels } from "@chakra-ui/react";
import Login from "../components/login";
import Signup from "../components/signup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
const Home = () => {
  const history = useNavigate();
  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if(userInfo){
      history('/chats')
    }
  },[history])
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work Sans">
          CHATTING ENGINE
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab >Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
