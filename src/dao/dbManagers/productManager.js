import productsModel from "../models/products.models.js";

const getProducts = async (queryObj) => {
    
    const response = await productsModel.find().lean()
    return response
}

const getProductsWithFilters = async (obj) => {
    const {limit, page, query, sort} = obj

    const response = await productsModel.paginate({},{limit:limit, page:page})
    return response;
}

const getProductsById = async (id) => {
    const response = await productsModel.findById(id)
    return response
}

const addProduct = async (product) => {
    await productsModel.create(product)
    return product
}

const updateProduct = async (id, product) => {
    await productsModel.findByIdAndUpdate(id, product)
    return product
}

const deleteProduct = async (id) => {
    const response = await productsModel.findByIdAndDelete(id)
    return response
}


export {getProducts, getProductsWithFilters, getProductsById, addProduct, updateProduct, deleteProduct}