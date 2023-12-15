const express = require("express");
const router = express();
const login = require("../controllers/login")
const { getAllAccounts, createAccount } = require("../controllers/account");
const { validateBody } = require("../middlewares/validateBody");
const { schemaUser } = require("../schemas/schemaUser")


router.post("/contas", validateBody(schemaUser), createAccount)
router.get("/contas", getAllAccounts)

module.exports = router