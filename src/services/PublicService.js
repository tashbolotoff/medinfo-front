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

async function getOblasts() {
  return await $api.get('/OpenServices/GetOblast')
}

async function getRayonsByOblastId(oblastId) {
  return await $api.get('/OpenServices/GetRayonByOblast', {
    params: {
      id: oblastId
    }
  })
}

async function getOzByRayonId(rayonId) {
  return await $api.get('/OpenServices/GetOzByRayon', {
    params: {
      id: rayonId
    }
  })
}

async function creationAnketaByPatient(pin, ozName, ozCode, ozCodeOld, ozId, ozParentCode) {
  return await $api.post('/OpenServices/CreateAnketaByPatient',
    {
      pin, ozName, ozCode, ozCodeOld, ozId, ozParentCode
    }
  )
}

export default {
  getAnketaByPin,
  saveAnketaByPin,
  getOblasts,
  getRayonsByOblastId,
  getOzByRayonId,
  creationAnketaByPatient
}
