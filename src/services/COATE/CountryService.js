import $api from '@/http'

async function getCountries() {
  const response = await $api.get('/Country')
  return response.data.result
}

export default {
  getCountries
}
