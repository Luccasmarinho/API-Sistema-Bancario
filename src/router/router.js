const express = require("express");
const router = express();

const login = require("../controllers/login");
const { getAllAccounts, createAccount } = require("../controllers/account");
const { validateBody } = require("../middlewares/validateBody");
const schemas = require("../schemas/schemaUser");
const tokenAuthentication = require("../middlewares/tokenAuthenticate");
const { deposit, withdraw } = require("../controllers/transactions");


router.post("/contas", validateBody(schemas.user), createAccount)
router.post("/login", validateBody(schemas.login), login)

// router.get("/contas", tokenAuthentication, getAllAccounts)
router.use(tokenAuthentication)
router.post("/transacoes/depositar", validateBody(schemas.deposit), deposit)
router.post("/transacoes/sacar", validateBody(schemas.withdraw), withdraw)

module.exports = router