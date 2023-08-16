import messagesModel from "../models/messages.models.js"
import messageModel from "../models/messages.models.js"

const addMessages = async (obj) => {
    try{
        const response = await messageModel.create(obj)
        return response
    }
    catch (err) {
        res.status(500).json({message: "error. No se pudo conectar a la BBDD", error: err})
    }
}

const getMessages = async () => {
    try{
        const response = await messagesModel.find()
        return response;
    }
    catch {
        res.status(500).json({message: "Error. No se pudo conectar con la BBDD", error: err})
    }
    
}


export {addMessages, getMessages}