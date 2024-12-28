import { Resend } from 'resend'

const resend = new Resend('')

export async function POST ({ request }) {
  // console.log(await request.json())
  const { email, nombre, telefono, descripcion } = await request.json()

  try {
    const response = await resend.emails.send({
      from: 'info@imelec.es',
      to: 'info@imelec.es',
      subject: 'Presupuesto',
      html: `
                <p>Nombre: ${nombre}</p>
                <p>Email: ${email}</p>
                <p>Teléfono: ${telefono}</p>
                <p>Descripción:</p>
                <p>${descripcion}</p>
            `
    })

    return new Response(JSON.stringify({ success: true, response }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 })
  }
}