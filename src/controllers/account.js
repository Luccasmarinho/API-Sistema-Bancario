const knex = require("../database/connection");
const { messagejson } = require("../utils/utils");

const getAllAccounts = async (req, res) => {
    // return messagejson(res, 200, "ok")
}

const createAccount = async (req, res) => {
    const { body: { nome, cpf, data_nascimento, email, telefone, senha } } = req
    
    try {
       return messagejson(res, 200, "ok")
    } catch (error) {
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


