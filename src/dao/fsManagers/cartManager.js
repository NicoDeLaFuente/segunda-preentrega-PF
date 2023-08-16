import { error } from "console";
import { json } from "express";
import fs from "fs";

class CartManager {
  static carts;
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  addCart = async () => {
    this.carts = await this.getCarts();

    const id = this.carts.length + 1;

    const newCart = {
      id: id,
      products: [],
    };

    this.carts.push(newCart);
    const dataToJson = JSON.stringify(this.carts);
    fs.promises.writeFile(this.path, dataToJson);
  };

  getCarts = () => {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data);
    } else {
      return [];
    }
  };

  getCartById = (id) => {
    const carts = this.getCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === id);

    if (cartIndex !== -1) {
      return carts[cartIndex];
    } else {
      throw new Error(`el id no existe`);
    }
  };

  addProductToCart = (cid, pid) => {
    const cart = this.getCartById(cid)

    const {products} = cart;
    const productIndex = products.findIndex(product => product.product === pid)

    if(productIndex !== -1) {
      products[productIndex].quantity++
    } else {
      products.push({
        product: pid,
        quantity: 1
      })
    }
    this.updateCart(cart)
    return cart;
  }

  updateCart = async (cart) =>{

    const {id} = cart
    const carts = await this.getCarts()
    const cartToUpdateIndex = carts.findIndex(carro => carro.id === id)
    
    carts.splice(cartToUpdateIndex, 1, cart)
    const dataToJson = JSON.stringify(carts)
    fs.promises.writeFile(this.path, dataToJson)
  }
}

export { CartManager };
