const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data');
const app = express();
dotenv.config();
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send("response sent");
});

app.get('/api/chat', (req, res) => {
    res.send(chats);
});

app.get('/api/chat/:id', (req, res) => {
    const id = req.params.id;
    res.send(`chat with id ${id} sent`);
});

app.listen(port, console.log(`server running ${port}`));
