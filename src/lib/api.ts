const formulario = document.querySelector('#formulario') as HTMLFormElement
const nombre = formulario.querySelector('#nombre') as HTMLInputElement
const email = formulario.querySelector('#email') as HTMLInputElement
const telefono = formulario.querySelector('#telefono') as HTMLInputElement
const descripcion = formulario.querySelector('#descripcion') as HTMLInputElement

export async function enviarCorreo() {
    const formsend = { 
        email: email.value,
        nombre: nombre.value,
        telefono: telefono.value,
        descripcion: descripcion.value,
    }
    const response = await fetch('https://jaweb.es:3000/api/emails', {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formsend),
    });

    if (response.ok) {
        window.location.replace("index.html");
    }
}