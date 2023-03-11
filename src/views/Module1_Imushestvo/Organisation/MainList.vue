<template>
  <div class="grid grid-cols-12 gap-4 p-3">
    <div class="col-span-12">
      <span class="font-bold text-xl">Организации</span>
    </div>
    <div class="col-span-12">
      <button class="btn btn-primary">Добавить</button>
    </div>
  </div>
  <div class="box p-3 rounded-xl">
    <div class="grid grid-cols-12 gap-2">
      <div class="col-span-12 mt-2">
        <div class="box p-3 rounded-xl">
          <div class="grid grid-cols-12 gap-4 p-2">
            <div class="col-span-12 lg:col-span-3 md:col-span-4">
              <span class="font-medium">Кол-во организации:</span> {{ paginationParams.totalItems }}
            </div>
          </div>
          <div class="preview">
            <div class="overflow-x-auto">
              <table class="table">
                <thead class="rounded-full sticky">
                <tr class="bg-gray-200 text-gray-700">
                  <th class="border-b-2 text-center dark:border-dark-5 width-60">Название организации</th>
                  <th class="border-b-2 text-center dark:border-dark-5 width-60">ИНН/Код</th>
                  <th class="border-b-2 text-center dark:border-dark-5 width-60">Код ОКПО</th>
                  <th class="border-b-2 text-center dark:border-dark-5 width-60">Тип организации</th>
                  <th class="border-b-2 text-center dark:border-dark-5 width-60">Статус</th>
                  <th class="border-b-2 text-center dark:border-dark-5 width-60">Действия</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in paginationParams.result" v-bind:key="item" class="hover:bg-gray-200">
                  <td class="border text-center">{{ item.name }}</td>
                  <td class="border text-center">{{ item.inn }}</td>
                  <td class="border text-center">{{ item.okpoCode }}</td>
                  <td class="border text-center">{{ item.typeOrganisationName }}</td>
                  <td class="border text-center">{{ item.statusName }}</td>
                  <td class="border text-center">
                    <div class="dropdown">
                      <button class="dropdown-toggle btn btn-primary" aria-expanded="false">
                        Действия
                        <ChevronDownIcon class="w-4 h-4 ml-2"/>
                      </button>
                      <div class="dropdown-menu">
                        <div class="dropdown-menu__content box dark:bg-dark-1 p-2">
<!--                          <router-link v-if="AdminService.hasAccess(['WAITING_ACCEPT'])"-->
<!--                                       :to="{path: 'ambulatory-select-obrashenie/'+item.id, query: { isWaiting: true }}"-->
<!--                                       @click="hide"-->
<!--                                       class="flex items-center block p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md">-->
<!--                            <Edit2Icon class="w-4 h-4 mr-2"/>-->
<!--                            Принять-->
<!--                          </router-link>-->
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
                  <a class="pagination__link " @click="getByPagination(1)">
                    <ChevronsLeftIcon class="w-4 h-4"/>
                  </a>
                </li>
                <li v-if="paginationParams.currentPage > 1">
                  <a class="pagination__link"
                     @click="getByPagination(paginationParams.currentPage - 1)">
                    <ChevronLeftIcon class="w-4 h-4"/>
                  </a>
                </li>
                <template v-for="page in paginationParams.pagenumbersEnd" v-bind:key='page'>
                  <li v-if="paginationParams.pagenumbersStart <= page || page >= paginationParams.pagenumbersEnd">
                    <a class="pagination__link"
                       v-bind:class="{ 'pagination__link pagination__link--active' : page === paginationParams.currentPage}"
                       @click="getByPagination(page)">
                      <p class="" v-bind:class="{ 'text-black' : page === paginationParams.currentPage}">
                        {{ page }}
                      </p>
                    </a>
                  </li>
                </template>
                <li v-if="paginationParams.currentPage !== paginationParams.totalPages">
                  <a class="pagination__link "
                     @click="getByPagination(paginationParams.currentPage + 1)">
                    <ChevronRightIcon class="w-4 h-4"/>
                  </a>
                </li>
                <li v-if="paginationParams.currentPage < paginationParams.totalPages - 3">
                  <a class="pagination__link"
                     @click="getByPagination(paginationParams.totalPages)">
                    <ChevronsRightIcon class="w-4 h-4"/>
                  </a>
                </li>
              </ul>

              <select v-model.number="paginationParams.pageSize" @change="getByPagination(1)"
                      class="w-20 form-select mt-3 sm:mt-0">
                <option value="10">10</option>
                <option value="25">25</option>
                <option>35</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {OrganisationService} from "@/services";



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

function getByPagination(pageNumber) {
  paginationParams.loading = true
  OrganisationService.getOrganisationsByPage(pageNumber, paginationParams.pageSize).then(response => {
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

onMounted(() => {
  getByPagination(1)
})
</script>

<style scoped>

</style>
