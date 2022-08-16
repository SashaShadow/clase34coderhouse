import contenedorMongoDB from "./contenedorMongoDB.js";
import { db, productsModel} from "./dbsConfig.js";

class ProductsDAOMongoDB extends contenedorMongoDB {
    constructor() {
      super(db, productsModel)
    }
  }

export default ProductsDAOMongoDB;