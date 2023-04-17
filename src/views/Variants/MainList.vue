<template>
  <div class="grid grid-cols-12 gap-4 p-3">
    <div class="col-span-12">
      <span class="font-bold text-xl">Анкеты</span>
    </div>
    <!-- ФИЛЬТР-->
    <div class="col-span-12" v-if="AdminService.hasAccess(['ANKETA_ADD'])">
      <a class="btn btn-primary" @click="showModalCreate()">Добавить</a>
    </div>
  </div>
  <div class="box p-3 rounded-xl">
    <div class="grid grid-cols-12 gap-4 p-2">
      <div class="col-span-12 lg:col-span-3 md:col-span-4">
        <span class="font-medium">Кол-во анкет:</span> {{ paginationParams.totalItems }}
      </div>
    </div>
    <div class="preview">
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="rounded-full sticky">
          <tr class="bg-gray-200 text-gray-700">
            <th class="border-b-2 text-center dark:border-dark-5 width-60">Название</th>
            <th class="border-b-2 text-center dark:border-dark-5 width-60">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in paginationParams.result" v-bind:key="item">
            <td class="border text-center">
              {{ item.name }}
            </td>
            <td class="border text-center">
              <div class="dropdown">
                <button class="dropdown-toggle btn btn-sm btn-secondary" aria-expanded="false">
                  Действия
                  <ChevronDownIcon class="w-4 h-4 ml-2"/>
                </button>
                <div class="dropdown-menu">
                  <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
                    <router-link v-if="AdminService.hasAccess(['ANKETA_EDIT'])"
                                 :to="{name: 'VariantsEdit', query: { id: item.id }}"
                                 @click="hide"
                                 class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">
                      <Edit2Icon class="w-4 h-4 mr-2"/>
                      Редактировать
                    </router-link>
                    <a v-if="AdminService.hasAccess(['ANKETA_EDIT'])"
                       class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"
                       href="javascript:;"
                       data-toggle="modal"
                       data-target="#delete-confirmation-modal"
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
          <tr v-if="paginationParams.result.length===0 && !paginationParams.loading">
            <td colspan="10" class="text-center border">(нет записей)</td>
          </tr>
          <tr v-if="paginationParams.loading">
            <td colspan="10">
              <div class="col-span-12 flex flex-col justify-end items-center">
                <LoadingIcon class="w-20 h-20" icon="puff"/>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!--      Paggination-->
      <div
        class="flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-3 rounded-xl"
        style="background-color: antiquewhite;"
      >

        <ul class="pagination">
          <li v-if="paginationParams.currentPage > 3">
            <a class="pagination__link " @click="getByPagination(1, filterValues)">
              <ChevronsLeftIcon class="w-4 h-4"/>
            </a>
          </li>
          <li v-if="paginationParams.currentPage > 1">
            <a class="pagination__link"
               @click="getByPagination(paginationParams.currentPage - 1, filterValues)">
              <ChevronLeftIcon class="w-4 h-4"/>
            </a>
          </li>
          <template v-for="page in paginationParams.pagenumbersEnd" v-bind:key='page'>
            <li v-if="paginationParams.pagenumbersStart <= page || page >= paginationParams.pagenumbersEnd">
              <a class="pagination__link"
                 v-bind:class="{ 'pagination__link pagination__link--active' : page === paginationParams.currentPage}"
                 @click="getByPagination(page, filterValues)">
                <p class="" v-bind:class="{ 'text-black' : page === paginationParams.currentPage}">
                  {{ page }}
                </p>
              </a>
            </li>
          </template>
          <li v-if="paginationParams.currentPage !== paginationParams.totalPages">
            <a class="pagination__link "
               @click="getByPagination(paginationParams.currentPage + 1, filterValues)">
              <ChevronRightIcon class="w-4 h-4"/>
            </a>
          </li>
          <li v-if="paginationParams.currentPage < paginationParams.totalPages - 3">
            <a class="pagination__link"
               @click="getByPagination(paginationParams.totalPages, filterValues)">
              <ChevronsRightIcon class="w-4 h-4"/>
            </a>
          </li>
        </ul>

        <select v-model.number="paginationParams.pageSize" @change="getByPagination(1, filterValues)"
                class="w-20 form-select mt-3 sm:mt-0">
          <option value="10">10</option>
          <option value="25">25</option>
          <option>35</option>
          <option>50</option>
        </select>
      </div>
    </div>
  </div>

