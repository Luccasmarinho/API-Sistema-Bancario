const express = require("express");
const router = express();

const schemas = require("../schemas/schemaUser");

const tokenAuthentication = require("../middlewares/tokenAuthenticate");
const validatePass = require("../middlewares/validatePass");
const { validateBody } = require("../middlewares/validateBody");

const login = require("../controllers/login");
const { getAllAccounts, createAccount, getExtract, getBalance } = require("../controllers/account");
const { deposit, withdraw, transfer } = require("../controllers/transactions");


router.post("/contas", validateBody(schemas.user), createAccount);
router.post("/login", validateBody(schemas.login), validatePass, login);

router.use(tokenAuthentication);
router.get("/contas", getAllAccounts);
router.get("/contas/saldo", getBalance);
router.get("/contas/extrato", getExtract);
router.post("/transacoes/depositar", validateBody(schemas.deposit), deposit);
router.post("/transacoes/sacar", validateBody(schemas.withdraw), validatePass, withdraw);
router.post("/transacoes/transferir", validateBody(schemas.transfer), validatePass, transfer);

module.exports = router