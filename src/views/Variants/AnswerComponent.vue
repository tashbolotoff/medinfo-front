<template>
    <div class="grid grid-cols-12 gap-3">
      <!-- Таблица овтетов-->
      <div class="col-span-12 bg-theme-19 rounded-2xl shadow p-5">
        <div class="grid grid-cols-12 gap-4 p-2">
          <div class="col-span-6 font-bold text-base">
            Список вариантов ответа на вопрос: {{ question.nameRu }}
          </div>
          <div class="col-span-6 flex justify-end">
            <button @click="closeComponent" type="button" class="btn btn-sm btn-secondary">
              <XIcon/>
              Закрыть
            </button>
          </div>
          <div class="col-span-6">
            <span class="font-medium">Кол-во вариантов ответа:</span> {{ question.answers.length }}
          </div>
          <div class="col-span-6 flex justify-end">
            <button @click="showModalCreateAnswer" type="button" class="btn btn-sm btn-primary">
              <PlusIcon/>
              Добавить
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="table">
            <thead class="rounded-full sticky">
            <tr class="bg-gray-200 text-gray-700">
              <th class="border-b-2 text-center dark:border-dark-5 width-60">Название</th>
              <th class="border-b-2 text-center dark:border-dark-5 width-60">Конечный ответ</th>
              <th class="border-b-2 text-center dark:border-dark-5 width-60">Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in question.answers" v-bind:key="item">
              <td class="border text-center">
                <div>RU: {{ item.nameRu }}</div>
                <div>KG: {{ item.nameKg }}</div>
                <div>EN: {{ item.nameEn }}</div>
              </td>
              <td class="border text-center">
                {{ item.end ? 'Да' : 'Нет' }}
              </td>
              <td class="border text-center">
                <div class="dropdown">
                  <button class="dropdown-toggle btn btn-sm btn-secondary" aria-expanded="false">
                    Действия
                    <ChevronDownIcon class="w-4 h-4 ml-2"/>
                  </button>
                  <div class="dropdown-menu">
                    <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                      <button type="button" v-if="AdminService.hasAccess(['ANKETA_EDIT'])"
                              @click="showModalUpdateAnswer(item);hide"
                              class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                        <Edit2Icon class="w-4 h-4 mr-2"/>
                        Редактировать
                      </button>
                      <button type="button" v-if="AdminService.hasAccess(['ANKETA_EDIT'])"
                         class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                         @click="showModalDelete(item)"
                      >
                        <Trash2Icon class="w-4 h-4 mr-1"/>
                        Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="question.answers.length===0">
              <td colspan="10" class="text-center border">(нет записей)</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  <!--  Модлка для добавления вопросов-->
  <div
    v-if="modalParams.show"
    id="user-modal"
    class="modal overflow-y-auto show custom-modal"
    aria-hidden="true"
    data-backdrop='static'
    style="z-index: 999!important;"
  >
    <div class="modal-dialog" style="width: 30%!important;">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 v-if="modalParams.isEdit" class="font-medium text-base mr-auto">
            Редактирование ответа
          </h2>
          <h2 v-else class="font-medium text-base mr-auto">
            Добавление ответа
          </h2>
        </div>
        <!-- END: Modal Header -->
        <!-- BEGIN: Modal Body -->
        <form v-on:submit.prevent="modalParams.isEdit ? updateAnswer() : createAnswer()">
          <div class="modal-body grid grid-cols-12 gap-4 gap-y-3">
            <div class="col-span-12">
              <label class="form-label">Наименование ответа на кыргызском языке<span
                style="color: red">*</span></label>
              <input
                required
                v-model="modalParams.datas.nameKg"
                type="text"
                placeholder="Введите наименование ответа на кыргызском..."
                class="form-control"
              />
            </div>
            <div class="col-span-12">
              <label class="form-label">Наименование ответа на русском языке<span style="color: red">*</span></label>
              <input
                required
                v-model="modalParams.datas.nameRu"
                type="text"
                placeholder="Введите наименование ответа на русском..."
                class="form-control"
              />
            </div>
            <div class="col-span-12">
              <label class="form-label">Наименование ответа на анлийском языке<span style="color: red">*</span></label>
              <input
                required
                v-model="modalParams.datas.nameEn"
                type="text"
                placeholder="Введите наименование ответа на ангийском..."
                class="form-control"
              />
            </div>
            <div class="col-span-12">
              <div class="form-check mt-5">
                <input id="horizontal-form-3" class="form-check-input" type="checkbox"
                       v-model="modalParams.datas.end">
                <label class="form-check-label" for="horizontal-form-3">Конечный?</label>
              </div>
            </div>
          </div>
          <!-- END: Modal Body -->
          <!-- BEGIN: Modal Footer -->
          <div class="modal-footer text-right">
            <button
              type="button"
              @click="resetModalAnswerData"
              id="close"
              class="btn btn-outline-secondary mr-1"
            >
              Отмена
            </button>
            <button class="btn btn-primary" type="submit" :disabled="modalParams.loading">
              <Spinner v-if="modalParams.loading" class="w-5 h-5 mr-2"/>
              Сохранить
            </button>
          </div>
        </form>
        <!-- END: Modal Footer -->
      </div>
    </div>
  </div>

  <!--Delete Confirmation Modal -->
  <div
    v-if="modalParams.isDelete"
    id="delete-confirmation-modal-answer"
    class="modal overflow-y-auto show custom-modal"
    data-backdrop='static'
    aria-hidden="true"
    style="z-index: 999!important;"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body p-0">
          <div class="p-5 text-center">
            <XCircleIcon class="w-16 h-16 text-theme-6 mx-auto mt-3"/>
            <div class="text-3xl mt-5">Вы уверены?</div>
            <div class="text-gray-600 mt-2">
              Вы уверены что хотите удалить эту запись? <br/>
            </div>
          </div>
          <div class="px-5 pb-8 text-center">
            <button
              type="button"
              @click="resetDataDelete"
              class="btn btn-outline-secondary w-24 mr-1"
            >
              Отмена
            </button>
            <button @click="confirmDelete" type="button" class="btn btn-danger w-24">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {AdminService, QuestionService, VariantsService} from "@/services";
