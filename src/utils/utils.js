const knex = require("../database/connection");
const { format } = require("date-fns")

const utils = {
    messageJson: (objRes, status, Mensagem) => {
        if (typeof Mensagem == "string") return objRes.status(status).json({ Mensagem })

        const msgJson = !Mensagem
            ? objRes.status(status).json()
            : objRes.status(status).json(Mensagem)

        return msgJson
    },
    verifySingleField: async (table, objReq, arrField) => {
        const arrayObjReq = Object.entries(objReq)
        const arrayValues = []
    
        arrayObjReq.forEach((i) => {
            arrField.forEach((j) => {
                if (i[1] == j) arrayValues.push(i)
            })
        })
    
        const columnName = []
        let arrayQuery = []
    
        for (let i = 0; i < arrayValues.length; i++) {
    
            const queryVerify = await knex.raw(`select * from ${table} where ${arrayValues[i][0]} = '${arrayValues[i][1]}'`)
    
            if (queryVerify.rows.length > 0) columnName.push(arrayValues[i][0])
    
            const [query] = queryVerify.rows
            if (query) arrayQuery.push(query)
        }
    
        const status = arrayQuery.length == 0 ? false : true
        const message = arrayQuery.length == 0
            ? `Nenhum campo cadastrado no banco de dados.`
            : `Campos já cadastrados no banco de dados: ${columnName.join(", ").toUpperCase()}`
    
        const result = {
            query: arrayQuery,
            status,
            message
        }
    
        return result
    },
    formatDate: () => {
        const date = new Date()

        const result = format(date, "dd/MM/yyyy, HH:mm:ss")

        return result
    }
}

module.exports = utils






