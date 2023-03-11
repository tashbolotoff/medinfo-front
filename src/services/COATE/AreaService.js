import $api from '@/http'
import {and} from "@vuelidate/validators";

async function getAreas() {
  const response = await $api.get('/Rayons/')
  return response.data.result
}

let genResult = {
  currentPage: null,
  pageSize: null,
  totalPages: null,
  totalItems: null,
  result: [],
  pagenumbersStart: null,
  pagenumbersEnd: null
}

async function getRayonByParams(page, size) {
  genResult = []
  try {
    await (async () => {
      await $api.get('/Rayons/',
        {
          params: {
            page: page,
            size: size
          }
        }
      ).then(response => {
        genResult.result = response.data.result
        genResult.currentPage = response.data.currentPage
        genResult.pageSize = response.data.pageSize
        genResult.totalPages = response.data.totalPages
        genResult.totalItems = response.data.totalItems
        genResult.pagenumbersStart = genResult.currentPage - 1 > 1 ? genResult.currentPage - 1 : 1
        genResult.pagenumbersEnd = genResult.currentPage + 5 < genResult.totalPages ? genResult.currentPage + 5 : genResult.totalPages
        return genResult
      })
    })()
  } catch (e) {
    console.log(e)
  }
}

async function getRayonById(id) {
  return await $api.get('/Rayons/' + id, {
    id,
  })
}

async function getRayons() {
  return await $api.get('/Rayons', {
    params: {
      page: null,
      size: null
    }
  })
}

export default {
  getAreas, getRayonByParams, getRayonById, getRayons
}
