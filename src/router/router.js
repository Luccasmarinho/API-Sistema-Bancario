const express = require("express");
const router = express();

const schemas = require("../schemas/schemaUser");

const tokenAuthentication = require("../middlewares/tokenAuthenticate");
const validatePass = require("../middlewares/validatePass");
const { validateBody } = require("../middlewares/validateBody");

const login = require("../controllers/login");
const controllerAccount = require("../controllers/account");
const controllerTransictions = require("../controllers/transactions");


router.post(
    "/contas", 
    validateBody(schemas.user), 
    controllerAccount.createAccount
);

router.post(
    "/login", 
    validateBody(schemas.login), 
    validatePass, 
    login
);

router.use(tokenAuthentication);

router.get(
    "/contas",
    controllerAccount.getAllAccounts
);

router.get(
    "/contas/saldo",
    controllerAccount.getBalance
);

router.get("/contas/extrato",
    controllerAccount.getExtract
);

router.post(
    "/transacoes/depositar",
    validateBody(schemas.deposit),
    controllerTransictions.deposit
);

router.post(
    "/transacoes/sacar", 
    validateBody(schemas.withdraw), 
    validatePass, 
    controllerTransictions.withdraw
);

router.post(
    "/transacoes/transferir", 
    validateBody(schemas.transfer), 
    validatePass, 
    controllerTransictions.transfer
);

router.delete(
    "/contas/:numeroConta", 
    validateBody(schemas.delete), 
    validatePass, 
    controllerAccount.deleteAccount
);

router.put(
    "/contas/:numeroConta/usuario", 
    validateBody(schemas.update), 
    validatePass,
    controllerAccount.updateAccount
);

module.exports = router