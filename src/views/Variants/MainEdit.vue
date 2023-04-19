<template>
  <p class="font-bold text-xl mt-2">Редактирование анкеты</p>
  <div class="mt-4">
    <div class="grid grid-cols-12 gap-3">
      <!-- Наименование анкеты-->
      <div class="col-span-12 box p-5">
        <form class="grid grid-cols-12 gap-2" @submit.prevent="updateAnketaName()">
          <div class="col-span-10">
            <label>Наименование анкеты</label>
            <input type="text" class="form-control" v-model="anketa.name">
          </div>
          <div class="col-span-2 flex items-end justify-center">
            <button type="submit" class="btn btn-primary">Сохранить</button>
          </div>
        </form>

      </div>
      <!-- Таблица ответов-->
      <div class="col-span-12 m-3" v-if="selectedQuestion != null">
        <AnswerComponent :question="selectedQuestion"
                         @reset-selected-question="resetSelectedQuestion" @get-info="getInfo"/>
      </div>
      <!-- Таблица вопросов-->
      <div class="col-span-12 box p-5">
        <div class="grid grid-cols-12 gap-4 p-2">
          <div class="col-span-12 font-bold text-base">
            Список вопросов
          </div>
          <div class="col-span-6">
            <span class="font-medium">Кол-во вопросов:</span> {{ anketa.questions.length }}
          </div>
          <div class="col-span-6 flex justify-end">
            <button @click="showModalCreateQuestion" type="button" class="btn btn-sm btn-primary">
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
              <th class="border-b-2 text-center dark:border-dark-5 width-60">Мультивыбор</th>
              <th class="border-b-2 text-center dark:border-dark-5 width-60">Порядковый номер</th>
              <th class="border-b-2 text-center dark:border-dark-5 width-60">Действия</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in anketa.questions" v-bind:key="item">
              <td class="border text-center">
                <div>RU: {{ item.nameRu }}</div>
                <div>KG: {{ item.nameKg }}</div>
                <div>EN: {{ item.nameEn }}</div>
              </td>
              <td class="border text-center">
                {{ item.multiple ? 'Да' : 'Нет' }}
              </td>
              <td class="border text-center">
                {{ item.number }}
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
                              @click="showModalUpdateQuestion(item)"
                              class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                        <Edit2Icon class="w-4 h-4 mr-2"/>
                        Редактировать
                      </button>
                      <button type="button" v-if="AdminService.hasAccess(['ANKETA_EDIT'])"
                              @click="setSelectedQuestion(item)"
                              class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                        <PlusIcon class="w-4 h-4 mr-2"/>
                        Ответы
                      </button>
                      <a v-if="AdminService.hasAccess(['ANKETA_EDIT'])"
                         class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                         href="javascript:;"
                         data-toggle="modal"
                         data-target="#delete-confirmation-modal-question"
                         @click="showModalDelete(item)"
                      >
                        <Trash2Icon class="w-4 h-4 mr-1"/>
                        Удалить
                      </a>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="anketa.questions.length===0">
              <td colspan="10" class="text-center border">(нет записей)</td>
            </tr>
            </tbody>
          </table>
        </div>
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
          <h2 class="font-medium text-base mr-auto">
            Добавление вопроса
          </h2>
        </div>
        <!-- END: Modal Header -->
        <!-- BEGIN: Modal Body -->
        <form v-on:submit.prevent="modalParams.isEdit ? updateQuestion() : createQuestion()">
          <div class="modal-body grid grid-cols-12 gap-4 gap-y-3">
            <div class="col-span-12">
              <label class="form-label">Наименование вопроса на кыргызском языке<span
                style="color: red">*</span></label>
              <input
                required
                v-model="modalParams.datas.nameKg"
                type="text"
                placeholder="Введите наименование вопроса на кыргызском..."
                class="form-control"
              />
            </div>
            <div class="col-span-12">
              <label class="form-label">Наименование вопроса на русском языке<span style="color: red">*</span></label>
              <input
                required
                v-model="modalParams.datas.nameRu"
                type="text"
                placeholder="Введите наименование вопроса на русском..."
                class="form-control"
              />
            </div>
            <div class="col-span-12">
              <label class="form-label">Наименование вопроса на анлийском языке<span style="color: red">*</span></label>
              <input
                required
                v-model="modalParams.datas.nameEn"
                type="text"
                placeholder="Введите наименование вопроса на ангийском..."
                class="form-control"
              />
            </div>
            <div class="col-span-12">
              <label class="form-label">Порядковый номер<span style="color: red">*</span></label>
              <input
                required
                v-model="modalParams.datas.number"
                type="number"
                placeholder="Введите порядковый номер..."
                class="form-control"
              />
            </div>
            <div class="col-span-12">
              <div class="form-check mt-5">
                <input id="horizontal-form-3" class="form-check-input" type="checkbox"
                       v-model="modalParams.datas.multiple">
                <label class="form-check-label" for="horizontal-form-3">Мультивыборочный</label>
              </div>
            </div>
          </div>
          <!-- END: Modal Body -->
          <!-- BEGIN: Modal Footer -->
          <div class="modal-footer text-right">
            <button
              type="button"
              @click="resetModalQuestionData"
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
    id="delete-confirmation-modal-question"
    class="modal"
    tabindex="-1"
    aria-hidden="true"
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
              data-dismiss="modal"
              class="btn btn-outline-secondary w-24 mr-1"
            >
              Отмена
            </button>
            <button @click="confirmDelete" data-dismiss="modal" type="button" class="btn btn-danger w-24">Удалить</button>
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
import AnswerComponent from "@/views/Variants/AnswerComponent.vue";

