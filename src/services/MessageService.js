import $api from '@/http'
async function getMessagesByPage(page, size) {
  return await $api.get('/Messages', {
    params: {
      page: page,
      size: size
    }
  })
}
async function getMessagesForPatientByPage(page, size) {
  return await $api.get('/MessageForPatients', {
    params: {
      page: page,
      size: size
    }
  })
}
async function getMessages() {
  return await $api.get('/Messages')
}
async function getCategories() {
  return await $api.get('/Categorys')
}

async function createMessage(formData) {
  delete formData.id
  return await $api.post('/Messages',formData)
}

async function updateMessage(id, formData) {
  return await $api.put('/Messages/'+id, formData)
}

async function deleteMessage(id) {
  return await $api.delete('/Messages/'+id)
}

export default {
  getMessages,
  deleteMessage,
  createMessage,
  updateMessage,
  getCategories,
  getMessagesByPage,
  getMessagesForPatientByPage
}
