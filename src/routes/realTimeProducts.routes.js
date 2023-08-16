import { Router } from "express";
import { getProducts } from "../dao/dbManagers/productManager.js";

const router = Router()

router.get("/", async (req, res) => {
    const products = await getProducts()
    res.render("realTimeProducts", {products})
})

export default router;