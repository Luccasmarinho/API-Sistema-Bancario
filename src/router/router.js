const express = require("express");
const router = express();
const login = require("../controllers/login")
const { getAllAccounts, createAccount } = require("../controllers/account");
const { validateBody } = require("../middlewares/validateBody");
const schemas = require("../schemas/schemaUser")


router.post("/contas", validateBody(schemas.user), createAccount)
router.post("/login", validateBody(schemas.login), login)
router.get("/contas", getAllAccounts)

module.exports = router