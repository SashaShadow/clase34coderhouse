import {validatePost, validatePut} from "../middlewares.js";
import { logger } from "../logger.js";
import productsDAOMongoDB from "../productsDAOMongoDB.js"
import express from "express";
const { Router } = express;
const productsRouter = Router()
const productsStorage = new productsDAOMongoDB();

export default productsRouter;

productsRouter.get('', (req, res) => {
    return productsStorage.getElems(req, res)
    .then(productos => {
      return res.json({productos})
    })
    .catch(err => {res.send(err); logger.error(err); throw err})
})

productsRouter.get('/:id', (req, res) => {
    return productsStorage.getElem(req, res)
    .then(producto => {
        return res.json({producto})
    })
    .catch(err => {logger.error(err); throw err; res.send(err);})
})

productsRouter.post('', validatePost(), (req, res) => {
    return productsStorage.postElem(req, res)
})

productsRouter.put('/:id', validatePut(), (req, res) => {
    return productsStorage.putElem(req, res)
})

productsRouter.delete('/:id', (req, res) => {
    return productsStorage.deleteElem(req, res)
})