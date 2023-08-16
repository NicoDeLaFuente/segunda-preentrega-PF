import cartsModels from "../models/carts.models.js";

const addCart = async () => {
  const newCart = {
    products: [],
  };

  const cartAdded = await cartsModels.create(newCart);
  return cartAdded;
};

const getCart = async () => {
  const response = await cartsModels.find();
  return response;
};

const getCartById = async (id) => {
  const response = await cartsModels.findOne({_id:id});
  return response;
};
/* chequear */
const addProductToCart = async (cid, pid) => {
  /* traigo el carrito con el ID buscado */
  const cart = await cartsModels.findOne({_id: cid});
  /* chequeo si dentro del carrito hay un producto con el pid igual */
  const productIndex = cart.products.findIndex(
    (product) => product.product === pid
  );
  /* condicional parar determinar la accion a tomar dependiendo si existe el producto o no */
  if (productIndex === -1) {
    const newProduct = {
      product: pid,
      quantity: 1,
    };

    cart.products.push(newProduct)
    const response = await cartsModels.findByIdAndUpdate(cid, {products: cart.products})
    return response;
  } else {
    /* obtengo la cantidad del producto y lo incremento en 1. */
    let newQuantity = cart.products[productIndex].quantity
    newQuantity++;

     // Actualizo el campo 'quantity' del producto existente
    cart.products[productIndex].quantity = newQuantity;
    await cartsModels.findByIdAndUpdate(cid, {products: cart.products})
    const response = await cartsModels.findById(cid)
    return response;
  }
};

const updateCart = async (cid, cart) => {
  const response = cartsModels.findByIdAndUpdate(cid, cart);
  return response;
};


/* DELETE PRODUCTO FROM CART. */
const deleteProductFromCart = async (cid, pid) => {
  try {
    /* traigo el cart por el cid */
    const cart = await cartsModels.findOne({_id: cid})
    /* chequeo si dentro del carrito esta el producto por el id  */
    const productIndex = cart.products.findIndex(product => product.product === pid)
    /* si esta dentro del carrito, lo elimino. Sino, tiro error */
    if (productIndex !== -1){
      const productDeleted = cart.products[productIndex]
      await cartsModels.findByIdAndUpdate(cid, {
        $pull: { products: { product: pid } } // Use $pull para eliminar el producto especificado en el array de productos
      })
      return productDeleted
    }
  }
  catch (err){
    console.log(err)
  }
}

/* Agregar los productos en array en el carrito seleccionado */
const updateProductsToCart = async (cid) => {
  /* traigo el carrito */
  const cart = await cartsModels.findById(cid)

}

export { addCart, getCart, getCartById, addProductToCart, updateCart, deleteProductFromCart };
