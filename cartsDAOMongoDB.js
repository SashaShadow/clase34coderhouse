import contenedorMongoDB from "./contenedorMongoDB.js";
import { db, cartModel} from "./dbsConfig.js";

class CartDAOMongoDB extends contenedorMongoDB {
    constructor() {
      super(db, cartModel)
    }

    async getCartProds(req, res) {
      return this.db
        .then(_ => this.model.findOne({_id: req.params.id}))
        .then(data => {
            console.log(data)
            return res.json({Productos: [data.products]})
        })
        .catch(err => {res.send(err); throw err})
    }

    async getCarts(req, res) {
      return this.db
      .then(_ => this.model.find({owner: req.params.id}))
      .then(data => {
        console.log(data);
        return data;
        // return res.json({Carritos: [data.carritos]})
      })
      .catch(err => {res.send(err); throw err})
    }

    async addToCart(req, res) {
      const productoNuevo = req.body;

      return this.db
        .then(_ => this.model.findOne({_id: req.params.id}))
        .then(data => {
            data.products.push(productoNuevo)
            data.save();
            console.log(data)
        })
        .then(_=> {
          res.json({Mensaje: "Producto agregado al carrito"})
        })
        .catch(err => {res.send(err); throw err})
    }

    async deleteCartProd(req, res) {
      return this.db
        .then(_ => this.model.findOne({_id: req.params.id}))
        .then(cart=> {
           cart.products.id(req.params.id_prod).remove()
           cart.save();
        })
        .then(_ => res.json({Mensaje: "Producto eliminado del carrito"}))
        .catch(err => res.send("No se encontró el producto con dicha id"))
    }
  }

export default CartDAOMongoDB;