import {useRoute} from "vue-router";
import {onMounted, reactive, ref} from "vue";
import {createToast} from "mosha-vue-toastify";
import Spinner from "@/app-components/UIComponents/Spinner.vue";

const props = defineProps({
  question: Object
})
const emit = defineEmits(['reset-selected-question', 'get-info'])
const modalParams = reactive({
  show: false,
  loading: false,
  isEdit: false,
  isDelete: false,
  datas: {
    id: null,
    nameKg: null,
    nameRu: null,
    nameEn: null,
    end: false,
    questionId: null
  }
})
const itemForDelete = ref(null)

function showModalCreateAnswer() {
  modalParams.show = true
  modalParams.datas.questionId = props.question.id
}
function closeComponent() {
 emit('reset-selected-question')
}

function showModalUpdateAnswer(item) {
  modalParams.show = true
  modalParams.isEdit = true
  modalParams.datas.id = item.id
  modalParams.datas.nameKg = item.nameKg
  modalParams.datas.nameRu = item.nameRu
  modalParams.datas.nameEn = item.nameEn
  modalParams.datas.end = item.end
  modalParams.datas.questionId = props.question.id
}

function resetModalAnswerData() {
  modalParams.show = false
  modalParams.isEdit = false
  modalParams.datas.id = null
  modalParams.datas.nameRu = null
  modalParams.datas.nameKg = null
  modalParams.datas.nameEn = null
  modalParams.datas.end = false
}

function createAnswer() {
  modalParams.loading = true
  QuestionService.createAnswer(modalParams.datas).then(response => {
    modalParams.loading = false
    createToast({
      title: 'Запись успешно добавлена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
    resetModalAnswerData()
    emit('get-info')
  }).catch(() => {
    modalParams.loading = false
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
  })
}
const hide = () => {
  cash('.dropdown-menu').dropdown('hide')
}
function updateAnswer() {
  modalParams.loading = true
  QuestionService.updateAnswer(modalParams.datas).then(response => {
    modalParams.loading = false
    createToast({
      title: 'Запись успешно обновлена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
    resetModalAnswerData()
    emit('get-info')
  }).catch(() => {
    modalParams.loading = false
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
  })
}

function showModalDelete(item) {
  modalParams.isDelete = true
  itemForDelete.value = item
}

function resetDataDelete() {
  modalParams.isDelete = false
  itemForDelete.value = null
}

function confirmDelete() {
  QuestionService.deleteAnswer(itemForDelete.value.id).then(response => {
    resetDataDelete()
    createToast({
      title: 'Запись успешно удалена!'
    }, {
      type: 'warning',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
    emit('get-info')
  }).catch(error => {
    modalParams.isDelete = true
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
  })
}
</script>
