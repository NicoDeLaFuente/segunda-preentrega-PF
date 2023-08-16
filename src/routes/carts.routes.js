import { Router } from "express";
import cartsModels from "../dao/models/carts.models.js";
import {
  addCart,
  getCart,
  getCartById
} from "../dao/dbManagers/cartManager.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const response = await cartsModels.find().populate('products.product');
    res.json({ message: "success", data: response });
  } catch (err) {
    res
      .status(500)
      .json({ message: "algo salió mal al traer los carritos :(", error: err });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const response = await cartsModels.findOne({_id: cid}).populate('products.product');
    console.log(response)
    res.json({ message: "success al traer el carrito por ID", data: response });
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .json({
        message: "algo salió mal al traer el carrito requerido:(",
        error: err,
      });
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await addCart();
    res.json({ message: "success. Nuevo carrito creado", data: response });
  } catch (err) {
    res
      .status(500)
      .json({ message: "algo salió mal al crear el carrito :(", error: err });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const {cid, pid} = req.params
    /* traigo el carrito con el ID buscado */
    const cart = await cartsModels.findOne({ _id: cid });
    /* chequeo si dentro del carrito hay un producto con el pid igual */
    const productIndex = cart.products.findIndex(
      (product) => product.product._id.toString() === pid
    );
    /* condicional parar determinar la accion a tomar dependiendo si existe el producto o no */
    if (productIndex === -1) {
      const newProduct = {
        product: pid,
        quantity: 1,
      };

      cart.products.push(newProduct);
      const response = await cartsModels.findByIdAndUpdate(cid, {
        products: cart.products,
      });
      return response;
    } else {
      /* obtengo la cantidad del producto y lo incremento en 1. */
      let newQuantity = cart.products[productIndex].quantity;
      newQuantity++;

      // Actualizo el campo 'quantity' del producto existente
      cart.products[productIndex].quantity = newQuantity;
      await cartsModels.findByIdAndUpdate(cid, { products: cart.products });
      const response = await cartsModels.findById(cid);
      return response;
    }
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Algo salío mal al agregar el producto al carrito :(",
        error: err,
      });
      console.log(err)
  }
});

/* deleteo un producto del carrito seleccionado */
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    let carrito = await cartsModels.findOne({ _id: cid }).populate('products.product');
    let productos = carrito.products;
    let producto = productos.findIndex(
      (producto) => producto.product._id.toString() === pid
    );
    if (producto !== -1) {
      productos.splice(producto, 1);
      let result = await cartsModels.findByIdAndUpdate(cid, carrito);
      return res.json({
        message: "Producto eleminado correctamente del carrito",
        data: result,
      });
    } else {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (err) {
    res.send({
      message: "No se pudo borrar el producto del carrito :(",
      error: err,
    });
  }
});


//Actualizar el carrito con un arreglo de productos especificado
router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  let carrito = await cartsModels.findById(cid);
  carrito.products = products;
  let result = await cartsModels.findByIdAndUpdate(cid, carrito);
  return res.json({ message: "Carrito actualizado", data: result });
});

//Actualizar cantidad de ejemplares del producto seleccionado, del carrito especificado
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  let carrito = await cartsModels.findOne({ _id: cid }).populate('products.product');
  let products = carrito.products;
  let productIndex = products.findIndex(
    (product) => product.product._id.toString() === pid
  );
  if (productIndex !== -1) {
    products[productIndex].quantity = quantity;
    let result = await cartsModels.findByIdAndUpdate(cid, carrito);
    return res.json({
      message: "Cantidad de ejemplares actualizada",
      data: result,
    });
  } else {
    return res.status(404).json({ message: "Producto no encontrado" });
  }
});

//Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  let carrito = await cartsModels.findById(cid);
  carrito.products = [];
  let result = await cartsModels.findByIdAndUpdate(cid, carrito);
  return res.json({ message: "Carrito vacio", data: result });
});

export default router;
