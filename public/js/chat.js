const socket = io(); // levantamos el socket desde el lado del cliente

/* chat con websockets */
const userMessage = document.querySelector("#userMessage");
let userEmail;
//autenticacion con sweet alert
Swal.fire({
  title: "Please enter your email",
  input: "text",
  allowOutsideClick: false,
  showConfirmButton: false,
}).then((result) => {
  userEmail = result.value;

  userMessage.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      if (userMessage.value.trim().length > 0) {
        const obj = {
          user: userEmail,
          message: userMessage.value,
        };
        socket.emit("user-message", obj)
        
      } else {
        alert("Para enviar el mensaje, debes escribir primero");
      }
      userMessage.value = "";
    }
  });
});

// Escuchar el evento "new-message" del servidor
socket.on("new-message", (message) => {
    // Aquí actualizas el DOM con el nuevo mensaje recibido
    const chatContainer = document.querySelector(".display-messages");
    const messageElement = document.createElement("div");
    messageElement.classList.add(message.id); // Asegúrate de que el mensaje tenga una clase con el ID para eliminarlo correctamente.
    messageElement.innerHTML = `
      <small>${message.user}</small>
      <p>${message.message}</p>
    `;
    chatContainer.appendChild(messageElement);
  });





