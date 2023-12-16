const knex = require("../database/connection");


const messagejson = (objRes, status, Mensagem) => {
    if (typeof Mensagem == "string") {
        return objRes.status(status).json({ Mensagem })
    }

    const msgJson = !Mensagem
        ? objRes.status(status).json()
        : objRes.status(status).json(Mensagem)

    return msgJson
}


const verifySingleField = async (table, objReq, arrField) => {
    const arrayObjReq = Object.entries(objReq)
    const arrayValues = []

    for (let i = 0; i < arrayObjReq.length; i++) {
        for (let j = 0; j < arrField.length; j++) {
            if (arrayObjReq[i][1] == arrField[j]) {
                arrayValues.push(arrayObjReq[i])
            }
        }
    }

    const columnName = []
    let arrayQuery = []

    for (let i = 0; i < arrayValues.length; i++) {

        const queryVerify = await knex.raw(`select * from ${table} where ${arrayValues[i][0]} = '${arrayValues[i][1]}'`)

        if (queryVerify.rows.length > 0) {
            columnName.push(arrayValues[i][0])
        }

        const [ query ] = queryVerify.rows
        arrayQuery.push(query)
    }

    let counterUndefined = 0
    arrayQuery.forEach((e) => {
        if (!e) {
            counterUndefined += 1
        }
    })

    if(counterUndefined == arrayQuery.length) {
       arrayQuery = []
    }

    const status = arrayQuery.length == 0 ? false : true
    const message = arrayQuery.length == 0 
    ? `Nenhum campo cadastrado no banco de dados.` 
    : `Campos já cadastrados no banco de dados: '${columnName.join(", ")}'`

    const result = {
        query: arrayQuery,
        status,
        message
    }
    
    return result
}

module.exports = {
    messagejson,
    verifySingleField
}





