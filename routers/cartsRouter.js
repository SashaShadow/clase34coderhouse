import express from "express";
import { logger, loggerError } from "../logger.js";
import cartsDAOMongoDB from "../cartsDAOMongoDB.js"
import { validateAddToCart, validateAdmin } from "../middlewares.js";

const { Router } = express;
const cartRouter = Router()
const cartStorage = new cartsDAOMongoDB();

export default cartRouter;

cartRouter.get('', validateAdmin(), async (req, res) => {
    return cartStorage.getElems(req, res)
    .then(carritos => {
        return res.json({carritos})
    })
    .catch(err => {res.send(err); loggerError.error(err); throw err})
})

cartRouter.get('/:id', async (req, res) => {
    return cartStorage.getCarts(req, res)
    .then(carritos => {
        return res.json({carritos})
    })
    .catch(err => {loggerError.error(err); throw err})
})

cartRouter.get('/:id/products', (req, res) => {
    return cartStorage.getCartProds(req, res)
})

cartRouter.post('', async (req, res) => {
    return cartStorage.postElem(req, res)
    .then(carrito => {
        logger.info('carrito guardado')
    })
    .catch(err => loggerError.error(`Error: ${err.message}`))
})

cartRouter.post('/:id/products', validateAddToCart(), async (req, res) => {
    return cartStorage.addToCart(req, res)
})


cartRouter.delete('/:id', (req, res) => {
    return cartStorage.deleteElem(req, res);
})

cartRouter.delete('/:id/products/:id_prod', (req, res) => {
    return cartStorage.deleteCartProd(req, res);
})