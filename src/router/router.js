const express = require("express");
const router = express();
const { getAllAccounts } = require("../controllers/account");


router.get("/contas", getAllAccounts)

module.exports = router