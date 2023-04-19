import $api from '@/http'

async function getAnketaByPin(pin) {
  return await $api.get('/OpenServices/last_anketa', {
    params: {
      pin
    }
  })
}

async function saveAnketaByPin(list) {
  return await $api.post('/OpenServices/set_anketa',
    list
  )
}

export default {
  getAnketaByPin,
  saveAnketaByPin
}
