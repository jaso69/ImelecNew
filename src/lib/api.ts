const form = document.querySelector('form') as HTMLFormElement
const nombre = form.querySelector('#nombre') as HTMLInputElement
const email = form.querySelector('#email') as HTMLInputElement
const telefono = form.querySelector('#telefono') as HTMLInputElement
const descripcion = form.querySelector('#descripcion') as HTMLInputElement

export async function enviarCorreo() {
    const response = await fetch('/api/send-emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email.value,
            nombre: nombre.value,
            telefono: telefono.value,
            descripcion: descripcion.value,
        }),
    });

    const { success } = await response.json();
    if (success) {
        window.location.replace("index.html");
    }
}