<template>
  <div class="grid grid-cols-12 gap-4 mt-5">
    <div class="col-span-full">
      <h1 class="text-xl font-bold">Справочник систем</h1>
    </div>
    <!--table-->
    <div class="col-span-12 border rounded-xl p-3 bg-theme-4 shadow">
      <a
        @click="showCreateModal()"
        class="btn btn-primary">
        <PlusIcon class="w-4 h-4 mr-2"/>
        Добавить</a>
      <div class="overflow-auto lg:overflow-visible mt-8 sm:mt-0">
        <table class="table sm:mt-2 bg-white rounded-xl">
          <thead>
          <tr class="bg-gray-200 text-gray-700">
            <th>Название</th>
            <th>Сайт</th>
            <th>URL</th>
            <th class="text-center">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="item in genResult.result"
            :key="item"
            class="hover:bg-gray-200"
          >
            <td class="border-b dark:border-dark-5">
              {{ item.name != null ? item.name : '(отсутствует)' }}
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.site != null ? item.site : '(отсутствует)' }}
            </td>
            <td class="border-b dark:border-dark-5">
              {{ item.url != null ? item.url : '(отсутствует)' }}
            </td>
            <td class="table-report__action border-b dark:border-dark-5">
              <div class="flex justify-center items-center">
                <a class="flex items-center mr-3"
                   href="javascript:;"
                   @click="showEditModal(item)">
                  <CheckSquareIcon class="w-4 h-4 mr-1"/>
                  Редактировать
                </a>
                <a
                  class="flex items-center text-theme-6"
                  href="javascript:;"
                  data-toggle="modal"
                  data-target="#delete-confirmation-modal"
                  @click="showModalDelete(item)"
                >
                  <Trash2Icon class="w-4 h-4 mr-1"/>
                  Удалить
                </a>
              </div>
            </td>
          </tr>
          <tr v-if="genResult.result.length==0">
            <td class="text-center" colspan="3">
              (нет записей)
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!--      Paggination-->
      <div
        class="intro-y flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3"
      >

        <ul class="pagination">
          <li v-if="5 < genResult.currentPage">
            <a class="pagination__link " @click="getByPagination(1)">
              <ChevronsLeftIcon class="w-4 h-4"/>
            </a>
          </li>
          <li v-if="genResult.currentPage > 1">
            <a class="pagination__link"
               @click="getByPagination(genResult.currentPage - 1)">
              <ChevronLeftIcon class="w-4 h-4"/>
            </a>
          </li>
          <template v-for="page in genResult.pagenumbersEnd" v-bind:key='page'>
            <li v-if="genResult.pagenumbersStart <= page || page >= genResult.pagenumbersEnd">
              <a class="pagination__link"
                 v-bind:class="{ 'pagination__link pagination__link--active' : page === genResult.currentPage}"
                 @click="getByPagination(page)">
                <p class="" v-bind:class="{ 'text-black' : page === genResult.currentPage}">
                  {{ page }}
                </p>
              </a>
            </li>
          </template>
          <li v-if="genResult.currentPage !== genResult.totalPages">
            <a class="pagination__link "
               @click="getByPagination(genResult.currentPage + 1)">
              <ChevronRightIcon class="w-4 h-4"/>
            </a>
          </li>
          <li v-if="genResult.currentPage < genResult.totalPages - 5">
            <a class="pagination__link"
               @click="getByPagination(genResult.totalPages)">
              <ChevronsRightIcon class="w-4 h-4"/>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <!-- BEGIN: Modal Content -->
  <div
    v-if="modalParams.show"
    id="education-modal"
    class="modal overflow-y-auto show custom-modal"
    aria-hidden="true"
    data-backdrop='static'
    style="z-index: 999!important;"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <!-- BEGIN: Modal Header -->
        <div class="modal-header">
          <h2 class="font-medium text-base mr-auto">
            <span v-if="!modalParams.isEditModal">Добавление записи</span>
            <span v-if="modalParams.isEditModal">Редактирование записи</span>
          </h2>
        </div>
        <!-- END: Modal Header -->
        <!-- BEGIN: Modal Body -->
        <form v-on:submit.prevent="modalParams.isEditModal ? edit() : create()">
          <div class="modal-body grid grid-cols-12 gap-4 gap-y-3">

            <!-- Название-->
            <div class="col-span-12">
              <label class="form-label">Название <span style="color: red">*</span></label>
              <input
                v-model="modalParams.datas.name"
                required
                type="text"
                placeholder="Введите название..."
                class="form-control"
              />
            </div>
            <!-- Site-->
            <div class="col-span-12">
              <label class="form-label">Введите сайт <span style="color: red">*</span></label>
              <input
                v-model="modalParams.datas.site"
                required
                type="text"
                placeholder="Введите сайт"
                class="form-control"
              />
            </div>
            <!-- URL-->
            <div class="col-span-12">
              <label class="form-label">Введите URL <span style="color: red">*</span></label>
              <input
                v-model="modalParams.datas.url"
                required
                type="text"
                placeholder="Введите URL"
                class="form-control"
              />
            </div>
            <!-- Secret-->
            <div class="col-span-12">
              <label class="form-label">Введите Secret <span style="color: red">*</span></label>
              <input
                v-model="modalParams.datas.secret"
                required
                type="text"
                placeholder="Введите Secret"
                class="form-control"
              />
            </div>
          </div>
          <!-- END: Modal Body -->
          <!-- BEGIN: Modal Footer -->
          <div class="modal-footer text-right">
            <button
              v-show="!loading"
              type="button"
              @click="resetData"
              id="close"
              class="btn btn-outline-secondary mr-1"
            >
              Отмена
            </button>
            <div v-if="loading" class="col-span-12 flex flex-col justify-end items-center">
              <LoadingIcon class="w-20 h-20" icon="tail-spin"/>
            </div>
            <button v-if="!loading" type="submit" class="btn btn-primary">
              Сохранить
            </button>
          </div>
        </form>
        <!-- END: Modal Footer -->
      </div>
    </div>
  </div>

  <!-- BEGIN: Delete Confirmation Modal -->
  <div
    id="delete-confirmation-modal"
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
            <button @click="confirmDelete" data-dismiss="modal" type="button" class="btn btn-danger w-24">Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END: Modal Content -->
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {createToast} from "mosha-vue-toastify";
import {DictionariesService} from "@/services";

