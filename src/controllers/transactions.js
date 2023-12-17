const knex = require("../database/connection");
const { messageJson, formatDate } = require("../utils/utils");

const deposit = async (req, res) => {
    const { body: { numero_conta, valor }, user: { id } } = req

    if (id !== numero_conta) return messageJson(res, 404, "Número da conta incorreto.")

    try {
        await knex.raw(`UPDATE usuarios SET saldo = saldo + ${valor} WHERE id = ${id}`)

        const objInsert = {
            numero_conta,
            valor,
            data: formatDate()
        }
        const insertDeposit = await knex("depositar").insert(objInsert).returning("*")

        return messageJson(res, 200, insertDeposit)
    } catch (error) {
        return messageJson(res, 500, "Erro interno do servidor.")
    }
}

const withdraw = async (req, res) => {

}

const transfer = async (req, res) => {

}

module.exports = {
    deposit,
    withdraw,
    transfer
}