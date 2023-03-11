import $api from '@/http'
import {and} from "@vuelidate/validators";

/** SYSTEMS START **/
async function getSystemas() {
  return await $api.get('/Systems')
}

async function getSystemasWithPagination({page, size}) {
  return await $api.get('/Systems', {
    params: {
      page: page,
      size: size
    }
  })
}

async function getSystemaById({id}) {
  return await $api.get('/Systems/' + id)
}

async function createSystema({name, url, secret}) {
  return await $api.post('/Systems', {
    name,
    url,
    secret
  })
}

async function editSystema({id, name, url, secret}) {
  return await $api.put('/Systems/' + id, {
    id,
    name,
    url,
    secret
  })
}

async function deleteSystema({id}) {
  return await $api.delete('/Systems/' + id)
}

/** SYSTEMS TYPES END **/

let genResult = {
  currentPage: null,
  pageSize: null,
  totalPages: null,
  totalItems: null,
  result: [],
  pagenumbersStart: null,
  pagenumbersEnd: null
}


export default {
  getSystemas,
  getSystemasWithPagination,
  getSystemaById,
  createSystema,
  editSystema,
  deleteSystema
}
