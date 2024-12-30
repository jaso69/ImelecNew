const cuerpo = document.querySelector('#cuerpo')
const loading = document.querySelector('#loading')
const bodychat = document.querySelector('#bodychat')

const historico = []

export const respuesta = (resp) => {
  loading.classList.remove('block')
  loading.classList.add('hidden')
  const item = `<li class="p-2 mb-2 w-auto rounded-md bg-red-100 text-red-800 text-sm">${resp.message}</li>`
  cuerpo.insertAdjacentHTML('beforeend', item)
  bodychat.scrollTop = bodychat.scrollHeight
}

export async function assist (pregunta) {
  loading.classList.remove('hidden')
  loading.classList.add('block')
  const prompt = { role: 'user', content: pregunta }
  historico.push(prompt)
  console.log(historico)
  const url = 'https://jaweb.es:3000/api/imelec?prompt=' + pregunta
  const data = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(historico)
  })
  const resp = await data.json()
  respuesta(resp)
}
