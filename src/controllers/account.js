const knex = require("../database/connection");
const { messagejson, verifySingleField } = require("../utils/utils");
const { hash } = require("bcrypt")

const getAllAccounts = async (req, res) => {
    // return messagejson(res, 200, "ok")
}


const createAccount = async (req, res) => {
    const { body: { nome, cpf, data_nascimento, email, telefone, senha } } = req

    try {
        const userExists = await verifySingleField("usuarios", req.body, [email, cpf])
        const { status, message } = userExists

        if (status) return messagejson(res, 400, message)

        const encryptedPass = await hash(senha, 10)

        delete req.body.senha

        const user = {
            ...req.body,
            senha: encryptedPass
        }

        const [insertUser] = await knex("usuarios").insert(user).returning("*")

        delete insertUser.senha   
       return messagejson(res, 200, insertUser)
    } catch (error) {
        // console.log(error);
        return messagejson(res, 500, "Erro interno do servidor.")
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


