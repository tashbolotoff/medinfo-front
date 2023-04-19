import $api from '@/http'

async function getAnketaByPin(pin) {
  return await $api.get('/OpenServices/last_anketa', {
    params: {
      pin
    }
  })
}

export default {
  getAnketaByPin
}
