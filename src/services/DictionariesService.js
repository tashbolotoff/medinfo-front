import $api from '@/http'
import {and} from "@vuelidate/validators";

/** ORGANISATION TYPES START **/
async function getOrganisationTypes() {
  return await $api.get('/TypeOrganisations')
}

async function getOrganisationTypesWithPagination({ page, size}) {
  return await $api.get('/TypeOrganisations', {
    params: {
      page: page,
      size: size
    }
  })
}

async function getOrganisationTypeById({ id }) {
  return await $api.get('/TypeOrganisations/' + id)
}

async function createOrganisationType({ name }) {
  return await $api.post('/TypeOrganisations', {
    name
  })
}

async function editOrganisationType({ id, name }) {
  return await $api.put('/TypeOrganisations/' + id, {
    id,
    name
  })
}

async function deleteOrganisationType({ id }) {
  return await $api.delete('/TypeOrganisations/' + id)
}
/** ORGANISATION TYPES END **/


/** STATUSES START **/
async function getStatuses() {
  return await $api.get('/Status')
}

async function getStatusesWithPagination({ page, size}) {
  return await $api.get('/Status', {
    params: {
      page: page,
      size: size
    }
  })
}

async function getStatusById({ id }) {
  return await $api.get('/Status/' + id)
}

async function createStatus({ name }) {
  return await $api.post('/Status', {
    name
  })
}

async function editStatus({ id, name }) {
  return await $api.put('/Status/' + id, {
    id,
    name
  })
}

async function deleteStatus({ id }) {
  return await $api.delete('/Status/' + id)
}
/** STATUSES END **/


/** OTRASLS START **/
async function getOtrasls() {
  return await $api.get('/Otrasls')
}

async function getOtraslsWithPagination({ page, size}) {
  return await $api.get('/Otrasls', {
    params: {
      page: page,
      size: size
    }
  })
}

async function getOtraslById({ id }) {
  return await $api.get('/Otrasls/' + id)
}

async function createOtrasl({ name }) {
  return await $api.post('/Otrasls', {
    name
  })
}

async function editOtrasl({ id, name }) {
  return await $api.put('/Otrasls/' + id, {
    id,
    name
  })
}

async function deleteOtrasl({ id }) {
  return await $api.delete('/Otrasls/' + id)
}
/** OTRASLS END **/

/** ORGPRAVS START **/
async function getOrgPravs() {
  return await $api.get('/OrgPravs')
}

async function getOrgPravsWithPagination({ page, size}) {
  return await $api.get('/OrgPravs', {
    params: {
      page: page,
      size: size
    }
  })
}

async function getOrgPravById({ id }) {
  return await $api.get('/OrgPravs/' + id)
}

async function createOrgPrav({ name }) {
  return await $api.post('/OrgPravs', {
    name
  })
}

async function editOrgPrav({ id, name }) {
  return await $api.put('/OrgPravs/' + id, {
    id,
    name
  })
}

async function deleteOrgPrav({ id }) {
  return await $api.delete('/OrgPravs/' + id)
}
/** ORGPRAVS END **/


/** FORMASOBST START **/
async function getFormaSobsts() {
  return await $api.get('/FormaSobsts')
}

async function getFormaSobstsWithPagination({ page, size}) {
  return await $api.get('/FormaSobsts', {
    params: {
      page: page,
      size: size
    }
  })
}

async function getFormaSobstsById({ id }) {
  return await $api.get('/FormaSobsts/' + id)
}

async function createFormaSobsts({ name }) {
  return await $api.post('/FormaSobsts', {
    name
  })
}

async function editFormaSobsts({ id, name }) {
  return await $api.put('/FormaSobsts/' + id, {
    id,
    name
  })
}

async function deleteFormaSobsts({ id }) {
  return await $api.delete('/FormaSobsts/' + id)
}
/** FORMASOBST END **/

/** SOSTOYANIES START **/
async function getSostoyanies() {
  return await $api.get('/Sostoyanies')
}

async function getSostoyaniesWithPagination({ page, size}) {
  return await $api.get('/Sostoyanies', {
    params: {
      page: page,
      size: size
    }
  })
}

async function getSostoyaniesById({ id }) {
  return await $api.get('/Sostoyanies/' + id)
}

async function createSostoyanies({ name }) {
  return await $api.post('/Sostoyanies', {
    name
  })
}

async function editSostoyanies({ id, name }) {
  return await $api.put('/Sostoyanies/' + id, {
    id,
    name
  })
}

async function deleteSostoyanies({ id }) {
  return await $api.delete('/Sostoyanies/' + id)
}
/** SOSTOYANIES END **/

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
  getOrganisationTypes,
  getOrganisationTypesWithPagination,
  getOrganisationTypeById,
  createOrganisationType,
  editOrganisationType,
  deleteOrganisationType,
  getStatuses,
  getStatusesWithPagination,
  getStatusById,
  createStatus,
  editStatus,
  deleteStatus,
  getOtrasls,
  getOtraslsWithPagination,
  getOtraslById,
  createOtrasl,
  editOtrasl,
  deleteOtrasl,
  getOrgPravs,
  getOrgPravsWithPagination,
  getOrgPravById,
  createOrgPrav,
  editOrgPrav,
  deleteOrgPrav,
  getFormaSobsts,
  getFormaSobstsWithPagination,
  getFormaSobstsById,
  createFormaSobsts,
  editFormaSobsts,
  deleteFormaSobsts,
  getSostoyanies,
  getSostoyaniesWithPagination,
  getSostoyaniesById,
  createSostoyanies,
  editSostoyanies,
  deleteSostoyanies
}
