const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const apiRoutes = require('./routes/api');

dotenv.config();

const server = express();

server.use(cors());

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({extended: true}));

server.use(apiRoutes);

server.use((req, res)=>{
    res.status(404);
    res.json({error: 'Endpoint não encontrado!'});
});

server.listen(process.env.PORT || 3001);