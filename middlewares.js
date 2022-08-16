import { logger, loggerWarn } from "./logger.js";

export const validatePost = () => {
    return (req, res, next) => {
        const productoNuevo = req.body;
        if (productoNuevo.name && productoNuevo.price && productoNuevo.photo && 
            productoNuevo.desc && productoNuevo.code && productoNuevo.stock && 
            Object.keys(productoNuevo).length === 6) {
                next();
        } else {
            return res.status(400).send({ error: "parametros incorrectos" });
        }
    }
}

export const validatePut = () => {
    return (req, res, next) => {
        const prodMod = req.body;
        const format = prodMod.name && prodMod.price && prodMod.photo && 
        prodMod.desc && prodMod.code && prodMod.stock && 
        Object.keys(prodMod).length === 6 ? true : null;

        if (format) {
            next();
        } else {
            res.send({error: "El formato del producto no es correcto"})
        }
    }
}

export const logger200 = () => {
    return (req, res, next) => {
        logger.info(`ruta ${req.originalUrl} método ${req.method}`);
        next();
    }
}

export const logger404 = () => {
    return (req, res, next) => {
        loggerWarn.warn(`ruta ${req.originalUrl} método ${req.method} no implementada`);
        res.status(404).send({error: -2, descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`});
      };
}