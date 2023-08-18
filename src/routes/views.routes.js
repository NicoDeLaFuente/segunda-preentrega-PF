import { Router } from "express";
import { getProducts } from "../dao/dbManagers/productManager.js";
import { getCartById } from "../dao/dbManagers/cartManager.js";
import cartsModels from "../dao/models/carts.models.js";
import productsModel from "../dao/models/products.models.js";

const router = Router()

router.get("/", async (req, res) => {
    try{
        const products = await getProducts()
        res.render("home", {products})
    }
    catch(err) {
        res.render("home", `Ha ocurrido un error ${err}`)
    }
})

router.get("/products", async (req, res) => {
    try{
        const { limit = 10, page = 1, sort, query } = req.query;

      // Validar y formatear los parámetros
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const parsedSort = sort === 'asc' ? 1 : -1; //manejar orden ascendente/descendente
        //Se filtra siempre de manera descendente, salvo especificación que se filtre ascendente
      const filter = query ? { category: query } : {};

      const results = await productsModel.paginate(filter, {
        limit: parsedLimit,
        page: parsedPage,
        lean: true,
        sort: { price: parsedSort },
      });

      const {docs, hasPrevPage, hasNextPage, prevPage, nextPage} = results

      //conditional to check and create the links to next and prev pages. 
      const prevBaseLink = `http://localhost:8080/products?limit=${limit}&page=${prevPage}`;
      const nextBaseLink = `http://localhost:8080/products?limit=${limit}&page=${nextPage}`

      let prevLink;
      let nextLink;
      if (query && sort && query !== undefined && sort !== undefined) {
        prevLink = `${prevBaseLink}&query=${query}&sort=${sort}`
        nextLink = `${nextBaseLink}&query=${query}&sort=${sort}`
      } else if (sort && sort !== undefined && !query) {
        prevLink = `${prevBaseLink}&sort=${sort}`
        nextLink = `${nextBaseLink}&sort=${sort}`
      } else if (query && query !== undefined && !sort) {
        prevLink = `${prevBaseLink}&query=${query}`
        nextLink = `${nextBaseLink}&query=${query}&sort=${sort}`
      } else {
        prevLink = prevBaseLink
        nextLink = nextBaseLink
      }

      const products = docs

      res.render("products", {
        products,
        hasNextPage,
        hasPrevPage,
        nextLink,
        prevLink
    })
    } 
    catch (err) {
    res.status(500).json({ message: "Something went wrong", err });
    }
})

router.get("/cart/:cid", async (req, res) => {
    try {
        const {cid} = req.params
        const cart = await cartsModels.findOne({_id: cid}).populate('products.product')
        const modifiedProducts = cart.products.map(item => ({
            title: item.product.title.toUpperCase(),
            quantity: item.quantity,
            id: item.product._id,
            price: item.product.price,
            thumbnails: item.product.thumbnails
          }));
        res.render("carts", {cid: cid, products: modifiedProducts})
    }
    catch (err) {
        res.json({message: "Algo salio mal al traer el carrito requerido", error: err})
        console.log(err)
    }
})

export default router