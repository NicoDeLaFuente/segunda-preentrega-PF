import { Router } from "express";
import { getProducts } from "../dao/dbManagers/productManager.js";
import { getCartById } from "../dao/dbManagers/cartManager.js";
import cartsModels from "../dao/models/carts.models.js";

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
    try {
        const products = await getProducts()
        res.render("products", {products})
    }
    catch (err) {
        res.json({message: "Algo salio mal", err: err})
    }
})

router.get("/cart/:cid", async (req, res) => {
    try {
        const {cid} = req.params
        const cart = await cartsModels.findOne({_id: cid}).populate('products.product')
        const modifiedProducts = cart.products.map(item => ({
            title: item.product.title,
            quantity: item.quantity,
            id: item.product._id
          }));
        res.render("carts", {cid: cid, products: modifiedProducts})
    }
    catch (err) {
        res.json({message: "Algo salio mal al traer el carrito requerido", error: err})
        console.log(err)
    }
})

export default router