const cuerpo = document.querySelector('#cuerpo')
const loading = document.querySelector('#loading')
const bodychat = document.querySelector('#bodychat')

const historico = []

export const respuesta = (resp) => {
  let item = ''
  loading.classList.remove('block')
  loading.classList.add('hidden')
  if (resp.choices[0].message.content) {
    item = `<li class="p-2 mb-2 w-auto rounded-md bg-red-100 text-red-800 text-sm">${resp.choices[0].message.content}</li>`
  } else {
    item = '<li class="p-2 mb-2 w-auto rounded-md bg-red-100 text-red-800 text-sm">Estamos experimentado un error, intenta nuevamente</li>'
  }
  cuerpo.insertAdjacentHTML('beforeend', item)
  bodychat.scrollTop = bodychat.scrollHeight
}

export async function assist (pregunta) {
  if (pregunta.trim() === '') { return }
  loading.classList.remove('hidden')
  loading.classList.add('block')
  const prompt = { prompt: pregunta }
  historico.push(prompt)
  const url = 'https://imelec-backend-zi7c.vercel.app/'
  const data = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prompt)
  })
  const resp = await data.json()
  respuesta(resp)
}
