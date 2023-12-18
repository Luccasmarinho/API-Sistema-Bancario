const knex = require("../database/connection");
const { messageJson, compareId, insertValue } = require("../utils/utils");
const { compare } = require("bcrypt");


const deposit = async (req, res) => {
    const { body: { numero_conta, valor }, user: { id } } = req

    const { status, message } = compareId(id, numero_conta)

    if (!status) return messageJson(res, 400, message)

    try {
        await knex.raw(`UPDATE usuarios SET saldo = saldo + ${valor} WHERE id = ${id}`)

        const [insertDeposit] = await insertValue("depositar", valor, numero_conta)

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

        if (!truePass) return messageJson(res, 400, "Senha incorreta. Verifique sua senha e tente novamente.")

        if (valor > saldo) return messageJson(res, 400, "Saldo insuficiente para completar essa operação.")

        await knex.raw(`UPDATE usuarios SET saldo = saldo - ${valor} where id = ${id}`)

        const [insertWithdraw] = await insertValue("sacar", valor, numero_conta)

        return messageJson(res, 200, insertWithdraw)
    } catch (error) {
        return messageJson(res, 500, "Erro interno do servidor.")
    }
}

const transfer = async (req, res) => {
    const {
        body: { numero_conta_origem, numero_conta_destino, valor, senha },
        user: { id, saldo }
    } = req
    
    const { status } = compareId(id, numero_conta_origem)

    if (!status) return messageJson(res, 400, "Número da conta incorreto.")

    try {
        const [rowsDestiny] = await knex("usuarios").where({ id: numero_conta_destino })

        if(!rowsDestiny) return messageJson(res, 404, "Número da conta de destino não encontrado.")
        
        const [rowsOrigin] = await knex("usuarios").where({ id: numero_conta_origem })

        const passTrue = await compare(senha, rowsOrigin.senha)

        if (!passTrue) return messageJson(res, 400, "Senha incorreta. Verifique sua senha e tente novamente.")

        if (rowsDestiny.senha == rowsOrigin.senha) return messageJson(res, 400, "Os números das contas precisam ser diferentes.")

        if (valor > saldo) return messageJson(res, 400, "Saldo insuficiente para completar essa operação.")

        await knex.raw(`UPDATE usuarios SET saldo = saldo - ${valor} where id = ${numero_conta_origem}`)
        await knex.raw(`UPDATE usuarios SET saldo = saldo + ${valor} where id = ${numero_conta_destino}`)

        const [insertTransfer] = await insertValue("transferir", valor, numero_conta_origem, numero_conta_destino)

        return messageJson(res, 200, insertTransfer)
    } catch (error) {
        return messageJson(res, 500, "Erro interno do servidor.")
    }
}

module.exports = {
    deposit,
    withdraw,
    transfer
}