<!--  CREATE MODAL-->
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
            Добавление анкеты
          </h2>
        </div>
        <!-- END: Modal Header -->
        <!-- BEGIN: Modal Body -->
        <form v-on:submit.prevent="create()">
          <div class="modal-body grid grid-cols-12 gap-4 gap-y-3">
            <div class="col-span-12">
              <label class="form-label">Наименование анкеты <span style="color: red">*</span></label>
              <input
                required
                v-model="modalParams.datas.name"
                type="text"
                placeholder="Введите наименование анкеты..."
                class="form-control"
              />
            </div>
          </div>
          <!-- END: Modal Body -->
          <!-- BEGIN: Modal Footer -->
          <div class="modal-footer text-right">
            <button
              type="button"
              @click="resetData"
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
            <button @click="confirmDelete" data-dismiss="modal" type="button" class="btn btn-danger w-24">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {AdminService, VariantsService} from "@/services";
import Spinner from "@/app-components/UIComponents/Spinner.vue";
import {createToast} from "mosha-vue-toastify";
import {useRouter} from "vue-router";

const paginationParams = reactive({
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  pageSize: 10,
  pagenumbersStart: 1,
  pagenumbersEnd: 0,
  result: [],
  loading: false
})
const router = useRouter()
const modalParams = reactive({
  show: false,
  loading: false,
  datas: {
    name: null
  }
})

const filter = reactive({
  nameProject: '',
  dateStartGraphik: '',
  dateEndGraphik: '',
  dateStartPogash: '',
  dateEndPogash: '',
  statusProjectPlan: '',
  finansEnum: ''
})

function resetFilter() {
  filter.nameProject = ''
  filter.dateStartGraphik = ''
  filter.dateEndGraphik = ''
  filter.dateStartPogash = ''
  filter.dateEndPogash = ''
  filter.statusProjectPlan = ''
  filter.finansEnum = ''


  getByPagination(1)
}

const filterShow = ref(false)
const itemForDelete = ref(null)

function getByPagination(pageNumber) {
  paginationParams.loading = true
  VariantsService.getVariants(pageNumber, paginationParams.pageSize).then(response => {
    paginationParams.result = response.data.result
    paginationParams.currentPage = response.data.currentPage
    paginationParams.totalPages = response.data.totalPages
    paginationParams.totalItems = response.data.totalItems
    paginationParams.pagenumbersStart = paginationParams.currentPage - 1 > 1 ? paginationParams.currentPage - 1 : 1
    paginationParams.pagenumbersEnd = paginationParams.currentPage + 5 < paginationParams.totalPages ? paginationParams.currentPage + 5 : paginationParams.totalPages
    paginationParams.loading = false
  }).catch(error => {
    paginationParams.loading = false
  })
}

function showModalCreate() {
  modalParams.show = true
}

function create() {
  modalParams.loading = true
  VariantsService.createVariant(modalParams.datas).then(response => {
    createToast({
      title: 'Запись успешно сохранена!'
    }, {
      type: 'success',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
    modalParams.loading = false
    resetData()
    router.push({name: 'VariantsEdit', query: {id: response.data.id}})
  }).catch(error => {
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

function resetData() {
  modalParams.show = false
  modalParams.datas.name = null
}

function showModalDelete(item) {
  itemForDelete.value = item
}

function confirmDelete() {
  VariantsService.deleteVariant(itemForDelete.value.id).then(response => {
    createToast({
      title: 'Запись успешно удалена!'
    }, {
      type: 'warning',
      position: 'top-right',
      showIcon: true,
      timeout: 2000
    })
    getByPagination(1)
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
onMounted(() => {
  getByPagination(1)
})
</script>
