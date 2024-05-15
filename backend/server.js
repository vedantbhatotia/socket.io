const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data');
const cors = require('cors')
const connectDB = require('./config/mongoose');
const app = express();
const userRoutes = require('./routes/userroutes');
const chatRoutes = require('./routes/chatroutes');
const messageRoutes = require('./routes/messageroutes')
dotenv.config();
connectDB();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send("response sent");
});
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);
app.listen(port, console.log(`server running ${port}`));
