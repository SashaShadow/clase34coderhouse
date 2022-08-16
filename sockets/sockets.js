import { db, msgsModel, productsModel } from "../dbsConfig.js";
import contenedorMongo from "../contenedorMongoDB.js";

const myChat = new contenedorMongo(db, msgsModel);
const myApi = new contenedorMongo(db, productsModel)

export const ioSockets = (io) => {
    io.on("connection", async socket => { 
        console.log("Un nuevo cliente se ha conectado");
     
        socket.emit("Mensajes", await myChat.getElems());
        socket.emit("Productos", await myApi.getElems());
    
        const data = await myChat.getElems();
    
        socket.on("new-message", async data => { 
            data.time = new Date().toLocaleString();
            io.sockets.emit("MensajeIndividual", data)
        })
    
        socket.on("nuevo-producto", async data => {
            const prods = await myApi.getElems();
            data.id = prods[prods.length - 1].id + 1;
            io.sockets.emit("ProductoIndividual", data)
        })
    })
}