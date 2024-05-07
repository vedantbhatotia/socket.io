import {Route,Routes} from "react-router-dom"
import './App.css';
import Home from './pages/home';
import Chat from './pages/chat';
function App() {
  return (
    <div className="App">
    <Routes>
    <Route path = "/" element={<Home></Home>}></Route>
    <Route path ="/chats" element={<Chat></Chat>}></Route>
    </Routes>
    </div>
  );
}

export default App;
