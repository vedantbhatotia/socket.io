const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data');
const connectDB = require('./config/mongoose');
const app = express();
const userRoutes = require('./routes/userroutes');
dotenv.config();
connectDB();
const port = process.env.PORT;
app.use(express.json());
app.get('/', (req, res) => {
    res.send("response sent");
});
app.use('/api/user',userRoutes);

app.listen(port, console.log(`server running ${port}`));
