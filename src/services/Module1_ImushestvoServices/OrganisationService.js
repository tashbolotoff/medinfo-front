import $api from '@/http'
async function getOrganisationsByPage(page, size) {
  return await $api.get('/Organisations', {
    params: {
      page: page,
      size: size
    }
  })
}async function getOrganisations() {
  return await $api.get('/Organisations')
}

export default {
  getOrganisations,
  getOrganisationsByPage
}