const route = useRoute()
const anketa = reactive({
  id: null,
  name: null,
  questions: []
})
let selectedQuestion = ref(null)
const itemForDelete = ref(null)
const modalParams = reactive({
  show: false,
  loading: false,
  isEdit: false,
  datas: {
    id: null,
    nameKg: null,
    nameRu: null,
    nameEn: null,
    multiple: false,
    variantId: null,
    number: null
  }
})

onMounted(() => {
  getInfo()
})

function showModalCreateQuestion() {
  modalParams.show = true
  modalParams.datas.variantId = route.query.id
}

function showModalUpdateQuestion(item) {
  modalParams.show = true
  modalParams.isEdit = true
  modalParams.datas.variantId = route.query.id
  modalParams.datas.id = item.id
  modalParams.datas.nameKg = item.nameKg
  modalParams.datas.nameRu = item.nameRu
  modalParams.datas.nameEn = item.nameEn
  modalParams.datas.multiple = item.multiple
  modalParams.datas.number = item.number

  hide()
}

function resetModalQuestionData() {
  modalParams.show = false
  modalParams.isEdit = false
  modalParams.datas.id = null
  modalParams.datas.nameRu = null
  modalParams.datas.nameKg = null
  modalParams.datas.nameEn = null
  modalParams.datas.number = null
  modalParams.datas.multiple = false

}

function createQuestion() {
  modalParams.loading = true
  QuestionService.createQuestion(modalParams.datas).then(response => {
    modalParams.loading = false
    createToast({
      title: 'Запись успешно добавлена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
    resetModalQuestionData()
    getInfo()
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

function updateQuestion() {
  modalParams.loading = true
  QuestionService.updateQuestion(modalParams.datas).then(response => {
    modalParams.loading = false
    createToast({
      title: 'Запись успешно обновлена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
    resetModalQuestionData()
    getInfo()
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

function setSelectedQuestion(item) {
  selectedQuestion.value = item
  hide()
}

function resetSelectedQuestion() {
  selectedQuestion.value = null
}

function updateAnketaName() {
  VariantsService.updateVariant(route.query.id, anketa.name).then(response => {
    createToast({
      title: 'Запись успешно изменена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
  }).catch(error => {
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

function showModalDelete(item) {
  itemForDelete.value = item
}

function confirmDelete() {
  QuestionService.deleteQuestion(itemForDelete.value.id).then(response => {
    createToast({
      title: 'Запись успешно удалена!'
    }, {
      type: 'warning',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
    getInfo()
  }).catch(error => {
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
function getInfo() {
  let oldSelectedId = null;
  if (selectedQuestion.value != null) {
    oldSelectedId = selectedQuestion.value.id
    resetSelectedQuestion()
  }
  VariantsService.getVariantById(route.query.id).then(response => {
    anketa.id = response.data.id
    anketa.name = response.data.name
    anketa.questions = response.data.questions
    if (oldSelectedId != null) {
      setSelectedQuestion(response.data.questions.find(item => item.id == oldSelectedId))
    }

  }).catch(error => {
    console.log(error)
  })
}
</script>