const loading = ref(false)
const genResult = reactive({
  currentPage: null,
  pageSize: null,
  totalPages: null,
  totalItems: null,
  result: [],
  pagenumbersStart: null,
  pagenumbersEnd: null
})
const modalParams = reactive({
  show: false,
  isEditModal: false,
  datas: {
    id: null,
    name: null,
    site: null,
    url: null,
    secret: null
  }
})
const objectForDelete = ref({
  type: Object
})

onMounted(async () => {
  await getByPagination(1)
})

async function getByPagination(page) {
  try {
    await (async () => {
      DictionariesService.getSystemasWithPagination({page: page, size: 10}).then(response => {
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

function showCreateModal() {
  modalParams.show = true
  modalParams.isEditModal = false
}

function showEditModal(item) {
  modalParams.show = true
  modalParams.isEditModal = true
  modalParams.datas.id = item.id
  modalParams.datas.site = item.site
  modalParams.datas.name = item.name
  modalParams.datas.url = item.url
  modalParams.datas.secret = item.secret
}

function showModalDelete(item) {
  objectForDelete.value = item
}

function confirmDelete() {
  DictionariesService.deleteSystema({id: objectForDelete.value.id}).then(response => {
    createToast({
      title: 'Запись успешно удалена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
    })
    getByPagination(1)
  }).catch(error => {
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true
    })
  })
}

function edit() {
  loading.value = true
  DictionariesService.editSystema(modalParams.datas).then(response => {
    loading.value = false
    createToast({
      title: 'Запись успешно изменена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
    })
    resetData()
    getByPagination(1)
  }).catch(error => {
    loading.value = false
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true
    })
  })
}

function create() {
  loading.value = true
  DictionariesService.createSystema(modalParams.datas).then(response => {
    loading.value = false
    createToast({
      title: 'Запись успешно сохранена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
    })
    getByPagination(1)
    resetData()
  }).catch(error => {
    loading.value = false
    createToast({
      title: 'Произошла ошибка!',
    }, {
      type: 'danger',
      position: 'top-right',
      showIcon: true
    })
  })
}

function resetData() {
  modalParams.show = false
  modalParams.datas.id = null
  modalParams.datas.site = null
  modalParams.datas.name = null
  modalParams.datas.url = null
  modalParams.datas.secret = null
}
</script>
