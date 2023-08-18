async function createCartAndAddProducts () {
  const  cartResponse = await fetch("api/carts", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
  });
  //Espero a que se complete la creacion del carrito.
    const cartData = await cartResponse.json(); // Parse the response JSON
    const cid = cartData.data._id; // Extraigo el ID del carrito que se creo recientemente

    console.log(cid)
    const goToCart = document.querySelector(".go-to-cart")
    goToCart.addEventListener("click", async (event) => {
      try{
        event.preventDefault()
        window.location.href = `cart/${cid}`
      }
      catch (err) {
        console.log("no se pudo ir al carrito")
      }
      
    })



  const addToCart = document.querySelectorAll(".add-to-cart");
  addToCart.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonId = button.id;
      addProductToCart(cid, buttonId).then(alert("Producto Agregado al carrito correctamente"));
    });
  });
};

createCartAndAddProducts()

//Hago el fetch para poder agregar el producto al carrito que se creo.
const addProductToCart = async (cid, pid) => {
  try {
    const response = await fetch(`api/carts/${cid}/product/${pid}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    });
    console.log(response);
    return response;
  } catch (err) {
    console.log(err);
  }
};