import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useToast } from '@chakra-ui/react'
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import axios from "axios";
import { useState } from "react";
import {useNavigate} from "react-router-dom"
const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);
  const toast = useToast();
  const history = useNavigate();
  const handleClick = () => setShow(!show);
  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    } else {
      try {
        const config = {
          headers: {
            "Content-type": "application/json"
          }
        }
        const response = await axios.post("http://localhost:8001/api/user", { name, email, password, pic }, config);
        // console.log(response);
        // console.log(response["email"]);
        const { email: userEmail, name: userName, pic: userPic, token, _id } = response.data; 
        // console.log(userEmail, userName, userPic, token, _id);
        const userData = { email: userEmail, name: userName, pic: userPic, token, _id }; // Create JSON object
        // console.log(userData);
        const userDataString = JSON.stringify(userData); // Stringify JSON object
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: "bottom"
        });
        localStorage.setItem("userInfo", userDataString);
        setPicLoading(false);
        history("/chats");
      } catch (err) {
        toast({
          title: "Error Occured!",
          description: "error",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
      }
    }
  }
    const postDetails = async(pics)=>{
      setPicLoading(true);
      if(pics == undefined){
        toast({
          title: 'Please Select An Image.',
          description: "We've created your account for you.",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position:"bottom"
        })
        return;
      }else{
        const data = new FormData();
        data.append("file",pics);
        data.append("upload_preset","chatApp");
        data.append("cloud_name","dkup6mewj")
        fetch("https://api.cloudinary.com/v1_1/dkup6mewj/image/upload",{
          method:'post',
          body:data
        }).then((res)=>res.json()).then(data=>{
          console.log(data.url.toString());
          setPic(data.url.toString());
          setPicLoading(false);
        })
        console.log(pics);
      }
    }
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
            onChange={(e)=>postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading = {picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;