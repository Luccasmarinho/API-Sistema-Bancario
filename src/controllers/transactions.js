const knex = require("../database/connection");
const { messageJson, compareId, insertValue } = require("../utils/utils");
const { compare } = require("bcrypt");


const deposit = async (req, res) => {
    const { body: { numero_conta, valor }, user: { id } } = req

    const { status, message } = compareId(id, numero_conta)

    if (!status) return messageJson(res, 400, message)

    try {
        await knex.raw(`UPDATE usuarios SET saldo = saldo + ${valor} WHERE id = ${id}`)

        const [insertDeposit] = await insertValue("depositar", numero_conta, valor)

        return messageJson(res, 200, insertDeposit)
    } catch (error) {
        return messageJson(res, 500, "Erro interno do servidor.")
    }
}

const withdraw = async (req, res) => {
    const { body: { numero_conta, valor, senha }, user: { id, saldo } } = req

    const { status, message } = compareId(id, numero_conta)

    if (!status) return messageJson(res, 400, message)
    try {
        const [row] = await knex("usuarios").where({ id })

        const truePass = await compare(senha, row.senha)

        if(!truePass) return messageJson(res, 400, "Senha incorreta. Verifique sua senha e tente novamente.")

        if(valor > saldo) return messageJson(res, 400, "Saldo insuficiente para completar essa operação.")
        
        await knex.raw(`UPDATE usuarios SET saldo = saldo - ${valor} where id = ${id}`)

        const [insertWithdraw] = await insertValue("sacar", numero_conta, valor)

        return messageJson(res, 200, insertWithdraw)
    } catch (error) {
        return messageJson(res, 500, "Erro interno do servidor.")
    }
}

const transfer = async (req, res) => {

}

module.exports = {
    deposit,
    withdraw,
    transfer
}