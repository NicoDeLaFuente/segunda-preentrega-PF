import { Router } from "express";
import __dirname from "../utils.js";
import { getProductsById, addProduct, updateProduct, deleteProduct } from "../dao/dbManagers/productManager.js";
import productsModel from "../dao/models/products.models.js";

const router = Router();

router.get("/", async (req, res) => {
  try{
    /* const {limit = 10, page = 1, sort, query} = req.query
    const results = await productsModel.paginate(query ? {category: query} : {},{limit, page, lean: true, sort: sort ? {price:1} : {price:-1}})
    let prevLink = results.hasPrevPage ? `http://localhost:8080/productos/?page=${+page-1}&limit=${limit}&query=${query}&sort=${sort}` : null
    let nextLink = results.hasNextPage ? `http://localhost:8080/productos/?page=${+page+1}&limit=${limit}&query=${query}&sort=${sort}` : null
    results.prevLink = prevLink
    results.nextLink = nextLink
    res.json({results}) */

      const { limit = 10, page = 1, sort, query } = req.query;
      // Validar y formatear los parámetros
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const parsedSort = sort === 'asc' ? 1 : -1; // Ejemplo para manejar orden ascendente/descendente

      const filter = query ? { category: query } : {};

      const results = await productsModel.paginate(filter, {
        limit: parsedLimit,
        page: parsedPage,
        lean: true,
        sort: { price: parsedSort },
      });

      // Generar enlaces previos y siguientes
      const prevParams = new URLSearchParams({ limit, page: parsedPage - 1, query, sort });
      const nextParams = new URLSearchParams({ limit, page: parsedPage + 1, query, sort });


      results.prevLink = results.hasPrevPage
      ? `http://localhost:8080/productos/?${prevParams}`
      : null;

      results.nextLink = results.hasNextPage
      ? `http://localhost:8080/productos/?${nextParams}`
      : null;

      res.json({results})
    } 
    catch (err) {
    res.status(500).json({ message: "Something went wrong", err });
    }
})

router.get("/:pid", async (req, res) => {
  try {
    const {pid} = req.params;
    const product = await getProductsById(pid)
    res.json({ message: "success", data: product });
  }
  catch(err) {
    res.json({message: "El ID buscado no se encontro en la BBDD", error: err})
  }
});

router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const newProduct = {};

  if ((!title, !description, !code, !price, !stock, !category)) {
    res.status(400).send("Faltan datos para poder postear el producto");
  } else {
    (newProduct.title = title),
      (newProduct.description = description),
      (newProduct.code = code),
      (newProduct.price = price),
      (newProduct.status =
        !status || typeof status !== "boolean" ? true : status),
      (newProduct.stock = stock),
      (newProduct.category = category),
      (newProduct.thumbnails = !thumbnails ? [] : thumbnails)
  }

  try {
    const response = await addProduct(newProduct)
    res.json({ message: "producto agregado", product: response });
  } catch (err) {
    res.status(500).send("problemas con el servidor.");
  }
});

/* revisar porque no funciona */
router.put("/:pid", async (req, res) => {
    try {
        const {pid} = req.params

    const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      } = req.body;

      const newProduct = {title, description, code, price, status, stock, category, thumbnails}

      const response = await updateProduct(pid, newProduct)
      res.json({message: "success. Producto actualizado", data: response})
    }
    catch (err){
      console.log(err)
        res.json({message: "No se pudo actualizar el producto", error: err})
    }
})

router.delete("/:pid", async (req, res) => {
    const {pid} = req.params

    const response = await deleteProduct(pid)
    res.json({message: "success. El producto se ha elimiado", data: response})
})

export default router;
