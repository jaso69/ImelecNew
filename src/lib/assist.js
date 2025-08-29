const cuerpo = document.querySelector('#cuerpo')
const loading = document.querySelector('#loading')
const bodychat = document.querySelector('#bodychat')

const historico = []

export const respuestaStream = (chunk) => {
  loading.classList.remove('block')
  loading.classList.add('hidden')

  // Buscamos el último elemento de respuesta o creamos uno nuevo
  let lastItem = cuerpo.lastElementChild
  if (!lastItem || !lastItem.classList.contains('streaming-response')) {
    lastItem = document.createElement('li')
    lastItem.className = 'p-2 mb-2 w-auto rounded-md bg-red-100 text-red-800 text-sm streaming-response'
    cuerpo.insertAdjacentElement('beforeend', lastItem)
  }
  // Añadimos el nuevo chunk al contenido existente
  lastItem.textContent += chunk

  bodychat.scrollTop = bodychat.scrollHeight
}

export const respuestaNormal = (resp) => {
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

export async function assist (pregunta, useStream = true) {
  if (pregunta.trim() === '') { return }

  loading.classList.remove('hidden')
  loading.classList.add('block')

  const prompt = {
    prompt: pregunta,
    stream: useStream // Añadimos el parámetro para streaming
  }

  historico.push(prompt)
  const url = 'https://imelec-backend-zi7c.vercel.app/'

  if (useStream) {
    // Modo streaming
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      })

      if (!response.ok) throw new Error('Error en la respuesta')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let partialData = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        partialData += chunk
        // Procesamos cada chunk de datos
        // Esto puede variar dependiendo del formato exacto del stream de DeepSeek
        // Necesitarás ajustarlo según cómo envíe los datos la API
        const lines = partialData.split('\n')
        partialData = lines.pop() // Guardamos el último fragmento incompleto
        for (const line of lines) {
          if (line.startsWith('data:') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.substring(5))
              if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                respuestaStream(data.choices[0].delta.content)
              }
            } catch (e) {
              console.error('Error parsing stream data:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error en el stream:', error)
      respuestaNormal({ choices: [{ message: { content: 'Error al obtener la respuesta en streaming' } }] })
    }
  } else {
    // Modo normal (sin streaming)
    try {
      const data = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prompt)
      })
      const resp = await data.json()
      respuestaNormal(resp)
    } catch (error) {
      console.error('Error:', error)
      respuestaNormal({ choices: [{ message: { content: 'Error al obtener la respuesta' } }] })
    }
  }
}
