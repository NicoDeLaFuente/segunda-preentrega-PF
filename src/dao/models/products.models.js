import mongoose from 'mongoose'

//importo libreria de paginacion
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = 'products'

const productsSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    thumbnails: Object,
    code: {
        type: String,
        unique: true,
        required:true
    },
    stock: Number, 
    status: Boolean,
    category: String 
})

//agrego como plugin la libreria de paginacion
productsSchema.plugin(mongoosePaginate)

const productsModel = mongoose.model(productsCollection, productsSchema)

export default productsModel