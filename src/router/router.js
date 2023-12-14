const express = require("express");
const router = express();
const login = require("../controllers/login")
const { getAllAccounts } = require("../controllers/account");


router.get("/contas", getAllAccounts)

module.exports = router