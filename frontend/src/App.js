
import {Route,Routes} from "react-router-dom"
import './App.css';
import Home from './pages/home';
import Chat from './pages/chat';
function App() {
  return (
    <>
    <Routes>
    <Route path = "/" element={<Home></Home>}></Route>
    <Route path ="/chats" element={<Chat></Chat>}></Route>
    </Routes>
    </>
  );
}

export default App;
