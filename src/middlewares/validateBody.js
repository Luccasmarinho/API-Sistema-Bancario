const { messageJson } = require("../utils/utils");
const schemas = require("../schemas/schemaUser");

const validateBody = (schema) => async (req, res, next) => {
    try {
        await schema.validateAsync(req.body)
        return next()
    } catch (error) {
        const arrayErrors = Object.entries(schemas.error)
        const typeError = error.details[0].type
        const fieldName = error.message.split(" ")[0].replaceAll("\"", "")
        const splitError = error.message.split(" ")
        const characters = `${splitError.find((e) => e == Number(e))} caracteres`

        for(let i of arrayErrors) {
            if (i[0] == typeError && (typeError == "string.min" || typeError == "string.max") && fieldName == "cpf") return messageJson(res, 400, `${i[1].replace("$", fieldName)} ${characters}`)
            
            if (i[0] == typeError && (typeError == "string.min" || typeError == "string.max") && fieldName == "senha") return messageJson(res, 400, `${i[1].replace("$", fieldName)} ${characters}`)
            
            if (i[0] == typeError) return messageJson(res, 400, `${i[1].replace("$", fieldName)}`)
        }
    
        return messageJson(res, 500, "Erro interno do servidor.")
    }
}

module.exports = {
    validateBody
}