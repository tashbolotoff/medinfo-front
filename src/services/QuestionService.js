import $api from "@/http";

function createQuestion({nameRu, nameKg, nameEn, multiple, variantId}) {
  return $api.post('/Questions', {
    nameRu, nameKg, nameEn, multiple, variantId
  })
}

function updateQuestion({id, nameRu, nameKg, nameEn, multiple, variantId}) {
  return $api.put('/Questions/' + id, {
    id, nameRu, nameKg, nameEn, multiple, variantId
  })
}

function createAnswer({nameRu, nameKg, nameEn, end, questionId}) {
  return $api.post('/Answers', {
    nameRu, nameKg, nameEn, end, questionId
  })
}

function updateAnswer({id, nameRu, nameKg, nameEn, end, questionId}) {
  return $api.put('/Answers/' + id, {
    id, nameRu, nameKg, nameEn, end, questionId
  })
}

function deleteQuestion(id) {
  return $api.delete('/Questions/' + id, {
    id: id
  })
}


function deleteAnswer(id) {
  return $api.delete('/Answers/' + id, {
    id: id
  })
}


export default {
  createQuestion,
  updateQuestion,
  createAnswer,
  updateAnswer,
  deleteQuestion,
  deleteAnswer
}
