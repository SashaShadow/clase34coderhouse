const socket = io.connect();

const element = document.querySelector("#element");
const myButton = document.querySelector("#myButton");
const chatButton = document.querySelector("#chatButton");
const chatForm = document.querySelector(".chatForm");
const prodForm = document.querySelector(".myForm");
const chatUser = document.querySelector(".chatUser");

console.log(chatUser.innerHTML)

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    return fetch(`http://localhost:8080/api/mensajes/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {"author": 
                {"alias": chatUser.innerHTML,}, 
            "text": e.target.text.value, 
            "time": new Date().toLocaleString()}),})
})

prodForm.addEventListener("submit", (event) => {
    event.preventDefault();
    return fetch(`http://localhost:8080/api/products/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"name": event.target.name.value, "price":event.target.price.value,
        "desc": event.target.desc.value, "photo": event.target.photo.value, "code": event.target.code.value,
        "stock": event.target.stock.value}),})
})


const render = (data) => {
    const html = data.map(elem => {
        return (`<div style="display:flex; column-gap: 0.2rem;">
        <strong style="color:blue;">${elem.author.alias}</strong> 
        <p style="color:brown;">[${elem.time}]</p>
        <i style="color:green;">${elem.text}</i></div>`)}).join(" ");
        document.querySelector(".ChatMsgs").innerHTML = html;
}

const addMessage = () => {
    const mensaje = {
        alias: chatUser.innerHTML,
        text: document.querySelector("#text").value,
    }

    socket.emit("new-message", mensaje);
    return false;
}

chatForm.addEventListener("submit", () => addMessage());

const addProducto = () => {
    const producto = {
        name: document.querySelector("#name").value,
        price: document.querySelector("#price").value,
        photo: document.querySelector("#photo").value,
    }
    socket.emit("nuevo-producto", producto);
    return false;
}

myButton.addEventListener("click", () => addProducto());

socket.on("Mensajes", data => {
    render(data);
});

socket.on("MensajeIndividual", data => {
    document.querySelector(".ChatMsgs").innerHTML+=`
    <div style="display:flex; column-gap: 0.2rem;">
        <strong style="color:blue;">${data.alias}</strong> 
        <p style="color:brown;">[${data.time}]</p>
        <i style="color:green;">${data.text}</i></div>               
`
   // window.scrollTo(0, document.body.scrollHeight);
});


//PRODUCTOS FAKER

const getTemplate = async () => {
    const template = await fetch("http://localhost:8080/api/template.html");
    const templateData = await template.text();
    return templateData;
}


socket.on("Productos", async data => {
    const templateData = await getTemplate();
    const template = ejs.compile(templateData);

    const templateRendered = data.map(elem => {
        return template({
            name: elem.name,
            price: elem.price,
            photo: elem.photo,
            id: elem.id,
        })
    }).join(" ");

    element.innerHTML = templateRendered;
});


socket.on("ProductoIndividual", async data => {
    const templateData = await getTemplate();
    const template = ejs.compile(templateData);

    const templateRendered = template({
        name: data.name,
        price: data.price,
        photo: data.photo,
        id: data.id,
    })

    console.log(templateRendered);

    element.innerHTML += templateRendered;
})



console.log("funciona el import xd");