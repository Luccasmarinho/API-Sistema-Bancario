const knex = require("../database/connection");
const  { messageJson, verifySingleField }  = require("../utils/utils");
const { hash } = require("bcrypt")

const getAllAccounts = async (req, res) => {
    return messageJson(res, 200, "ok")
    
}

const createAccount = async (req, res) => {
    const { body: {cpf, email, senha } } = req

    try {
        const { status, message }  = await verifySingleField("usuarios", req.body, [email, cpf])

        if (status) return messageJson(res, 400, message)

        const encryptedPass = await hash(senha, 10)

        delete req.body.senha

        const user = {
            ...req.body,
            senha: encryptedPass,
            saldo: 0
        }

        const [insertUser] = await knex("usuarios").insert(user).returning(["id", "nome", "email", "saldo"])

       return messageJson(res, 200, insertUser)
    } catch (error) {
        const codeError = "42P01"
        const errorName = error.message.split(" ")[3]
        if (codeError) return messageJson(res, 400, `Relação '${errorName}' não existe.`)

        return messageJson(res, 500, "Erro interno do servidor.")
    }
}

const updateAccount = async (req, res) => {

}

const deleteAccount = async (req, res) => {

}

const getBalance = async (req, res) => { 

}

const getExtract = async (req, res) => { 

}

module.exports = {
    getAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getBalance,
    getExtract
}


