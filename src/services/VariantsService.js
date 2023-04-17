import $api from "@/http";

async function getVariants(page, size) {
  return await $api.get('/Variants', {
    params: {
      page: page,
      size: size
    }
  })
}

function createVariant({name}) {
  return $api.post('/Variants', {
    name: name
  })
}

function updateVariant(id, name) {
  return $api.put('/Variants/' + id, {
    id: id,
    name: name
  })
}

function deleteVariant(id) {
  return $api.delete('/Variants/' + id, {
    id: id
  })
}

async function getVariantById(id) {
  return await $api.get('/Variants/' + id)
}

export default {
  getVariants,
  createVariant,
  getVariantById,
  updateVariant,
  deleteVariant
}
