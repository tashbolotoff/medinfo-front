import $api from '@/http'

async function getRegions() {
  const response = await $api.get('/Oblasts/')
  return response.data.result
}

export default { getRegions }
