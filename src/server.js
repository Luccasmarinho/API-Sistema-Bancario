require("dotenv").config();
const express = require("express");
const server = express();
const router = require("./router/router");

server.use(express.json());
server.use(router);

const port = process.env.PORT || 3000
server.listen(port, () => console.log("Server ON"));