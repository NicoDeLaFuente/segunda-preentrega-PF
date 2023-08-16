import mongoose from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = new mongoose.Schema({
    products: [
        {
            product: {
                /* populate */
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
            },
            quantity: Number
        }, 
    ]
})

/* populate */
cartsSchema.pre("find", async function(next){
    this.populate("products.product")
    next()
})

const cartsModels = mongoose.model(cartsCollection, cartsSchema)

export default cartsModels