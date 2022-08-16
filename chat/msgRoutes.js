import { db, msgsModel, productsModel } from "../dbsConfig.js";
import contenedorMongo from "../contenedorMongoDB.js";

const myChat = new contenedorMongo(db, msgsModel);

export const getMsgs = () => {
    return async (req, res) => {
        return res.json(await myChat.getElems(req, res))
     }
}

export const postMsgs = () => {
    return async (req, res) => {
        return await myChat.postElem(req, res)
     }
}