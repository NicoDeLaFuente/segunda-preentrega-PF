const socket = io() // levantamos el socket desde el lado del cliente

socket.on('render', (data) => {
    console.log(data)
})


const form = document.getElementById("formProducts")
form.addEventListener("submit", (e) => {
    e.preventDefault()
    
    const productTitle = document.getElementById("productTitle");
    const productDescription = document.getElementById("productDescription")
    const productPrice = document.getElementById("productPrice")
    const productCode = document.getElementById("productCode")
    const productStock = document.getElementById("productStock")
    const productThumbnails = document.getElementById("productThumbnails")
    const productCategory = document.getElementById("productCategory")

    const product = {
        title: productTitle.value,
        description: productDescription.value,
        price: productPrice.value,
        code: productCode.value,
        stock: productStock.value,
        thumbnails: productThumbnails.value? [productThumbnails.value] : [],
        category: productCategory.value
    }

    socket.emit('addProduct', product)

    //vacio los campos del formualrio
    productTitle.value = ""
    productDescription.value = ""
    productPrice.value= ""
    productCode.value= ""
    productStock.value = ""
    productThumbnails.value = ""

    //refresca para que se pueda actualizar la lista de productos.
    location.reload()
})

const deleteButton = document.querySelectorAll(".deleteButton")
deleteButton.forEach(button => {
    button.addEventListener("click", () => {
        const id = button.id
        const productId = {
            id: id
        }
        //envio el socket para recibirlo en el servidor
        socket.emit('delete-product', productId)
        //fuerzo el refresh para que se actualice la lista. 
        location.reload()
    })
})



